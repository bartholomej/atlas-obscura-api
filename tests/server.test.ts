import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createApp, Errors } from '../server/app';
import worker from '../server/worker';
import { AtlasObscura } from '../src/atlas-obscura';
import { URL_PLACES_ALL } from '../src/vars';

const fakeAtlasObscura = () => ({
  placesAll: vi.fn().mockResolvedValue([{ id: 1, lat: 2, lng: 3 }]),
  placeFull: vi.fn().mockResolvedValue({ id: 46288, title: 'Canyon de Chelly' }),
  placeShort: vi.fn().mockResolvedValue({ id: 46288 }),
  search: vi.fn().mockResolvedValue({ results: [] }),
  user: vi.fn().mockResolvedValue({ username: 'bart' })
});

describe('Server (Hono)', () => {
  let ao: ReturnType<typeof fakeAtlasObscura>;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    ao = fakeAtlasObscura();
    app = createApp(ao as unknown as AtlasObscura);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  test('Index lists the endpoints', async () => {
    const res = await app.request('/');
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.name).toBe('atlas-obscura-api');
    expect(body.links).toContain('/places-all');
  });

  test('places-all, with and without a trailing slash', async () => {
    for (const path of ['/places-all', '/places-all/']) {
      const res = await app.request(path);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual([{ id: 1, lat: 2, lng: 3 }]);
    }
  });

  test('places-all fails loudly instead of answering 200 null', async () => {
    ao.placesAll.mockResolvedValue(null);
    const res = await app.request('/places-all');
    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe(Errors.PLACES_FETCH_FAILED);
  });

  test('place-full passes the numeric id', async () => {
    const res = await app.request('/place-full/46288');
    expect(res.status).toBe(200);
    expect(ao.placeFull).toHaveBeenCalledWith(46288);
    expect((await res.json()).title).toBe('Canyon de Chelly');
  });

  test('place-full upstream error is a 502', async () => {
    ao.placeFull.mockRejectedValue(new TypeError("Cannot read properties of null (reading 'url')"));
    const res = await app.request('/place-full/1');
    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe(Errors.PLACE_FETCH_FAILED);
  });

  test('Missing ids and coordinates explain the format', async () => {
    const place = await app.request('/place-full/');
    expect(place.status).toBe(404);
    expect((await place.json()).message).toContain('/place-full/1234');

    const lat = await app.request('/search/50.08');
    expect(lat.status).toBe(404);
    expect((await lat.json()).message).toContain('Longitude is missing');
  });

  test('Unknown route', async () => {
    const res = await app.request('/nope');
    expect(res.status).toBe(404);
    expect((await res.json()).error).toBe(Errors.PAGE_NOT_FOUND);
  });

  test('API key is checked when set', async () => {
    vi.stubEnv('API_KEY', 'secret');

    const missing = await app.request('/places-all');
    expect(missing.status).toBe(401);
    expect((await missing.json()).error).toBe(Errors.API_KEY_MISSING);

    const wrong = await app.request('/places-all', { headers: { 'x-api-key': 'nope' } });
    expect((await wrong.json()).error).toBe(Errors.API_KEY_INVALID);

    const ok = await app.request('/places-all', { headers: { 'x-api-key': 'secret' } });
    expect(ok.status).toBe(200);
  });

  test('API key as a standard Bearer token', async () => {
    vi.stubEnv('API_KEY', 'secret');

    const ok = await app.request('/places-all', { headers: { Authorization: 'Bearer secret' } });
    expect(ok.status).toBe(200);

    const lowercase = await app.request('/places-all', { headers: { Authorization: 'bearer secret' } });
    expect(lowercase.status).toBe(200);

    const wrong = await app.request('/places-all', { headers: { Authorization: 'Bearer nope' } });
    expect(wrong.status).toBe(401);
    expect((await wrong.json()).error).toBe(Errors.API_KEY_INVALID);
    expect(wrong.headers.get('www-authenticate')).toContain('invalid_token');

    const missing = await app.request('/places-all');
    expect(missing.headers.get('www-authenticate')).toBe('Bearer realm="atlas-obscura-api"');

    const otherScheme = await app.request('/places-all', { headers: { Authorization: 'Basic c2VjcmV0' } });
    expect((await otherScheme.json()).error).toBe(Errors.API_KEY_MISSING);
  });

  test('CORS only for listed origins', async () => {
    vi.stubEnv('CORS_ORIGINS', 'https://allowed.example');

    const allowed = await app.request('/', { headers: { Origin: 'https://allowed.example' } });
    expect(allowed.headers.get('access-control-allow-origin')).toBe('https://allowed.example');

    const other = await app.request('/', { headers: { Origin: 'https://other.example' } });
    expect(other.headers.get('access-control-allow-origin')).toBe(null);
  });
});

describe('Worker entry (fetch build)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('places-all goes through plain fetch', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '[[72281,69.94743,23.18667]]'
    });
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const res = await worker.request('/places-all');

    expect(fetchMock.mock.calls[0][0]).toBe(URL_PLACES_ALL);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([{ id: 72281, lat: 69.94743, lng: 23.18667 }]);
  });
});
