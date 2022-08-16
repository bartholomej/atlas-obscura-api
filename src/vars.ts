export const URL_PLACES_ALL =
  'https://www.atlasobscura.com/articles/all-places-in-the-atlas-on-one-map';

export const urlSearch = (coord: { lat: number; lng: number }, page?: number): string =>
  `https://www.atlasobscura.com/search?utf8=%E2%9C%93&q=&location=&nearby=true&lat=${coord.lat
  }&lng=${coord.lng}${page ? '&page=' + page : ''}`;

export const urlPlaceId = (id: number): string =>
  `https://www.atlasobscura.com/places/${id}.json?place_only=1`;
