import { MapPoint, UploadResponse } from "../types";
import { env } from "cloudflare:workers";
import { createIssue } from "./issue";

export async function uploadImage(image: { url: string, thumbnailUrl: string }, lat: number, lng: number) {
  try {
    const mapPoint: Partial<MapPoint> = {
      lat,
      long: lng,
      image: image.url,
      image_thumb: image.thumbnailUrl
    }
  
    const issueUrl = await createIssue(mapPoint);
    console.log('Issue created successfully', JSON.stringify(mapPoint));
    return issueUrl;
  } catch (error) {
    console.error('Error uploading image', JSON.stringify(error));
    throw error;
  }
}