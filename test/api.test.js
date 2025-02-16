// test fetch of coffee shops
import { fetchCoffeeShops, getToken } from '../src/api.js';

// Mock fetch globally
global.fetch = jest.fn();

describe('API functions', () => {
  // Clear mocks after each test
  afterEach(() => jest.clearAllMocks());

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

  it('should fetch coffee shops correctly', async () => {
    fetch.mockResolvedValueOnce({ok: true, json: async () => ({ token: 'mockToken' })});
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [{ name: 'Seattle' }] });
    const coffeeShops = await fetchCoffeeShops();
    expect(coffeeShops).toBeDefined(); 
  });

  it('should throw an error if coffee shops fetch fails', async () => {
    // Spy on console.error to capture error logs
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    fetch.mockResolvedValueOnce({ ok: false });
    await expect(fetchCoffeeShops()).rejects.toThrow();

    // Verify that console.error was called
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});