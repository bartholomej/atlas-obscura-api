import { AOPlacesAll } from './interfaces/places-all.interface.js';

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

/**
 * The map endpoint returns compact `[id, lat, lng]` tuples. The old page embedded
 * `{ id, lat, lng }` objects, so both are accepted.
 */
export const parsePlacesAll = (body: string): AOPlacesAll[] => {
  let data: unknown;

  try {
    data = JSON.parse(body);
  } catch {
    console.error('Error parsing all places');
    return null;
  }

  if (!Array.isArray(data)) {
    return null;
  }

  return data
    .map((item): AOPlacesAll => {
      if (Array.isArray(item)) {
        const [id, lat, lng] = item;
        return { id, lat, lng };
      }
      return item;
    })
    .filter(
      (place) =>
        !!place &&
        isFiniteNumber(place.id) &&
        isFiniteNumber(place.lat) &&
        isFiniteNumber(place.lng)
    );
};

export const parseResults = <T>(matches: RegExpMatchArray): T => {
  let locations: T = null;

  if (matches && matches[1]?.length) {
    try {
      locations = JSON.parse(matches[1]);
    } catch {
      console.error('Error parsing all places');
    }
  }
  return locations;
};

// img.atlasobscura.com URLs end with the original file as base64 ("aHR0c" is "http"), whatever the size
const imageSource = (url: string): string => {
  const parts = url.split('/');
  const start = parts.findIndex((part) => part.startsWith('aHR0c'));
  return start < 0 ? url : parts.slice(start).join('/');
};

/**
 * A place page shows every photo three times: in the carousel, the lightbox and its thumbnails.
 * Keeps the first size of each, which is the carousel one.
 */
export const uniqueImages = (urls: string[]): string[] => {
  const seen = new Set<string>();
  return urls.filter((url) => {
    const source = imageSource(url);
    if (seen.has(source)) return false;
    seen.add(source);
    return true;
  });
};
