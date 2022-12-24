import { Coordinates } from './global';

export interface PlaceShort {
  id: number;
  title: string;
  subtitle: string;
  city: string;
  country: string;
  location: string;
  url: string;
  hide_from_maps?: boolean;
  physical_status: string;
  thumbnail_url: string;
  thumbnail_url_3x2: string;
  coordinates: Coordinates;
  nearby_places: PlaceShort[];
  nearby_foods: PlaceShort[];
}

export interface PlaceExtend {
  description?: string[];
  tags?: Tag[];
  directions?: string[];
}

export interface Tag {
  title: string;
  link: string;
}

export interface Place extends PlaceShort, PlaceExtend { }
