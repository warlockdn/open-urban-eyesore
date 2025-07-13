"use client";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Upload, X, MapPin } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useMultiFileUpload } from "@/hooks/use-multi-file-upload";

export default function MultiUpload() {
  const {
    files,
    setFiles,
    onUpload,
    isUploading,
    maxFiles,
  } = useMultiFileUpload({
    maxFiles: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    acceptedFileTypes: ['image/jpeg', 'image/jpg'],
    parallel: true, // Upload files in parallel for faster processing
    onFileReject: (file, reason) => {
      toast.error("File rejected", {
        description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" - ${reason}`,
      });
    },
    onUploadError: (error: string) => {
      toast.error("Upload failed", {
        description: `"${error}"`,
      });
    },
    onUploadComplete: () => {
      toast.success("Upload complete");
      setTimeout(() => {
        setFiles([]);
      }, 1000);
    },
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md mx-auto space-y-6">
      <FileUpload
        value={files}
        onValueChange={setFiles}
        onUpload={onUpload}
        maxFiles={maxFiles}
        maxSize={10 * 1024 * 1024}
        className="w-full"
        multiple
        accept="image/jpeg, image/jpg"
        disabled={isUploading}
      >
        <FileUploadDropzone>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center justify-center rounded-full border p-3">
              <Upload className="size-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm">
                {isUploading ? "Uploading..." : "Drag & drop images here"}
              </p>
              <p className="text-muted-foreground text-xs">
                Or click to browse (max {maxFiles} files, up to 10MB each)
              </p>
              <p className="text-muted-foreground text-xs flex items-center justify-center gap-1">
                <MapPin className="size-3" />
                Images must be taken in Bengaluru with GPS data
              </p>
            </div>
          </div>
          <FileUploadTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-fit"
              disabled={isUploading}
            >
              <Upload className="size-4 mr-2" />
              Browse files
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>

        {files.length > 0 && (
          <div className="space-y-4">
            <FileUploadList orientation="horizontal" className="gap-3">
              {files.map((file, index) => (
                <FileUploadItem key={index} value={file} className="p-0">
                  <FileUploadItemPreview className="size-20 [&>svg]:size-12">
                    <FileUploadItemProgress variant="fill" size={40} />
                  </FileUploadItemPreview>
                  <FileUploadItemMetadata className="sr-only" />
                  <FileUploadItemDelete asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="-top-1 -right-1 absolute size-5 rounded-full"
                    >
                      <X className="size-3" />
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </div>
        )}
      </FileUpload>
      <Toaster richColors position="top-center" closeButton />
    </div>
  );
}