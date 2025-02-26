import { getNearestShops } from '../src/app.js';
import { getCoffeeShops } from '../src/api.js';

jest.mock('../src/api.js');

describe('App Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.console.log = jest.fn();
        global.console.error = jest.fn();
    });

    describe('getNearestShops', () => {
        test('returns three closest shops sorted by distance', async () => {
            getCoffeeShops.mockResolvedValue([
                { name: 'Coffee A', x: 10, y: 10 },
                { name: 'Coffee B', x: 20, y: 20 },
                { name: 'Coffee C', x: 30, y: 30 },
                { name: 'Coffee D', x: 40, y: 40 },
                { name: 'Coffee E', x: 50, y: 50 },
            ]);

            await getNearestShops({ x: 15, y: 15 });

            expect(console.log).toHaveBeenCalledTimes(3);
            expect(console.log).toHaveBeenNthCalledWith(
                1,
                expect.stringContaining('Coffee A'),
            );
            expect(console.log).toHaveBeenNthCalledWith(
                2,
                expect.stringContaining('Coffee B'),
            );
            expect(console.log).toHaveBeenNthCalledWith(
                3,
                expect.stringContaining('Coffee C'),
            );
        });

        test('handles invalid position data', async () => {
            await getNearestShops({ x: 'invalid', y: 10 });

            expect(getCoffeeShops).not.toHaveBeenCalled();
            expect(console.error).toHaveBeenCalled();
        });

        test('handles API errors', async () => {
            getCoffeeShops.mockRejectedValue(new Error('API error'));

            await getNearestShops({ x: 10, y: 10 });

            expect(console.error).toHaveBeenCalled();
        });

        test('formats distances to four decimal places', async () => {
            getCoffeeShops.mockResolvedValue([
                { name: 'Coffee A', x: 10, y: 10 }, // Distance to (0,0) = 14.1421...
            ]);

            console.log = jest.fn().mockImplementation(message => {
                const distancePart = message.split(', ')[1];
                expect(distancePart.match(/\.\d{4}$/)).not.toBeNull();
            });

            await getNearestShops({ x: 0, y: 0 });

            expect(console.log).toHaveBeenCalled();
        });
    });
});
