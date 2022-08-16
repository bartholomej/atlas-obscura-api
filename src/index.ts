import { Coordinates } from 'interfaces/global';
import { PlaceById } from 'interfaces/placeId.interface';
import { PlacesAll } from 'interfaces/places-all.interface';
import { LocationResult } from './interfaces/locations.interface';
import { PlacesScraper } from './services/location.service';

export class AtlasObscura {
  constructor(private locationService: PlacesScraper) { }

  public async search(coords: Coordinates): Promise<LocationResult> {
    return this.locationService.search(coords);
  }

  public async placesAll(): Promise<PlacesAll[]> {
    return this.locationService.placesAll();
  }

  public async placeById(id: number): Promise<PlaceById> {
    return this.locationService.placeById(id);
  }
}

const locationScraper = new PlacesScraper();
export const atlasobscura = new AtlasObscura(locationScraper);
