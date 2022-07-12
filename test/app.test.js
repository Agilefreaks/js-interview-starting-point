import * as App from '../src/app.js';
import { AsyncList } from '../src/asyncList';
import { CoffeeShop, distanceAsc } from '../src/coffeeShop.js';

describe('app.js', () => {

    describe('fetchCoffeeShopAPIToken()', () => {
        const host = 'example.com';
        const path = 'test';

        it('returns a api token', () => {
            const expected = 'cool token';
            const httpFetch = jest.fn(() => Promise.resolve({ token: expected }));
            const fetchCoffeeShopAPIToken = App.fetchCoffeeShopAPITokenFactory(host, path, httpFetch);

            return expect(fetchCoffeeShopAPIToken()).resolves.toBe(expected);
        });

        it('calls httpFetch with correct data', () => {
            const httpFetch = jest.fn(() => Promise.resolve({ token: '' }));
            const fetchCoffeeShopAPIToken = App.fetchCoffeeShopAPITokenFactory(host, path, httpFetch);
            const expectedName = 'Fetch Token';
            const expectedOptions = {
                host: 'example.com',
                method: 'POST',
                path: 'test'
            };

            fetchCoffeeShopAPIToken();

            expect(httpFetch).toHaveBeenCalledTimes(1);
            expect(httpFetch).toHaveBeenCalledWith(expectedName, expectedOptions);
        });

        it('rejects if response data has no token property', () => {
            const httpFetch = jest.fn(() => Promise.resolve({ other_token: '' }));
            const fetchCoffeeShopAPIToken = App.fetchCoffeeShopAPITokenFactory(host, path, httpFetch);

            return expect(fetchCoffeeShopAPIToken()).rejects.toThrow('Fetch Token: no token found in response');
        });
    });

    describe('fetchCoffeeShops()', () => {
        const host = 'example.com';
        const path = 'test';

        it('returns a Promise containing a list of Coffee Shops', () => {
            const shopList = ['shop1'];
            const expected = ['the first shop'];
            const httpFetch = jest.fn(() => Promise.resolve(shopList));
            const parseData = jest.fn((data) => {
                if (data === shopList) return expected;
            });
            const fetchCoffeeShops = App.fetchCoffeeShopsFactory(host, path, httpFetch, parseData);

            return expect(fetchCoffeeShops('token')).resolves.toBe(expected);
        });

        it('calls httpFetch with correct data', () => {
            const httpFetch = jest.fn(() => Promise.resolve());
            const parseData = jest.fn(() => { });
            const fetchCoffeeShops = App.fetchCoffeeShopsFactory(host, path, httpFetch, parseData);
            const expectedName = 'Fetch coffee-shops';
            const expectedOptions = {
                host: 'example.com',
                path: 'test?token=the_token'
            };

            fetchCoffeeShops('the_token');

            expect(httpFetch).toHaveBeenCalledTimes(1);
            expect(httpFetch).toHaveBeenCalledWith(expectedName, expectedOptions);
        });
    });

    describe('parseCoffeeShops()', () => {
        it('parses raw data into CoffeeShop instances', () => {
            const list = [
                { name: 'shop1', x: 10, y: 11 },
                { name: 'shop2', x: 20, y: 22 }
            ];

            expect(App.parseCoffeeShops(list)).toEqual([
                new CoffeeShop('shop1', 10, 11),
                new CoffeeShop('shop2', 20, 22)
            ]);
        });

        it('returns a rejected promise if not an array', () => {
            const list = 'not a list';
            return expect(App.parseCoffeeShops(list)).rejects.toThrow('Invalid coffee shop data');
        });

        it('returns a rejected promise if data does not contain name', () => {
            const list = [
                { name: 'shop1', x: 10, y: 11 },
                { x: 20, y: 22 }
            ];
            return expect(App.parseCoffeeShops(list)).rejects.toThrow('Invalid coffee shop data');
        });

        it('returns a rejected promise if data does not contain x', () => {
            const list = [
                { name: 'shop1', x: 10, y: 11 },
                { name: 'shop2', y: 22 }
            ];
            return expect(App.parseCoffeeShops(list)).rejects.toThrow('Invalid coffee shop data');
        });

        it('returns a rejected promise if data does not contain y', () => {
            const list = [
                { name: 'shop1', x: 10, y: 11 },
                { name: 'shop2', x: 20 }
            ];
            return expect(App.parseCoffeeShops(list)).rejects.toThrow('Invalid coffee shop data');
        });
    });

    describe('fetchShopList()', () => {
        it('calls fetchShops and wraps the result in an AsyncList', () => {
            expect.assertions(1);
            const fetchCoffeeShopAPIToken = jest.fn(() => Promise.resolve('the token'));
            const fetchShops = jest.fn((token) => {
                if (token === 'the token') {
                    return Promise.resolve([1]);
                }
                Promise.reject('no token');
            });
            const fetch = App.fetchShopListFactory(fetchCoffeeShopAPIToken, fetchShops);
            return fetch().run().then(list => expect(list).toEqual([1]));
        });
    });

    describe('getNearestShops()', () => {
        it('returns the n nearest shops from a point', () => {
            let distance = 3;
            const expectedOrigin = { x: 1, y: 1 };
            const shopList = ['shop1', 'shop2', 'shop3'];
            const fetchCoffeeShops = jest.fn(() => new AsyncList(Promise.resolve(shopList)));
            const shopDistanceTo = jest.fn(point => shop => {
                if (point === expectedOrigin) return { distance: distance--, shop: shop };
            });
            const getNearestShops = App.nearestShopsFactory(fetchCoffeeShops, shopDistanceTo, distanceAsc);

            return expect(getNearestShops(expectedOrigin, 2)).resolves.toEqual([
                { distance: 1, shop: 'shop3' },
                { distance: 2, shop: 'shop2' }
            ]);
        });
    });

});