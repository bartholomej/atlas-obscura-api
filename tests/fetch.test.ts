import { afterEach, describe, expect, test, vi } from 'vitest';
import { fetchPage } from '../src/fetchers/fetch';
import { PlacesScraper } from '../src/services/location.service';
import { URL_PLACES_ALL } from '../src/vars';

describe('fetch fetcher (React Native / browser)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('Returns the body and sends custom headers next to the defaults', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => 'body' });
    vi.stubGlobal('fetch', fetchMock);

    const body = await fetchPage('https://example.com', { 'X-Test': '1' });

    expect(body).toBe('body');
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://example.com');
    expect(init.headers['X-Test']).toBe('1');
    expect(init.headers['User-Agent']).toBeTruthy();
    expect(init.credentials).toBe('omit');
  });

  test('Bad status returns "Error"', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403, text: async () => '' }));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(await fetchPage('https://example.com')).toBe('Error');
  });

  test('Network failure returns "Error"', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network request failed')));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(await fetchPage('https://example.com')).toBe('Error');
  });
});

describe('PlacesScraper with an injected fetcher', () => {
  test('placesAll reads the map endpoint', async () => {
    const fetcher = vi.fn().mockResolvedValue('[[72281,69.94743,23.18667]]');
    const places = await new PlacesScraper(fetcher).placesAll({ headers: { 'X-Test': '1' } });

    expect(fetcher).toHaveBeenCalledWith(URL_PLACES_ALL, { 'X-Test': '1' });
    expect(places).toEqual([{ id: 72281, lat: 69.94743, lng: 23.18667 }]);
  });

  test('placesAll is null when the fetch failed', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const places = await new PlacesScraper(async () => 'Error').placesAll();
    expect(places).toBe(null);
  });
});
