import { Coordinates } from './global';

export interface PlaceById {
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
  nearby_places: PlaceById[];
  nearby_foods: PlaceById[];
}

export interface PlaceExtend {
  description?: string[];
  tags?: Tag[];
}

export interface Tag {
  title: string;
  link: string;
}

export interface Place extends PlaceById, PlaceExtend { }
