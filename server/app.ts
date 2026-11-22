import { Context, Hono } from 'hono';
import { env } from 'hono/adapter';
import { cache } from 'hono/cache';
import { cors } from 'hono/cors';
import { timingSafeEqual } from 'hono/utils/buffer';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import packageJson from '../package.json' with { type: 'json' };
import { AtlasObscura } from '../src/atlas-obscura.js';

export type ServerEnv = {
  API_KEY?: string;
  API_KEY_NAME?: string;
  CORS_ORIGINS?: string;
  VERBOSE?: string;
};

type Severity = 'info' | 'warn' | 'error' | 'success';

export enum Errors {
  API_KEY_MISSING = 'API_KEY_MISSING',
  API_KEY_INVALID = 'API_KEY_INVALID',
  ID_MISSING = 'ID_MISSING',
  PLACE_FETCH_FAILED = 'PLACE_FETCH_FAILED',
  SEARCH_FETCH_FAILED = 'SEARCH_FETCH_FAILED',
  PLACES_FETCH_FAILED = 'PLACES_FETCH_FAILED',
  PAGE_NOT_FOUND = 'PAGE_NOT_FOUND',
  USER_FETCH_FAILED = 'USER_FETCH_FAILED'
}

type ErrorLog = {
  error: Errors | null;
  message: string;
};

export enum Endpoint {
  PLACES_ALL = '/places-all',
  SEARCH = '/search/:lat/:lng',
  PLACE_SHORT = '/place-short/:id',
  PLACE_FULL = '/place-full/:id',
  USER = '/user/:id'
}

const HOUR = 60 * 60;

// Only on Cloudflare Workers (Cache API); in Node the middleware does nothing.
const cached = (maxAge: number) =>
  cache({
    cacheName: 'atlas-obscura-api',
    cacheControl: `public, max-age=${maxAge}`,
    onCacheNotAvailable: false
  });

const settings = (c: Context) => env<ServerEnv>(c);

const readBearer = (authorization?: string) =>
  /^Bearer\s+(\S+)\s*$/i.exec(authorization ?? '')?.[1];

function logMessage(severity: Severity, log: ErrorLog, c?: Context) {
  const colors = {
    info: '\x1b[36m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    success: '\x1b[32m',
    reset: '\x1b[0m'
  };
  const symbols = {
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌',
    success: '✅'
  };
  const paddedSeverity = {
    info: 'INFO   ',
    warn: 'WARN   ',
    error: 'ERROR  ',
    success: 'SUCCESS'
  };
  const time = new Date().toISOString();
  const reqInfo = c ? `${c.req.method}: ${new URL(c.req.url).pathname}` : '';
  const reqIp = c
    ? c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || ''
    : '';
  const msg = `${colors[severity]}[${paddedSeverity[severity]}]${colors.reset} ${time} | IP: ${reqIp} ${symbols[severity]} ${log.error ? log.error + ':' : ''} ${log.message} 🔗 ${reqInfo}`;

  if (severity === 'success') {
    if (c && settings(c).VERBOSE === 'true') console.log(msg);
  } else if (severity === 'error') {
    console.error(msg);
  } else if (severity === 'warn') {
    console.warn(msg);
  } else {
    console.log(msg);
  }
}

const fail = (c: Context, status: ContentfulStatusCode, log: ErrorLog, severity: Severity = 'error') => {
  logMessage(severity, log, c);
  return c.json(log, status);
};

export const createApp = (atlasObscura: AtlasObscura): Hono => {
  // strict: false keeps Express behaviour, where /places-all and /places-all/ are the same route
  const app = new Hono({ strict: false });

  app.use(
    cors({
      origin: (origin, c) => {
        const allowed = (settings(c).CORS_ORIGINS ?? '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);
        return allowed.includes('*') || allowed.includes(origin) ? origin : null;
      },
      credentials: true
    })
  );

  // --- Optional API key check ---
  // Standard `Authorization: Bearer <key>`; the API_KEY_NAME header (x-api-key) still works for older clients.
  app.use(async (c, next) => {
    const { API_KEY, API_KEY_NAME = 'x-api-key' } = settings(c);
    if (!API_KEY) return next();

    const apiKey = readBearer(c.req.header('Authorization')) ?? c.req.header(API_KEY_NAME);
    if (!apiKey) {
      c.header('WWW-Authenticate', 'Bearer realm="atlas-obscura-api"');
      return fail(c, 401, {
        error: Errors.API_KEY_MISSING,
        message: `Missing API key. Send it as "Authorization: Bearer <key>" (or in the ${API_KEY_NAME} header)`
      });
    }
    if (!(await timingSafeEqual(apiKey, API_KEY))) {
      c.header('WWW-Authenticate', 'Bearer realm="atlas-obscura-api", error="invalid_token"');
      return fail(c, 401, {
        error: Errors.API_KEY_INVALID,
        message: 'Invalid API key'
      });
    }
    return next();
  });

  // --- Endpoints ---
  app.get('/', (c) => {
    logMessage('info', { error: null, message: '/' });
    return c.json({
      name: packageJson.name,
      version: packageJson.version,
      docs: packageJson.homepage,
      links: Object.values(Endpoint)
    });
  });

  app.get('/place-short', (c) => missingId(c));
  app.get('/place-full', (c) => missingId(c));

  app.get('/search', (c) =>
    fail(
      c,
      404,
      {
        error: Errors.ID_MISSING,
        message: `Latitude and longitude are missing. Provide them like this: ${new URL(c.req.url).pathname.replace(/\/$/, '')}/50.08/14.42`
      },
      'warn'
    )
  );
  app.get('/search/:lat', (c) =>
    fail(
      c,
      404,
      {
        error: Errors.ID_MISSING,
        message: `Longitude is missing. Provide it like this: ${new URL(c.req.url).pathname.replace(/\/$/, '')}/14.42`
      },
      'warn'
    )
  );

  app.get(Endpoint.PLACE_SHORT, cached(24 * HOUR), async (c) => {
    const id = c.req.param('id');
    try {
      const place = await atlasObscura.placeShort(+id);
      if (!place) throw new Error('Empty response');
      logMessage('success', { error: null, message: `${Endpoint.PLACE_SHORT}: ${id}` }, c);
      return c.json(place);
    } catch (error) {
      return fail(c, 502, { error: Errors.PLACE_FETCH_FAILED, message: 'Failed to fetch place data: ' + error });
    }
  });

  app.get(Endpoint.PLACE_FULL, cached(24 * HOUR), async (c) => {
    const id = c.req.param('id');
    try {
      const place = await atlasObscura.placeFull(+id);
      logMessage('success', { error: null, message: `${Endpoint.PLACE_FULL}: ${id}` }, c);
      return c.json(place);
    } catch (error) {
      return fail(c, 502, { error: Errors.PLACE_FETCH_FAILED, message: 'Failed to fetch place data: ' + error });
    }
  });

  app.get(Endpoint.SEARCH, cached(HOUR), async (c) => {
    const { lat, lng } = c.req.param();
    try {
      const result = await atlasObscura.search({ lat: +lat, lng: +lng });
      if (!result) throw new Error('Empty response');
      logMessage('success', { error: null, message: `${Endpoint.SEARCH}: ${lat},${lng}` }, c);
      return c.json(result);
    } catch (error) {
      return fail(c, 502, { error: Errors.SEARCH_FETCH_FAILED, message: 'Failed to fetch search data: ' + error });
    }
  });

  app.get(Endpoint.PLACES_ALL, cached(12 * HOUR), async (c) => {
    try {
      const places = await atlasObscura.placesAll();
      // null used to go out as a 200 "null", which clients (and the cache) took for a valid answer
      if (!places?.length) throw new Error('Empty response');
      logMessage('success', { error: null, message: Endpoint.PLACES_ALL }, c);
      return c.json(places);
    } catch (error) {
      return fail(c, 502, { error: Errors.PLACES_FETCH_FAILED, message: 'Failed to fetch places data: ' + error });
    }
  });

  app.get(Endpoint.USER, cached(HOUR), async (c) => {
    const id = c.req.param('id');
    try {
      const user = await atlasObscura.user(id);
      if (!user) throw new Error('Empty response');
      logMessage('success', { error: null, message: `${Endpoint.USER}: ${id}` }, c);
      return c.json(user);
    } catch (error) {
      return fail(c, 502, { error: Errors.USER_FETCH_FAILED, message: 'Failed to fetch user data: ' + error });
    }
  });

  app.notFound((c) =>
    fail(c, 404, { error: Errors.PAGE_NOT_FOUND, message: 'The requested endpoint could not be found.' }, 'warn')
  );

  return app;
};

const missingId = (c: Context) => {
  const path = new URL(c.req.url).pathname;
  return fail(
    c,
    404,
    {
      error: Errors.ID_MISSING,
      message: `ID is missing. Provide ID like this: ${path}${path.endsWith('/') ? '' : '/'}1234`
    },
    'warn'
  );
};
