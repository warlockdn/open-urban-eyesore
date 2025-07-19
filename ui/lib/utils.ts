import * as Sentry from "@sentry/nextjs";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getColor(category: number) {
  // Simple example, tweak as needed
  switch (category) {
    case 0: return "#fa285c";
    case 1: return "#eb1a4e";
    case 2: return "#d11141";
    case 3: return "#ba0734";
    default: return "#a8002a";
  }
}

/**
 * TOTO: implement this
 * Util to tell if the given lat and lng are in the range of City
 */
export function isInCity(lat: number, lng: number) {
  return true
  // return lat >= 12.9716 && lat <= 13.0437 && lng >= 77.5536 && lng <= 77.6172;
}

export function convertExifToFormattedString(exif: ExifReader.Tags | null) {
  if (!exif) {
    return "No exif data";
  }
  const exifData = Object.entries(exif).map(([key, value]) => {
    return `${key}: ${value.description}`;
  });

  return exifData.join("\n");
}

/**
 * Report an error to Sentry
 * @param error - The error to report
 * @param extra - Extra data to include in the report
 */
export function reportToSentry(error: Error, extra: Record<string, any> = {}) {
  Sentry.captureException(error, {
    extra: {
      ...extra,
      userAgent: navigator.userAgent,
    },
  });
}