// test fetch of coffee shops
import { fetchCoffeeShops } from '../src/api.js';
import { getToken } from '../src/api.js';

// Mock fetch globally
global.fetch = jest.fn();

describe('API functions', () => {
  afterEach(() => jest.clearAllMocks());

  it('should fetch a token correctly', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'mockToken' }) });
    const token = await getToken();
    expect(token).toBe('mockToken');
  });

  it('should handle token fetch error', async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(getToken()).rejects.toThrow('Failed fetch');
  });

  it('should fetch coffee shops correctly', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'mockToken' }) });
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [{ name: 'Starbucks' }] });
    const coffeeShops = await fetchCoffeeShops();
    expect(coffeeShops).toEqual([{ name: 'Starbucks' }]);
  });

  it('should handle coffee shops fetch error', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'mockToken' }) });
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(fetchCoffeeShops()).rejects.toThrow('Failed to fetch coffee shops');
  });
});