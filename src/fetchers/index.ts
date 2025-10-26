const USER_AGENTS: string[] = [
  'Dalvik/2.1.0 (Linux; U; Android 8.1.0; C6L Build/OPM2.171019.012)',
  'Mozilla/5.0 (Windows; Windows NT 10.0; x64) AppleWebKit/537.50 (KHTML, like Gecko) Chrome/48.0.2572.385 Safari/537.9 Edge/8.37913',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14E5239e Safari/602.1',
  'Dalvik/2.1.0 (Linux; U; Android 11; SM-A505GT Build/RP1A.200720.012)',
  'Mozilla/5.0 (Windows NT 10.3;; en-US) AppleWebKit/602.25 (KHTML, like Gecko) Chrome/54.0.2457.241 Safari/534.5 Edge/9.65405',
  'Mozilla/5.0 (Windows; U; Windows NT 10.4; x64) AppleWebKit/536.41 (KHTML, like Gecko) Chrome/53.0.3535.112 Safari/600.5 Edge/14.39786',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 8_4_0; like Mac OS X) AppleWebKit/601.9 (KHTML, like Gecko)  Chrome/47.0.2876.394 Mobile Safari/600.5',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 7_6_3; like Mac OS X) AppleWebKit/602.24 (KHTML, like Gecko)  Chrome/54.0.3204.297 Mobile Safari/537.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 10_9_6; like Mac OS X) AppleWebKit/601.4 (KHTML, like Gecko)  Chrome/55.0.2808.105 Mobile Safari/600.4',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 8_2_1; like Mac OS X) AppleWebKit/600.14 (KHTML, like Gecko)  Chrome/50.0.3808.259 Mobile Safari/534.1',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 10_4_2; like Mac OS X) AppleWebKit/534.21 (KHTML, like Gecko)  Chrome/47.0.3531.351 Mobile Safari/533.0'
];

const DEFAULT_HEADERS = {
  'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
  'Cache-Control': 'no-cache',
};

export const fetchPage = async (url: string, headersCustom?: Headers): Promise<string> => {
  try {
    const response = await fetch(url, {
      headers: { ...DEFAULT_HEADERS, ...headersCustom },
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`atlas-obscura-api: Bad response ${response.status} for url: ${url}`);
    }

    return await response.text();
  } catch (error) {
    console.error('fetchPage error:', error);
    return 'Error';
  }
};
