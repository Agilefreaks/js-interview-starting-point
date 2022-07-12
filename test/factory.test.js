// @ts-nocheck
jest.mock('../src/app.js');
jest.mock('../src/io.js');
import https from 'https';
import { Factory } from '../src/factory.js';
import * as App from '../src/app.js';
import * as IO from '../src/io.js';
import { shopDistanceTo, distanceAsc } from '../src/coffeeShop';


const conf = {};

describe('factory.js', () => {
    describe('nearestCoffeeShops()', () => {
        it('calls and returns app.nearestShopsFactory() providing all dependencies', () => {
            const factory = new Factory(conf);

            const fakeFetchCoffeeShopList = () => { };
            const fetchCoffeeShopListSpy = jest.spyOn(factory, 'fetchCoffeeShopList')
                .mockReturnValue(fakeFetchCoffeeShopList);

            App.nearestShopsFactory.mockReturnValue('expected');

            expect(factory.nearestCoffeeShops()).toBe('expected');
            expect(App.nearestShopsFactory).toHaveBeenCalledWith(
                fakeFetchCoffeeShopList,
                shopDistanceTo,
                distanceAsc
            );

            App.nearestShopsFactory.mockReset();
            fetchCoffeeShopListSpy.mockRestore();
        });
    });

    describe('fetchCoffeeShopList()', () => {
        it('calls and returns app.fetchShopListFactory() providing all dependencies', () => {
            const factory = new Factory(conf);

            const fakeFetchCoffeeShopAPIToken = () => { };
            const fetchCoffeeShopAPITokenSpy = jest.spyOn(factory, 'fetchCoffeeShopAPIToken')
                .mockReturnValue(fakeFetchCoffeeShopAPIToken);

            const fakeFetchCoffeeShops = () => { };
            const fetchCoffeeShopsSpy = jest.spyOn(factory, 'fetchCoffeeShops')
                .mockReturnValue(fakeFetchCoffeeShops);

            App.fetchShopListFactory.mockReturnValue('expected');


            expect(factory.fetchCoffeeShopList()).toBe('expected');
            expect(App.fetchShopListFactory).toHaveBeenCalledWith(
                fakeFetchCoffeeShopAPIToken,
                fakeFetchCoffeeShops
            );

            App.fetchShopListFactory.mockReset();
            fetchCoffeeShopAPITokenSpy.mockRestore();
            fetchCoffeeShopsSpy.mockRestore();
        });
    });

    describe('fetchCoffeeShops()', () => {
        it('calls and returns app.fetchCoffeeShopsFactory() providing all dependencies', () => {
            conf.host = 'example.com';
            conf.coffeeShopsPath = 'coffeeShop/path';
            const factory = new Factory(conf);

            const fakeHttpFetch = () => { };
            const httpFetchSpy = jest.spyOn(factory, 'httpFetch')
                .mockReturnValue(fakeHttpFetch);

            App.fetchCoffeeShopsFactory.mockReturnValue('expected');

            expect(factory.fetchCoffeeShops()).toBe('expected');
            expect(App.fetchCoffeeShopsFactory).toHaveBeenCalledWith(
                'example.com',
                'coffeeShop/path',
                fakeHttpFetch,
                App.parseCoffeeShops
            );

            App.fetchCoffeeShopsFactory.mockReset();
            httpFetchSpy.mockRestore();
        });
    });

    describe('fetchCoffeeShopAPIToken()', () => {
        it('calls and returns app.fetchCoffeeShopAPITokenFactory() providing all dependencies', () => {
            conf.host = 'example.com';
            conf.tokenPath = 'token/path';
            const factory = new Factory(conf);

            const fakeHttpFetch = () => { };
            const httpFetchSpy = jest.spyOn(factory, 'httpFetch')
                .mockReturnValue(fakeHttpFetch);

            App.fetchCoffeeShopAPITokenFactory.mockReturnValue('expected');

            expect(factory.fetchCoffeeShopAPIToken()).toBe('expected');
            expect(App.fetchCoffeeShopAPITokenFactory).toHaveBeenCalledWith(
                'example.com',
                'token/path',
                fakeHttpFetch
            );

            App.fetchCoffeeShopAPITokenFactory.mockReset();
            httpFetchSpy.mockRestore();
        });
    });

    describe('httpFetch()', () => {
        it('calls and returns IO.httpFetchFactory() providing all dependencies', () => {
            conf.host = 'example.com';
            conf.tokenPath = 'token/path';
            const factory = new Factory(conf);

            IO.httpFetchFactory.mockReturnValue('expected');

            expect(factory.httpFetch()).toBe('expected');
            expect(IO.httpFetchFactory).toHaveBeenCalledWith(
                https,
                IO.resolveJsonResponseFactory,
                IO.resolveJsonRequestOptions
            );

            IO.httpFetchFactory.mockReset();
        });
    });
});