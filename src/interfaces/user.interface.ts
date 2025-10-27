import { AOCoordinates } from './global';

export interface AOUser {
  id: number;
  places: AOUserPlace[];
}

export interface AOUserPlace {
  id: number;
  title: string;
  subtitle: string;
  url: string;
  location: string;
  thumbnail_url: string;
  coordinates: AOCoordinates;
}