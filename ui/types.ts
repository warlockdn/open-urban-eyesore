export interface MapData {
  name: string;
  city: string;
  data: MapPoint[];
}

export interface MapPoint {
  lat: number;
  long: number;
  image: string;
  category: number;
}