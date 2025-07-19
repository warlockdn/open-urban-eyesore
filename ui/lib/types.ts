export interface MapPoint {
  uuid?: string;
  lat: number;
  long: number;
  image: string;
  image_thumb: string;
  category: number;
  created_at?: string;
}

export interface Submission {
  /** Issue ID - For the UI */
  id: number;
  /** Issue number */
  number: number;
  /** Issue state */
  state: string;
  /** Issue labels */
  labels: string[];
  /** Issue URL */
  url: string;
}