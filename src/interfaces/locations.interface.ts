import { AOCoordinates } from './global.js';

export interface AOLocationResult {
  total: AOTotal;
  per_page: number;
  current_page: number;
  location: string;
  q: string;
  coordinates: AOCoordinates;
  results: AOLocation[];
}

export interface AOLocation {
  title: string;
  subtitle: string;
  location: string;
  thumbnail_url: string;
  url: string;
  id: number;
  hide_from_maps?: string;
  coordinates: AOCoordinates;
  distance_from_query: string;
}

export interface AOTotal {
  value: number;
  relation: string;
}
