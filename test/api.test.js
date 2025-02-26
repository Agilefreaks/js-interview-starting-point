import { getCoffeeShops, getToken } from '../src/api.js';
import { sleep } from '../src/utils.js';

jest.mock('../src/utils.js', () => ({
    ...jest.requireActual('../src/utils.js'),
    sleep: jest.fn(() => Promise.resolve()),
}));

describe('API Functions', () => {
    let originalFetch;

    beforeAll(() => {
        originalFetch = global.fetch;
    });

    afterAll(() => {
        global.fetch = originalFetch;
    });

    beforeEach(() => {
        jest.resetAllMocks();
        global.console.log = jest.fn();
        global.console.error = jest.fn();
        sleep.mockClear();
    });

    describe('getToken', () => {
        test('returns token when API call succeeds', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                status: 200,
                json: jest.fn().mockResolvedValue({ token: 'token' }),
            });

            const result = await getToken();

            expect(result).toEqual({ token: 'token' });
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        test('retries on server error', async () => {
            global.fetch = jest
                .fn()
                .mockResolvedValueOnce({
                    ok: false,
                    status: 503,
                    statusText: 'Service Unavailable',
                })
                .mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: jest.fn().mockResolvedValue({ token: 'token' }),
                });

            const result = await getToken();

            expect(result).toEqual({ token: 'token' });
            expect(global.fetch).toHaveBeenCalledTimes(2);
            expect(sleep).toHaveBeenCalledTimes(1);
        });

        test('throws error after max retries', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: false,
                status: 503,
                statusText: 'Service Unavailable',
            });

            await expect(getToken()).rejects.toThrow();

            expect(global.fetch).toHaveBeenCalledTimes(3);
            expect(sleep).toHaveBeenCalledTimes(3);
        });
    });

    describe('getCoffeeShops', () => {
        test('gets coffee shops with valid token', async () => {
            global.fetch = jest
                .fn()
                .mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: jest.fn().mockResolvedValue({ token: 'token' }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: jest.fn().mockResolvedValue([
                        { id: 1, name: 'Coffee A', x: 10, y: 20 },
                        { id: 2, name: 'Coffee B', x: 30, y: 40 },
                    ]),
                });

            const result = await getCoffeeShops();

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('Coffee A');
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        test('gets new token when token expires', async () => {
            global.fetch = jest
                .fn()
                .mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: jest.fn().mockResolvedValue({ token: 'token' }),
                })
                .mockResolvedValueOnce({
                    ok: false,
                    status: 401,
                    statusText: 'Unauthorized',
                })
                .mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: jest.fn().mockResolvedValue({ token: 'new-token' }),
                })
                .mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    json: jest
                        .fn()
                        .mockResolvedValue([
                            { id: 1, name: 'Coffee A', x: 10, y: 20 },
                        ]),
                });

            const result = await getCoffeeShops();

            expect(result).toHaveLength(1);
            expect(global.fetch).toHaveBeenCalledTimes(4);
        });
    });
});
