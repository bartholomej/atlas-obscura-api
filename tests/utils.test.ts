import { describe, expect, test } from 'vitest';
import { parsePlacesAll, uniqueImages } from '../src/utils';

describe('parsePlacesAll', () => {
  test('Tuples from the map endpoint', () => {
    const places = parsePlacesAll('[[72281,69.94743,23.18667],[72282,34.0557,-86.68991]]');
    expect(places).toEqual([
      { id: 72281, lat: 69.94743, lng: 23.18667 },
      { id: 72282, lat: 34.0557, lng: -86.68991 }
    ]);
  });

  test('Objects from the old page format', () => {
    const places = parsePlacesAll('[{"id":46606,"lat":48.140322,"lng":17.121313}]');
    expect(places).toEqual([{ id: 46606, lat: 48.140322, lng: 17.121313 }]);
  });

  test('Drops malformed entries', () => {
    const places = parsePlacesAll('[[1,2,3],[2,"x",3],[3],null,{"id":4}]');
    expect(places).toEqual([{ id: 1, lat: 2, lng: 3 }]);
  });

  test('Not JSON, e.g. a fetch error, returns null', () => {
    expect(parsePlacesAll('Error')).toBe(null);
    expect(parsePlacesAll('<!DOCTYPE html>')).toBe(null);
  });

  test('JSON that is not a list returns null', () => {
    expect(parsePlacesAll('null')).toBe(null);
    expect(parsePlacesAll('{"error":"nope"}')).toBe(null);
  });
});

describe('uniqueImages', () => {
  const photo = (size: string, file: string) =>
    `https://img.atlasobscura.com/sig${file}${size}/${size}/q:81/sm:1/scp:1/ar:1/${file}/cy5qcGc.jpg`;

  test('Keeps the first size of each photo', () => {
    const urls = [
      photo('h:400', 'aHR0cHM6Ly9h'),
      photo('h:400', 'aHR0cHM6Ly9i'),
      photo('w:1200', 'aHR0cHM6Ly9h'),
      photo('w:1200', 'aHR0cHM6Ly9i'),
      photo('fill:80', 'aHR0cHM6Ly9a')
    ];
    expect(uniqueImages(urls)).toEqual([urls[0], urls[1], urls[4]]);
  });

  test('URLs without an encoded source are compared as they are', () => {
    expect(
      uniqueImages(['https://x.org/1.jpg', 'https://x.org/2.jpg', 'https://x.org/1.jpg'])
    ).toEqual(['https://x.org/1.jpg', 'https://x.org/2.jpg']);
  });
});
