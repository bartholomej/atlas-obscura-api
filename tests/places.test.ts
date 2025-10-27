import { beforeAll, describe, expect, test } from 'vitest';
import { atlasObscura } from '../src';
import { AOPlace } from '../src/interfaces/placeId.interface';

describe('Live: placesAll', () => {
  test('More than some number', async () => {
    const places = await atlasObscura.placesAll();
    expect(places.length).toBeGreaterThan(23000);
  });
});

describe('Live: placeShort', () => {
  test('Some props', async () => {
    const place = await atlasObscura.placeShort(46288);
    expect(place.city).toBe('Chinle');
    expect(place.id).toBe(46288);
    expect((place as any).description).toBe(undefined);
  });
});

describe('Live: placeFull', () => {
  let place: AOPlace;

  beforeAll(async () => {
    place = await atlasObscura.placeFull(46288);
  });

  test('ID', async () => {
    expect(place.id).toBe(46288);
  });
  test('Title', async () => {
    expect(place.title).toContain('Chelly');
  });
  test('Subtitle', async () => {
    expect(place.subtitle).toContain('sandstone');
  });
  test('City', async () => {
    expect(place.city).toBe('Chinle');
  });
  test('Country', async () => {
    expect(place.country).toBe('United States');
  });
  test('Location', async () => {
    expect(place.location).toBe('Chinle, Arizona');
  });
  test('url', async () => {
    expect(place.url).toContain('https://www.atlasobscura.com/places/');
    expect(place.url).toContain('chelly');
  });
  test('Hide from maps', async () => {
    expect(place.hide_from_maps).toBe(false);
  });
  test('Physical status', async () => {
    expect(place.physical_status).toBe('');
  });
  test('Thumbnail url', async () => {
    expect(place.thumbnail_url).toContain('https://img.atlasobscura.com/');
  });
  test('Thumbnail url 3x2', async () => {
    expect(place.thumbnail_url_3x2).toContain('https://img.atlasobscura.com/');
  });
  test('Coordinates', async () => {
    expect(place.coordinates.lat).toBeGreaterThanOrEqual(36);
    expect(place.coordinates.lng).toBeLessThanOrEqual(-109);
  });
  test('Description', async () => {
    expect(place.description?.length).toBeGreaterThan(0);
  });
  test('Directions', async () => {
    expect(place.directions?.length).toBeGreaterThan(0);
  });
  test('Tags', async () => {
    expect(place.tags?.length).toBeGreaterThan(2);
  });
  test('Image cover', async () => {
    expect(place.imageCover).toContain('https://');
  });
  test('Images', async () => {
    expect(place.images?.length).toBeGreaterThan(0);
  });
});

describe('Live: search', () => {
  test('Test some props', async () => {
    const places = await atlasObscura.search({ lat: 50.08, lng: 14.42 });
    expect(places.results.find((p) => p.title.includes('Prague Astronomical Clock'))?.id).toBe(139);
    expect(places.total.value).toBeGreaterThan(10);
  });
});

describe('Live: user', () => {
  test('Test some props', async () => {
    const user = await atlasObscura.user('bartholomej');
    expect(user.id).toBe(251656);
    expect(user.places?.length).toBeGreaterThan(50);
    expect(user.places?.some((place) => place.title.includes('Okunoshima'))).toBe(true);
  });
});

