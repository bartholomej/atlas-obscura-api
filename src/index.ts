import { AtlasObscura } from './atlas-obscura.js';
import { fetchPage } from './fetchers/got.js';
import { PlacesScraper } from './services/location.service.js';

export { AtlasObscura } from './atlas-obscura.js';
export const atlasObscura: AtlasObscura = new AtlasObscura(new PlacesScraper(fetchPage));
export type * from './interfaces/index.js';
