import { serve } from '@hono/node-server';
import { existsSync } from 'node:fs';
import packageJson from '../package.json' with { type: 'json' };
import { atlasObscura } from '../src/index.js';
import { createApp, Endpoint } from './app.js';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const port = Number(process.env.PORT) || 3000;
const API_KEY_NAME = process.env.API_KEY_NAME || 'x-api-key';

serve({ fetch: createApp(atlasObscura).fetch, port }, () => {
  console.log(`atlas-obscura-api@${packageJson.version}\n`);
  console.log(`Docs: ${packageJson.homepage}`);
  console.log(`Endpoints: ${Object.values(Endpoint).join(', ')}\n`);
  console.log(`API is running on: http://localhost:${port}\n`);
  if (!process.env.API_KEY) {
    console.log(
      '\x1b[31m%s\x1b[0m',
      '⚠️ Server is OPEN!\n- Your server will be open to the world and potentially everyone can use it without any restriction.\n- To enable some basic protection, set the API_KEY environment variable and send the same value as "Authorization: Bearer <key>".'
    );
  } else {
    console.log(
      '\x1b[32m%s\x1b[0m',
      '✔️ Server is protected (somehow).\n- Your API_KEY is set. Send it as "Authorization: Bearer <key>" (the ' +
        API_KEY_NAME +
        ' header still works but is deprecated).'
    );
  }
});
