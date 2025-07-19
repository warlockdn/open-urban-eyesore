import * as Sentry from "@sentry/nextjs";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Submission } from "./types";

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
 * {
      "south": 12.8356,
      "north": 13.1391,
      "west": 77.4607,
      "east": 77.7126
    }
 * Util to tell if the given lat and lng are in the range of Bengaluru
 */
export function isInBengaluru(lat: number, lng: number) {
  return true;
  return lat >= 12.8356 && lat <= 13.1391 && lng >= 77.4607 && lng <= 77.7126;
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

export function getSubmissionsFromLocalStorage(): Submission[] {
  try {
    const submissions = localStorage.getItem("submissions");
    if (submissions === 'undefined' || !submissions) {
      return [];
    }
    const parsedSubmissions = JSON.parse(submissions || "[]") as Submission[];
    if (parsedSubmissions.length === 0) {
      return [];
    }
    return parsedSubmissions;
  } catch (error) {
    return [];
  }
}

export function addSubmissionToLocalStorage(submission: Submission) {
  const submissions = getSubmissionsFromLocalStorage();
  submissions.push(submission);
  localStorage.setItem("submissions", JSON.stringify(submissions));
}

export function updateSubmissionStatusInLocalStorage(statuses: { number: number, status: "approved" | "rejected" }[]) {
  const submissions = getSubmissionsFromLocalStorage();
  submissions.forEach((submission) => {
    if (statuses[submission.number]) {
      submission.state = "closed";
      submission.labels.push(statuses[submission.number].status);
    }
  });
  localStorage.setItem("submissions", JSON.stringify(submissions));
}
