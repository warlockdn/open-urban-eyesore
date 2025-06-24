import type { Context } from "hono";

export type AppContext = Context<{ Bindings: Env }>;

export interface UploadResponse {
  fileId: string
  name: string
  size: number
  filePath: string
  url: string
  fileType: string
  height: number
  width: number
  orientation: number
  thumbnailUrl: string
  AITags: any
}

export interface MapData {
  name: string;
  city: string;
  data: MapPoint[];
}

export interface MapPoint {
  lat: number;
  long: number;
  image: string;
  image_thumb: string;
  category: number;
  created_at?: string;
}

export enum Category {
  minor = 0,
  major = 1,
  severe = 2,
  critical = 3,
}

export interface Moderators {
  [key: string]: string[];
}

export enum GithubIssueLabels {
  requires_further_review = "requires_further_review",
  rejected = "rejected",
  approved = "approved",
  category_critical = "category_critical",
  category_severe = "category_severe",
  category_major = "category_major",
  category_minor = "category_minor",
  duplicate = "duplicate",
  question = "question",
  new = "new",
  processed = "processed",
}