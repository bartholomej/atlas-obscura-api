/** Returns the response body, or the string `'Error'` when the request failed. */
export type FetchPage = (url: string, headers?: Record<string, string>) => Promise<string>;
