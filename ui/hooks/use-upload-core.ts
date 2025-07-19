"use client"

import { useCallback } from "react";
import exifReader from "exifreader";
import { toast } from "sonner";

import useImageKitUpload from "@/components/upload/imagekit";
import { convertExifToFormattedString, isInCity, reportToSentry } from "@/lib/utils";

export interface UploadCoreOptions {
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  onUploadError?: (error: string) => void;
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface UploadCallbacks {
  onProgress: (file: File, progress: number) => void;
  onSuccess: (file: File) => void;
  onError: (file: File, error: Error) => void;
}

export interface LocationData {
  lat: number;
  lng: number;
  fromCapture?: boolean;
}

export function useUploadCore(options: UploadCoreOptions = {}) {
  const {
    acceptedFileTypes,
    maxFileSize = 10 * 1024 * 1024, // Default 10MB
    onUploadError,
  } = options;

  const { handleUpload: handleImageKitUpload } = useImageKitUpload();

  const formatBytes = useCallback((bytes: number, decimals = 2): string => {
    if (!+bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i] || "Bytes"}`;
  }, []);

  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      if (acceptedFileTypes && acceptedFileTypes.length > 0 && !acceptedFileTypes.includes(file.type)) {
        const error = `Invalid file type. Accepted: ${acceptedFileTypes
          .map((t) => t.split("/")[1])
          .join(", ")
          .toUpperCase()}`;
        return { valid: false, error };
      }

      if (maxFileSize && file.size > maxFileSize) {
        const error = `File size exceeds the limit of ${formatBytes(maxFileSize)}.`;
        return { valid: false, error };
      }

      return { valid: true };
    },
    [acceptedFileTypes, maxFileSize, formatBytes]
  );

  const extractExifData = useCallback(
    async (file: File): Promise<exifReader.Tags | null> => {
      try {
        const buffer = await file.arrayBuffer();
        return exifReader.load(buffer);
      } catch (error) {
        console.error("Failed to extract EXIF data:", error);
        return null;
      }
    },
    []
  );

  const validateLocation = useCallback(
    (exifData: exifReader.Tags): { valid: boolean; lat?: number; lng?: number; error?: string } => {
      const { GPSLatitude, GPSLongitude } = exifData;
      const lat = parseFloat(GPSLatitude?.description as string);
      const lng = parseFloat(GPSLongitude?.description as string);

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return {
          valid: false,
          error: "Invalid GPS data. Please ensure the image has GPS data.",
        };
      }

      if (!isInCity(lat, lng)) {
        return {
          valid: false,
          error: `Image is not in ${process.env.NEXT_PUBLIC_CITY_NAME}. Please upload the image from ${process.env.NEXT_PUBLIC_CITY_NAME}.`,
        };
      }

      return { valid: true, lat, lng };
    },
    []
  );

  const generateUploadToken = useCallback(async (): Promise<string | null> => {
    try {
      const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API}/api/tokens/upload`);
      const tokenData = (await tokenResponse.json()) as { data: { token: string } };
      return tokenData.data.token || null;
    } catch (error) {
      console.error("Failed to generate upload token:", error);
      return null;
    }
  }, []);

  const uploadToAPI = useCallback(
    async (
      uploadResponse: any,
      lat: number,
      lng: number,
      token: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/upload`, {
          method: "POST",
          body: JSON.stringify({
            image: {
              fileId: uploadResponse?.fileId,
              url: uploadResponse?.url,
              thumbnailUrl: uploadResponse?.thumbnailUrl,
            },
            lat,
            lng,
            token,
          }),
        });

        if (!response.ok) {
          return { success: false, error: "Failed to upload image to API" };
        }

        await response.json();
        return { success: true };
      } catch (error) {
        console.error("API upload failed:", error);
        return { success: false, error: "Failed to upload image to API" };
      }
    },
    []
  );

  const uploadSingleFile = useCallback(
    async (
      file: File,
      callbacks: UploadCallbacks
    ): Promise<void> => {
      const { onProgress, onSuccess, onError } = callbacks;

      try {
        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
          onError(file, new Error(validation.error || "File validation failed"));
          return;
        }
        const exifData = await extractExifData(file);

        const lat = parseFloat(exifData?.GPSLatitude?.description as string);
        const lng = parseFloat(exifData?.GPSLongitude?.description as string);

        if (Number.isNaN(lat) || Number.isNaN(lng)) {
          toast.error("Invalid GPS data", {
            description: "Please ensure the image has GPS data.",
            position: "top-center",
          })
          reportToSentry(new Error("Invalid GPS data"), {
            lat,
            lng,
            exif: convertExifToFormattedString(exifData)
          });
          onError(file, new Error("Invalid GPS data"));
          throw new Error("Invalid GPS data");
        }
        
        const locationValidation = validateLocation(exifData as exifReader.Tags);

        if (!locationValidation.valid) {
          onError(file, new Error(locationValidation.error || "Location validation failed"));
          reportToSentry(new Error(locationValidation.error || "Location validation failed"), {
            exif: convertExifToFormattedString(exifData),
          });
          throw new Error(locationValidation.error || "Location validation failed");
        }


        // Update progress
        onProgress(file, 25);

        // Generate upload token
        const token = await generateUploadToken();
        if (!token) {
          reportToSentry(new Error("Failed to generate upload token"), {
            exif: convertExifToFormattedString(exifData),
          });
          onError(file, new Error("Failed to generate upload token"));
          return;
        }

        // Update progress
        onProgress(file, 50);

        // Upload to ImageKit
        const uploadResponse = await handleImageKitUpload(file);
        if (!uploadResponse) {
          reportToSentry(new Error("Failed to upload to ImageKit"), {
            exif: convertExifToFormattedString(exifData),
          });
          onError(file, new Error("Failed to upload to ImageKit"));
          return;
        }

        // Update progress
        onProgress(file, 75);

        // Upload to API
        const apiResult = await uploadToAPI(uploadResponse, lat, lng, token);
        if (!apiResult.success) {
          reportToSentry(new Error(apiResult.error || "API upload failed"), {
            exif: convertExifToFormattedString(exifData),
          });
          onError(file, new Error(apiResult.error || "API upload failed"));
          return;
        }

        // Success
        onProgress(file, 100);
        onSuccess(file);
      } catch (error) {
        console.error("Upload failed:", error);
        onError(file, error instanceof Error ? error : new Error("Upload failed"));
      }
    },
    [
      validateFile,
      extractExifData,
      validateLocation,
      generateUploadToken,
      handleImageKitUpload,
      uploadToAPI,
    ]
  );

  const getCurrentLocation = useCallback((): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reportToSentry(new Error("Could not get user location"), {
            userAgent: navigator.userAgent,
            geolocationError: error.message,
          });
          reject(new Error("Could not get your location"));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }, []);

  return {
    // Core upload functions
    uploadSingleFile,
    validateFile,
    extractExifData,
    validateLocation,
    generateUploadToken,
    uploadToAPI,
    getCurrentLocation,
    
    // Utilities
    formatBytes,
    
    // Error handling
    onUploadError,
  };
} 