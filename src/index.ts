import { AOCoordinates, AOFetchOptions } from './interfaces/global.js';
import { AOLocationResult } from './interfaces/locations.interface.js';
import { AOPlace, AOPlaceShort } from './interfaces/placeId.interface.js';
import { AOPlacesAll } from './interfaces/places-all.interface.js';
import { AOUser } from './interfaces/user.interface.js';
import { PlacesScraper } from './services/location.service.js';

export class AtlasObscura {
  constructor(private locationService: PlacesScraper) { }

  public async search(coords: AOCoordinates, options?: AOFetchOptions): Promise<AOLocationResult> {
    return this.locationService.search(coords, 1, options);
  }

  public async placesAll(options?: AOFetchOptions): Promise<AOPlacesAll[]> {
    return this.locationService.placesAll(options);
  }

  public async placeShort(id: number, options?: AOFetchOptions): Promise<AOPlaceShort> {
    return this.locationService.placeByIdShort(id, options);
  }

  public async placeFull(id: number, options?: AOFetchOptions): Promise<AOPlace> {
    const place = await this.locationService.placeByIdShort(id, options);
    const placeRich = await this.locationService.placeFull(place.url, options);
    return { ...place, ...placeRich };
  }

  public async user(user: string, options?: AOFetchOptions): Promise<AOUser> {
    return this.locationService.user(user, options);
  }
}

const locationScraper = new PlacesScraper();
export const atlasObscura: AtlasObscura = new AtlasObscura(locationScraper);
export type * from './interfaces/index.js';
