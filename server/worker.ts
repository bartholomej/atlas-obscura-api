// got-scraping needs Node networking, so the Worker uses the plain fetch build
import { atlasObscura } from '../src/index.fetch.js';
import { createApp } from './app.js';

export default createApp(atlasObscura);
