import { Coordinates } from 'interfaces/global';
import { LocationResult } from 'interfaces/locations.interface';
import { PlaceExtend, PlaceShort } from 'interfaces/placeId.interface';
import { PlacesAll } from 'interfaces/places-all.interface';
import { parse } from 'node-html-parser';
import { fetchPage } from '../fetchers';
import { parseResults } from '../utils';
import { URL_PLACES_ALL, urlPlaceId, urlSearch } from '../vars';

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

  public async placeByIdShort(id: number): Promise<PlaceShort> {
    const url = urlPlaceId(id);
    const data = await fetchPage(url);

    let place: PlaceShort = null;

    try {
      place = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing placeById', id);
    }
    return place;
  }

  public async placeFull(url: string): Promise<PlaceExtend> {
    const data = await fetchPage(url);
    const html = parse(data);

    const descriptions = html.querySelectorAll('#place-body p').map((p) => p.innerHTML);

    const directions = html
      .querySelectorAll('.DDP__direction-copy p')
      .map((p) => p.innerHTML)
      .filter((x) => x !== '');

    const tags = html.querySelectorAll('.item-tags a.itemTags__link').map((x) => {
      return {
        title: x.innerHTML.trim(),
        link: x.attributes.href
      };
    });

    const imageCover = (
      html.querySelector('.js-contains-mobile-lightbox-link img') as unknown as HTMLImageElement
    )?.getAttribute('data-src');

    const images = html
      .querySelectorAll('.js-item-gallery figure a[data-lightbox-src]')
      .map((x) => x.getAttribute('data-lightbox-src'));

    return { description: descriptions, directions, tags, imageCover, images };
  }
}
