// got-scraping needs Node networking, so the Worker uses the plain fetch build
import { atlasObscura } from '../src/index.fetch.js';
import { createApp } from './app.js';

// A new deployment has no clients that send x-api-key, so only Bearer is accepted
export default createApp(atlasObscura, { legacyKeyHeader: false });
