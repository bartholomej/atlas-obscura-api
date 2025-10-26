import { AOCoordinates } from './global.js';

export interface AOPlaceShort {
  id: number;
  title: string;
  subtitle: string;
  city: string;
  country: string;
  location: string;
  url: string;
  hide_from_maps?: string;
  physical_status: string;
  thumbnail_url: string;
  thumbnail_url_3x2: string;
  coordinates: AOCoordinates;
  nearby_places: AOPlaceShort[];
  nearby_foods: AOPlaceShort[];
}

export interface AOPlaceExtend {
  description?: string[];
  tags?: AOTag[];
  directions?: string[];
  imageCover?: string;
  images?: string[];
}

export interface AOTag {
  title: string;
  link: string;
}

export interface AOPlace extends AOPlaceShort, AOPlaceExtend { }
