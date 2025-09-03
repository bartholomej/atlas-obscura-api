import { Coordinates, FetchOptions } from 'interfaces/global';
import { Place, PlaceShort } from 'interfaces/placeId.interface';
import { PlacesAll } from 'interfaces/places-all.interface';
import { LocationResult } from './interfaces/locations.interface';
import { PlacesScraper } from './services/location.service';

export class AtlasObscura {
  constructor(private locationService: PlacesScraper) { }

  public async search(coords: Coordinates, options?: FetchOptions): Promise<LocationResult> {
    return this.locationService.search(coords, 1, options);
  }

  public async placesAll(options?: FetchOptions): Promise<PlacesAll[]> {
    return this.locationService.placesAll(options);
  }

  public async placeShort(id: number, options?: FetchOptions): Promise<PlaceShort> {
    return this.locationService.placeByIdShort(id, options);
  }

  public async placeFull(id: number, options?: FetchOptions): Promise<Place> {
    const place = await this.locationService.placeByIdShort(id, options);
    const placeRich = await this.locationService.placeFull(place.url, options);
    return { ...place, ...placeRich };
  }
}

const locationScraper = new PlacesScraper();
export const atlasobscura = new AtlasObscura(locationScraper);
