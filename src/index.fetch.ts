// Entry for React Native and browsers (see "exports" in package.json); same API, but no got-scraping.
import { AtlasObscura } from './atlas-obscura.js';
import { fetchPage } from './fetchers/fetch.js';
import { PlacesScraper } from './services/location.service.js';

export { AtlasObscura } from './atlas-obscura.js';
export const atlasObscura: AtlasObscura = new AtlasObscura(new PlacesScraper(fetchPage));
export type * from './interfaces/index.js';
