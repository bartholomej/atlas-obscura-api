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
      if (place && typeof place.hide_from_maps === 'string') {
        (place as any).hide_from_maps = place.hide_from_maps === 'true';
      }
    } catch (error) {
      console.error('Error parsing placeById', id);
    }
    return place;
  }

  public async placeFull(url: string): Promise<PlaceExtend> {
    const data = await fetchPage(url);
    const html = parse(data);

    const descriptions = html.querySelectorAll('.place-body p').map((p) => p.innerHTML);

    const sectionDirections = Array.from(html.querySelectorAll('section')).find((sec) => {
      const h2 = sec.querySelector('h2');
      return h2 && h2.textContent.trim() === 'Know Before You Go';
    });
    const directions = sectionDirections
      ? Array.from(sectionDirections.querySelectorAll('p')).map((p) => p.textContent.trim())
      : [];

    const tags = html.querySelectorAll('.aon-pill-badge-component').map((x) => {
      return {
        title: x.querySelector('.aon-pill-badge-text')?.innerHTML.trim(),
        link: x.attributes.href
      };
    });

    const slides = html.querySelectorAll('.swiper-slide');
    const images = Array.from(slides)
      .map((slide) => {
        const img = slide.querySelector('img');
        return img ? img.getAttribute('src') : null;
      })
      .filter(Boolean);

    const imageCover = images[0];

    return { description: descriptions, directions, tags, imageCover, images };
  }
}
