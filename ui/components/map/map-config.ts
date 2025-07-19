import { Map, Satellite, Mountain, Palette } from "lucide-react"

// Bengaluru coordinates
export const BENGALURU_CENTER: [number, number] = [12.9716, 77.5946]

export const BENGALURU_BOUNDS: [[number, number], [number, number]] = [
  [12.83, 77.45], // SW
  [13.05, 77.72], // NE
]

// Guwahati coordinates
export const GUWAHATI_CENTER: [number, number] = [26.1445, 91.7364]

export const GUWAHATI_BOUNDS: [[number, number], [number, number]] = [
  [26.12, 91.67], // SW
  [26.20, 91.85], // NE
]

export const getCityBounds = (city: string) => {
  switch (city) {
    case "Bengaluru":
      return BENGALURU_BOUNDS;
    case "Guwahati":
      return GUWAHATI_BOUNDS;
    default:
      return BENGALURU_BOUNDS;
  }
}

export const getCityCenter = (city: string) => {
  switch (city) {
    case "Bengaluru":
      return BENGALURU_CENTER;
    case "Guwahati":
      return GUWAHATI_CENTER;
    default:
      return BENGALURU_CENTER;
  }
}

// Map layer configurations
export const MAP_LAYERS = {
  street: {
    name: "Street Map",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    icon: Map,
  },
  satellite: {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    icon: Satellite,
  },
  terrain: {
    name: "Terrain",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    icon: Mountain,
  },
  dark: {
    name: "Dark Theme",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    icon: Palette,
  },
  light: {
    name: "Light Theme",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    icon: Palette,
  }
} 