import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import packageJson from './package.json';
import { atlasobscura } from './src';

type Severity = 'info' | 'warn' | 'error' | 'success';

type ErrorLog = {
  error: keyof typeof Errors | null;
  message: string;
};

function logMessage(severity: Severity, log: ErrorLog, req?: Request) {
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
  const time = new Date().toISOString();
  const reqInfo = req ? `${req.method}: ${req.originalUrl}` : '';
  const reqIp = req ? req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || req.ips : '';
  const paddedSeverity = {
    info: 'INFO   ',
    warn: 'WARN   ',
    error: 'ERROR  ',
    success: 'SUCCESS'
  };
  const msg = `${colors[severity]}[${paddedSeverity[severity]}]${colors.reset} ${time} | IP: ${reqIp} ${symbols[severity]} ${log.error ? log.error + ':' : ''} ${log.message} 🔗 ${reqInfo}`;
  const logSuccessEnabled = process.env.VERBOSE === 'true';
  if (severity === 'success') {
    if (logSuccessEnabled) console.log(msg);
  } else if (severity === 'error') {
    console.error(msg);
  } else if (severity === 'warn') {
    console.warn(msg);
  } else {
    console.log(msg);
  }
}

enum Errors {
  API_KEY_MISSING = 'API_KEY_MISSING',
  API_KEY_INVALID = 'API_KEY_INVALID',
  ID_MISSING = 'ID_MISSING',
  PLACE_FETCH_FAILED = 'PLACE_FETCH_FAILED',
  SEARCH_FETCH_FAILED = 'SEARCH_FETCH_FAILED',
  PLACES_FETCH_FAILED = 'PLACES_FETCH_FAILED',
  PAGE_NOT_FOUND = 'PAGE_NOT_FOUND'
}

enum Endpoint {
  PLACES_ALL = '/places-all',
  SEARCH = '/search/:lat/:lng',
  PLACE_SHORT = '/place-short/:id',
  PLACE_FULL = '/place-full/:id'
}

const app = express();
const port = process.env.PORT || 3000;

// --- Config ---
const API_KEY_NAME = process.env.API_KEY_NAME || 'x-api-key';
const API_KEY = process.env.API_KEY;

// --- Middleware for optional header check ---
app.use((req: Request, res: Response, next: NextFunction): void => {
  if (API_KEY) {
    const apiKey = req.headers[API_KEY_NAME] as string | undefined;
    if (!apiKey) {
      const log: ErrorLog = { error: Errors.API_KEY_MISSING, message: `Missing API key in request header: ${API_KEY_NAME}` };
      logMessage('error', log, req);
      res.status(401).json(log);
      return;
    }
    if (apiKey !== API_KEY) {
      const log: ErrorLog = { error: Errors.API_KEY_INVALID, message: `Invalid API key in request header: ${API_KEY_NAME}` };
      logMessage('error', log, req);
      res.status(401).json(log);
      return;
    }
  }
  next();
});

// --- Endpoints ---
app.get('/', (_, res) => {
  logMessage('info', { error: null, message: '/' });
  res.json({
    name: packageJson.name,
    version: packageJson.version,
    docs: packageJson.homepage,
    links: Object.values(Endpoint)
  });
});

app.get(['/place-short/', '/place-full/'], (req, res) => {
  const log: ErrorLog = { error: Errors.ID_MISSING, message: `ID is missing. Provide ID like this: ${req.url}${req.url.endsWith('/') ? '' : '/'}1234` };
  logMessage('warn', log, req);
  res.status(404).json(log);
});

app.get(['/search/', '/search/:lat/'], (req, res) => {
  let log: ErrorLog;
  if (req.params.lat) {
    log = { error: Errors.ID_MISSING, message: 'Longitude is missing. Provide it like this: ' + req.url.replace(/\/$/, '') + '/50.08/14.42' };
  } else {
    log = { error: Errors.ID_MISSING, message: 'Latitude and longitude are missing. Provide them like this: ' + req.url + (req.url.endsWith('/') ? '' : '/') + '50.08/14.42' };
  }
  logMessage('warn', log, req);
  res.status(404).json(log);
});

app.get(Endpoint.PLACE_SHORT, async (req, res) => {
  try {
    const place = await atlasobscura.placeShort(+req.params.id);
    res.json(place);
    logMessage('success', { error: null, message: `${Endpoint.PLACE_SHORT}: ${req.params.id}` }, req);
  } catch (error) {
    const log: ErrorLog = { error: Errors.PLACE_FETCH_FAILED, message: 'Failed to fetch place data: ' + error };
    logMessage('error', log, req);
    res.status(500).json(log);
  }
});

app.get(Endpoint.PLACE_FULL, async (req, res) => {
  try {
    const result = await atlasobscura.placeFull(+req.params.id);
    res.json(result);
    logMessage('success', { error: null, message: `${Endpoint.PLACE_FULL}: ${req.params.id}` }, req);
  } catch (error) {
    const log: ErrorLog = { error: Errors.PLACE_FETCH_FAILED, message: 'Failed to fetch place data: ' + error };
    logMessage('error', log, req);
    res.status(500).json(log);
  }
});

app.get(Endpoint.SEARCH, async (req, res) => {
  try {
    const result = await atlasobscura.search({ lat: req.params.lat, lng: req.params.lng });
    res.json(result);
    logMessage('success', { error: null, message: `${Endpoint.SEARCH}: ${req.params.lat},${req.params.lng}` }, req);
  } catch (error) {
    const log: ErrorLog = { error: Errors.SEARCH_FETCH_FAILED, message: 'Failed to fetch search data: ' + error };
    logMessage('error', log, req);
    res.status(500).json(log);
  }
});

app.get(Endpoint.PLACES_ALL, async (_, res) => {
  try {
    const result = await atlasobscura.placesAll();
    res.json(result);
    logMessage('success', { error: null, message: `${Endpoint.PLACES_ALL}` });
  } catch (error) {
    const log: ErrorLog = { error: Errors.PLACES_FETCH_FAILED, message: 'Failed to fetch places data: ' + error };
    logMessage('error', log, undefined);
    res.status(500).json(log);
  }
});

// --- 404 handler ---
app.use((req, res) => {
  const log: ErrorLog = { error: Errors.PAGE_NOT_FOUND, message: 'The requested endpoint could not be found.' };
  logMessage('warn', log, req);
  res.status(404).json(log);
});

// --- Start server ---
app.listen(port, () => {
  console.log(`atlas-obscura-api@${packageJson.version}\n`);
  console.log(`Docs: ${packageJson.homepage}`);
  console.log(`Endpoints: ${Object.values(Endpoint).join(', ')}\n`);
  console.log(`API is running on: http://localhost:${port}\n`);
  if (!API_KEY) {
    console.log('\x1b[31m%s\x1b[0m', '⚠️ Server is OPEN!\n- Your server will be open to the world and potentially everyone can use it without any restriction.\n- To enable some basic protection, set API_KEY environment variable with a value and provide the same value in request header: ' + API_KEY_NAME);
  } else {
    console.log('\x1b[32m%s\x1b[0m', '✔️ Server is protected (somehow).\n- Your API_KEY is set and will be checked for each request header: ' + API_KEY_NAME);
  }
});