/**
 * Unit tests for API functions:`fetchCoffeeShops` and `getToken`.
 *
 * Tests include:
 * - Ensuring the token retrieval function fetches and returns a valid token.
 * - Handling API failures and ensuring errors are properly thrown.
 * - Fetching coffee shop data correctly using a retrieved token.
 */


import { fetchCoffeeShops, getToken } from '../src/api.js';

jest.mock('../src/constants.js', () => ({
  HTTP_STATUS: {
    OK: 200,
    UNAUTHORIZED: 401,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
  },
  URL: 'https://api.example.com',
  errorMessages: {
    401: 'Unauthorized',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
  },
}));

global.fetch = jest.fn();
const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});


describe('API functions', () => {
  // Clear mocks after each test
  afterEach(() => jest.clearAllMocks());

  describe('getToken', () => {
    it('should fetch a token correctly', async () => {
      // Mock the response of the token fetch
      fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'mockToken' }) });
      const token = await getToken();
      // Ensure token is a string & not empty
      expect(typeof token.token).toBe('string');
      expect(token.token).not.toBe('');
    });

    it('should throw an error if token fetch fails', async () => {
      // Spy on console.error to capture error logs
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      fetch.mockResolvedValueOnce({ ok: false }); 
      await expect(getToken()).rejects.toThrow();

      // Verify that console.error was called
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should retry fetching a token on failure and eventually succeed', async () => {
      fetch
        .mockResolvedValueOnce({ ok: false, status: 503 })
        .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue({ token: 'mockToken' }) });

      const token = await getToken();
      expect(token.token).toBe('mockToken');
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('fetchCoffeeShops', () => {
    it('should fetch coffee shops correctly', async () => {
      fetch.mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue([{ name: 'Seattle' }]) });
      const coffeeShops = await fetchCoffeeShops();
      expect(coffeeShops).toBeDefined(); 
    });

    it('should retry fetching coffee shops on failure', async () => {
      fetch
        .mockResolvedValueOnce({ ok: false, status: 503 })
        .mockResolvedValueOnce({ ok: true, json: jest.fn().mockResolvedValue([{ name: 'Coffee' }]) });

      const shops = await fetchCoffeeShops();
      expect(shops).toEqual([{ name: 'Coffee' }]);
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(consoleWarnSpy).toHaveBeenCalled();
    });
  });
});