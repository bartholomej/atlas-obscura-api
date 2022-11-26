import { Coordinates } from 'interfaces/global';
import { LocationResult } from 'interfaces/locations.interface';
import { PlaceById, PlaceExtend } from 'interfaces/placeId.interface';
import { PlacesAll } from 'interfaces/places-all.interface';
import { parse } from 'node-html-parser';
import { fetchPage } from '../fetchers';
import { parseResults } from '../utils';
import { urlPlaceId, urlSearch, URL_PLACES_ALL } from '../vars';

export class PlacesScraper {
  public async placesAll(): Promise<PlacesAll[]> {
    const response = await fetchPage(URL_PLACES_ALL);
    const html = parse(response).innerHTML;

    const data = html.match(/AtlasObscura\.all_places = (.*?);/);

    return parseResults<PlacesAll[]>(data);
  }

  public async search(coords: Coordinates, page = 1): Promise<LocationResult> {
    const url = urlSearch(coords, page);
    const response = await fetchPage(url);
    const html = parse(response).innerHTML;

    const data = html.match(/AtlasObscura\.place_search = (.*?);/);

    return parseResults<LocationResult>(data);
  }

  public async placeById(id: number): Promise<PlaceById> {
    const url = urlPlaceId(id);
    const data = await fetchPage(url);

    let place: PlaceById = null;

    try {
      place = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing placeById', id);
    }
    return place;
  }

  public async placeByIdFull(url: string): Promise<PlaceExtend> {
    const data = await fetchPage(url);
    const html = parse(data);

    const descriptions = html.querySelectorAll('#place-body p').map((p) => p.innerHTML);

    const tags = html.querySelectorAll('.item-tags a.itemTags__link').map((x) => {
      return {
        title: x.innerHTML.trim(),
        link: x.attributes.href
      };
    });
    return { description: descriptions, tags: tags };
  }
}
