import { gotScraping } from 'got-scraping';

export const fetchPage = async (url: string, headersCustom?: Record<string, string>): Promise<string> => {
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
        operatingSystems: ['windows', 'macos'],
      },
      headers: {
        'Cache-Control': 'no-cache',
        ...headersCustom,
      },
      // Optional: HTTP2 is often faster and less suspicious for modern sites,
      // but sometimes causes stability issues. Try true if false doesn't work.
      http2: true,
    });

    return response.body;

  } catch (error: any) {
    // Better error logging to debug 403s
    if (error.response) {
      console.error(`atlas-obscura-api: Request failed with status code ${error.response.statusCode} for url: ${url}`);
    } else {
      console.error('fetchPage error:', error.message);
    }

    return 'Error';
  }
};