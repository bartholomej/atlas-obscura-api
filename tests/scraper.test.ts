import { describe, expect, test, vi } from 'vitest';
import { AtlasObscura } from '../src/atlas-obscura';
import { PlacesScraper } from '../src/services/location.service';
import { URL_PLACES_ALL, urlPlaceId, urlSearch, urlUser } from '../src/vars';

// Minimal pages with the same selectors and embedded JSON the scraper reads from atlasobscura.com
const PLACE_URL = 'https://www.atlasobscura.com/places/canyon-de-chelly';
const PLACE_JSON = JSON.stringify({
  id: 46288,
  title: 'Canyon de Chelly National Monument',
  url: PLACE_URL,
  hide_from_maps: 'false'
});
const PLACE_HTML = `<html><body>
  <div class="place-body"><p>First <em>paragraph</em>.</p><p>Second paragraph.</p></div>
  <section><h2>Something else</h2><p>Not a direction.</p></section>
  <section><h2>Know Before You Go</h2><p>  Park at the visitor center.  </p></section>
  <a class="aon-pill-badge-component" href="/categories/canyons">
    <span class="aon-pill-badge-text"> Canyons </span>
  </a>
  <div class="swiper-slide"><img src="https://img.atlasobscura.com/1.jpg"></div>
  <div class="swiper-slide"><img src="https://img.atlasobscura.com/2.jpg"></div>
  <div class="swiper-slide"></div>
</body></html>`;
const SEARCH_HTML = `<script>AtlasObscura.place_search = {"total":1,"results":[{"id":46288}]};</script>`;
const USER_HTML = `<script>AtlasObscura.user_profile = {"user":{"username":"bart"}};</script>`;

const pages: Record<string, string> = {
  [URL_PLACES_ALL]: '[[46288,36.13,-109.47]]',
  [urlPlaceId(46288)]: PLACE_JSON,
  [PLACE_URL]: PLACE_HTML,
  [urlSearch({ lat: 36.13, lng: -109.47 }, 1)]: SEARCH_HTML,
  [urlUser('bart')]: USER_HTML
};

const createClient = (overrides: Record<string, string> = {}) => {
  const fetcher = vi.fn(async (url: string) => ({ ...pages, ...overrides })[url] ?? 'Error');
  return { fetcher, client: new AtlasObscura(new PlacesScraper(fetcher)) };
};

describe('AtlasObscura with an injected fetcher (no network)', () => {
  test('placesAll', async () => {
    const { client } = createClient();
    expect(await client.placesAll()).toEqual([{ id: 46288, lat: 36.13, lng: -109.47 }]);
  });

  test('placeShort converts hide_from_maps', async () => {
    const { client } = createClient();
    const place = await client.placeShort(46288);
    expect(place.title).toBe('Canyon de Chelly National Monument');
    expect(place.hide_from_maps).toBe(false);
  });

  test('placeFull merges the JSON summary with the parsed page', async () => {
    const { client, fetcher } = createClient();
    const place = await client.placeFull(46288, { headers: { 'X-Test': '1' } });

    expect(fetcher).toHaveBeenNthCalledWith(1, urlPlaceId(46288), { 'X-Test': '1' });
    expect(fetcher).toHaveBeenNthCalledWith(2, PLACE_URL, { 'X-Test': '1' });
    expect(place).toMatchObject({
      id: 46288,
      title: 'Canyon de Chelly National Monument',
      hide_from_maps: false,
      description: ['First <em>paragraph</em>.', 'Second paragraph.'],
      directions: ['Park at the visitor center.'],
      tags: [{ title: 'Canyons', link: '/categories/canyons' }],
      images: ['https://img.atlasobscura.com/1.jpg', 'https://img.atlasobscura.com/2.jpg'],
      imageCover: 'https://img.atlasobscura.com/1.jpg'
    });
  });

  test('placeFull of a page without the optional sections', async () => {
    const { client } = createClient({ [PLACE_URL]: '<html><body></body></html>' });
    const place = await client.placeFull(46288);
    expect(place).toMatchObject({ description: [], directions: [], tags: [], images: [] });
    expect(place.imageCover).toBe(undefined);
  });

  test('placeFull rejects when the place summary is missing', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { client } = createClient({ [urlPlaceId(46288)]: 'Error' });
    await expect(client.placeFull(46288)).rejects.toThrow();
  });

  test('search reads the embedded place_search JSON', async () => {
    const { client } = createClient();
    const result = await client.search({ lat: 36.13, lng: -109.47 });
    expect(result).toEqual({ total: 1, results: [{ id: 46288 }] });
  });

  test('user reads the embedded user_profile JSON', async () => {
    const { client } = createClient();
    expect(await client.user('bart')).toEqual({ username: 'bart' });
  });

  test('Broken embedded JSON gives null instead of throwing', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { client } = createClient({
      [urlSearch({ lat: 36.13, lng: -109.47 }, 1)]:
        '<script>AtlasObscura.place_search = {oops;</script>'
    });
    expect(await client.search({ lat: 36.13, lng: -109.47 })).toBe(null);
  });
});
