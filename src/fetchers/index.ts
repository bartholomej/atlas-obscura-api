import fetch from 'cross-fetch';

const USER_AGENTS: string[] = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:84.0) Gecko/20100101 Firefox/84.0',
  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; C6L Build/OPM2.171019.012)',
  'Mozilla/5.0 (Windows; Windows NT 10.0; x64) AppleWebKit/537.50 (KHTML, like Gecko) Chrome/48.0.2572.385 Safari/537.9 Edge/8.37913',
  'Mozilla/5.0 (Linux; Android 12; SM-A127F Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.104 Mobile Safari/537.36 Instagram 243.0.0.16.111 Android (31/12; 300dpi; 720x1467; samsung; SM-A127F; a12s; exynos850; in_ID; 382290496)',
  'Mozilla/5.0 (Linux; Android 11; M2101K7BNY Build/RP1A.200720.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/103.0.5060.70 Mobile Safari/537.36 [FB_IAB/Orca-Android;FBAV/369.0.0.7.111;]'
];

const headers = {
  'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
  'Cache-Control': 'no-cache'
};

export const fetchPage = async (url: string, headersCustom?: Headers): Promise<string> => {
  try {
    const response = await fetch(url, { headers: { ...headers, ...headersCustom }, credentials: 'omit' });
    if (response.status >= 400 && response.status < 600) {
      throw new Error(`atlas-obscura-api: Bad response ${response.status} for url: ${url}`);
    }
    return await response.text();
  } catch (e) {
    console.error(e);
    return 'Error';
  }
};
