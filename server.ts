import express from 'express';
import packageJson from './package.json';
import { atlasobscura } from './src';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (_, res) => {
  res.json({
    name: packageJson.name,
    version: packageJson.version,
    docs: packageJson.homepage,
    links: ['/places-all', '/search/:lat/lng', '/place-short/:id', '/place-full/:id']
  });
});

app.get(['/place-short/', '/place-full/'], (req, res) => {
  res.json({
    error: `ID is missing. Provide ID like this: ${req.url}${req.url.endsWith('/') ? '' : '/'}1234`
  });
});

app.get(['/search/', '/search/:lat/'], (req, res) => {
  if (req.params.lat) {
    res.json({
      error:
        'Longitude is missing. Provide it like this: ' + req.url.replace(/\/$/, '') + '/50.08/14.42'
    });
  } else {
    res.json({
      error:
        'Latitude and longitude are missing. Provide them like this: ' +
        req.url +
        (req.url.endsWith('/') ? '' : '/') +
        '50.08/14.42'
    });
  }
});

app.get('/place-short/:id', async (req, res) => {
  try {
    const place = await atlasobscura.placeShort(+req.params.id);
    res.json(place);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch place data' });
  }
});

app.get('/place-full/:id', async (req, res) => {
  try {
    const result = await atlasobscura.placeFull(+req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch place data: ' + error });
  }
});

app.get('/search/:lat/:lng', async (req, res) => {
  try {
    const result = await atlasobscura.search({ lat: req.params.lat, lng: req.params.lng });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch search data: ' + error });
  }
});

app.get('/places-all', async (_, res) => {
  try {
    const result = await atlasobscura.placesAll();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch places data: ' + error });
  }
});

app.listen(port, () => {
  console.log(`API is running on http://localhost:${port}`);
});
