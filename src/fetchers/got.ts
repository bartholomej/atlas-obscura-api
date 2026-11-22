import { gotScraping } from 'got-scraping';
import { FetchPage } from './types.js';

export const fetchPage: FetchPage = async (url, headersCustom) => {
  try {
    const response = await gotScraping({
      url,
      // Configuration to mimic a modern desktop browser (Chrome/Firefox)
      headerGeneratorOptions: {
        browsers: [
          { name: 'chrome', minVersion: 115 },
          { name: 'firefox', minVersion: 115 }
        ],
        devices: ['desktop'],
        locales: ['en-US'],
        operatingSystems: ['windows', 'macos']
      },
      headers: {
        'Cache-Control': 'no-cache',
        ...headersCustom
      },
      // Optional: HTTP2 is often faster and less suspicious for modern sites,
      // but sometimes causes stability issues. Try true if false doesn't work.
      http2: true
    });

    return response.body;
  } catch (error) {
    // Better error logging to debug 403s
    const statusCode = (error as { response?: { statusCode?: number } }).response?.statusCode;
    if (statusCode) {
      console.error(
        `atlas-obscura-api: Request failed with status code ${statusCode} for url: ${url}`
      );
    } else {
      console.error('fetchPage error:', error instanceof Error ? error.message : error);
    }

    return 'Error';
  }
};
