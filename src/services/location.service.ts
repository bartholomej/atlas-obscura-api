import { parse } from 'node-html-parser';
import { fetchPage } from '../fetchers/index.js';
import { AOUser } from '../interfaces/user.interface.js';
import { parseResults } from '../utils.js';
import { URL_PLACES_ALL, urlPlaceId, urlSearch, urlUser } from '../vars.js';
import { AOCoordinates, AOFetchOptions } from './../interfaces/global.js';
import { AOLocationResult } from './../interfaces/locations.interface.js';
import { AOPlaceExtend, AOPlaceShort } from './../interfaces/placeId.interface.js';
import { AOPlacesAll } from './../interfaces/places-all.interface.js';

export class PlacesScraper {
  public async placesAll(options?: AOFetchOptions): Promise<AOPlacesAll[]> {
    const response = await fetchPage(URL_PLACES_ALL, options?.headers);
    const html = parse(response).innerHTML;

    const data = html.match(/AtlasObscura\.all_places = (.*?);/);

    return parseResults<AOPlacesAll[]>(data);
  }

  public async search(coords: AOCoordinates, page = 1, options?: AOFetchOptions): Promise<AOLocationResult> {
    const url = urlSearch(coords, page);
    const response = await fetchPage(url, options?.headers);
    const html = parse(response).innerHTML;

    const data = html.match(/AtlasObscura\.place_search = (.*?);/);

    return parseResults<AOLocationResult>(data);
  }

  public async placeByIdShort(id: number, options?: AOFetchOptions): Promise<AOPlaceShort> {
    const url = urlPlaceId(id);
    const data = await fetchPage(url, options?.headers);

    let place: AOPlaceShort = null;

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

  public async placeFull(url: string, options?: AOFetchOptions): Promise<AOPlaceExtend> {
    const data = await fetchPage(url, options?.headers);
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

  public async user(user: string, options?: AOFetchOptions): Promise<AOUser> {
    const url = urlUser(user);
    const response = await fetchPage(url, options?.headers);
    const html = parse(response).innerHTML;

    const data = html.match(/AtlasObscura\.user_profile = (.*?);/);

    const usr = parseResults<{ user: AOUser }>(data);

    return usr.user;
  }
}
