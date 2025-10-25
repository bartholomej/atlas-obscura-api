import { Coordinates } from './global.js';

export interface LocationResult {
  total: Total;
  per_page: number;
  current_page: number;
  location: string;
  q: string;
  coordinates: Coordinates;
  results: Location[];
}

export interface Location {
  title: string;
  subtitle: string;
  location: string;
  thumbnail_url: string;
  url: string;
  id: number;
  hide_from_maps?: string;
  coordinates: Coordinates;
  distance_from_query: string;
}

export interface Total {
  value: number;
  relation: string;
}
