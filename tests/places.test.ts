import { atlasobscura } from '../src';

describe('Live: placesAll', () => {
  test('More than some number', async () => {
    const places = await atlasobscura.placesAll();
    expect(places.length).toBeGreaterThan(23000);
  });
});

describe('Live: placeShort', () => {
  test('Some props', async () => {
    const place = await atlasobscura.placeShort(46288);
    expect(place.city).toBe('Chinle');
    expect(place.id).toBe(46288);
    expect((place as any).description).toBe(undefined);
  });
});

describe('Live: placeFull', () => {
  test('Some props', async () => {
    const place = await atlasobscura.placeFull(46288);
    expect(place.city).toBe('Chinle');
    expect(place.id).toBe(46288);
    expect((place as any).description?.length).toBeGreaterThan(0);
  });
});

describe('Live: search', () => {
  test('Test some props', async () => {
    const places = await atlasobscura.search({ lat: 50.08, lng: 14.42 });
    expect(places.results.find((p) => p.title.includes('Prague Astronomical Clock'))?.id).toBe(139);
    expect(places.total.value).toBeGreaterThan(10);
  });
});
