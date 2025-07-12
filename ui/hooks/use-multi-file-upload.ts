"use client"

import { useState, useCallback } from "react";
import type { FileUploadProps } from "@/components/ui/file-upload";
import { useUploadCore, type UploadCoreOptions } from "./use-upload-core";

export interface MultiFileUploadOptions extends UploadCoreOptions {
  maxFiles?: number;
  parallel?: boolean;
  onFileReject?: (file: File, reason: string) => void;
  onUploadComplete?: () => void;
}

export function useMultiFileUpload(options: MultiFileUploadOptions = {}) {
  const { maxFiles = 10, parallel = false, onFileReject, onUploadComplete, ...coreOptions } = options;

  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadCore = useUploadCore(coreOptions);

  // DiceUI-compatible handler
  const onUpload: NonNullable<FileUploadProps["onUpload"]> = useCallback(
    async (incomingFiles, { onProgress, onSuccess, onError }) => {
      // Filter duplicates & enforce maxFiles
      const queue: File[] = [];
      for (const file of incomingFiles) {
        if (files.length + queue.length >= maxFiles) {
          onFileReject?.(file, `Maximum ${maxFiles} files allowed`);
          continue;
        }
        if (files.some((f) => f.name === file.name && f.size === file.size)) {
          onFileReject?.(file, "File already added");
          continue;
        }

        const validation = uploadCore.validateFile(file);
        if (!validation.valid) {
          onFileReject?.(file, validation.error || "File validation failed");
          continue;
        }

        queue.push(file);
      }

      if (queue.length === 0) return;

      setIsUploading(true);

      const uploadOne = async (file: File) => {
        await uploadCore.uploadSingleFile(file, { onProgress, onSuccess, onError });
      };

      try {
        if (parallel) {
          await Promise.all(queue.map(uploadOne));
        } else {
          for (const file of queue) {
            await uploadOne(file);
          }
        }
      } finally {
        setIsUploading(false);
        onUploadComplete?.();
      }
    },
    [files, maxFiles, onFileReject, parallel, uploadCore],
  );

  return {
    files,
    setFiles,
    onUpload,
    isUploading,
    formatBytes: uploadCore.formatBytes,
    maxFiles,
  } as const;
}