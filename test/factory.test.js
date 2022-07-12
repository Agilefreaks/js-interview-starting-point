// @ts-nocheck
jest.mock('../src/app.js');
jest.mock('../src/io.js');
import { Factory } from '../src/factory.js';
import * as App from '../src/app.js';
import * as IO from '../src/io.js';
import { shopDistanceTo, distanceAsc } from '../src/coffeeShop';


const conf = {};

describe('factory.js', () => {
    describe('nearestCoffeeShops()', () => {
        it('calls and returns app.nearestShopsFactory() providing all dependencies', () => {
            const factory = new Factory(conf);
            factory.fetchCoffeeShopList = () => 'fetchCoffeeShopListFn';
            factory.shopDistanceTo = () => 'shopDistanceToFn';
            factory.distanceAsc = () => 'distanceAscFn';
            App.nearestShopsFactory.mockReturnValue('expected');

            expect(factory.nearestCoffeeShops()).toBe('expected');
            expect(App.nearestShopsFactory).toHaveBeenCalledTimes(1);
            expect(App.nearestShopsFactory).toHaveBeenCalledWith(
                'fetchCoffeeShopListFn',
                'shopDistanceToFn',
                'distanceAscFn'
            );
            App.nearestShopsFactory.mockReset();
        });
    });

    describe('fetchCoffeeShopList()', () => {
        it('calls and returns app.fetchShopListFactory() providing all dependencies', () => {
            const factory = new Factory(conf);
            factory.fetchCoffeeShopAPIToken = () => 'fetchCoffeeShopAPITokenFn';
            factory.fetchCoffeeShops = () => 'fetchCoffeeShopsFn';
            App.fetchShopListFactory.mockReturnValue('expected');

            expect(factory.fetchCoffeeShopList()).toBe('expected');
            expect(App.fetchShopListFactory).toHaveBeenCalledTimes(1);
            expect(App.fetchShopListFactory).toHaveBeenCalledWith(
                'fetchCoffeeShopAPITokenFn',
                'fetchCoffeeShopsFn'
            );
            App.fetchShopListFactory.mockReset();
        });
    });

    describe('fetchCoffeeShops()', () => {
        it('calls and returns app.fetchCoffeeShopsFactory() providing all dependencies', () => {
            conf.host = 'example.com';
            conf.coffeeShopsPath = 'coffeeShop/path';
            const factory = new Factory(conf);
            factory.httpFetch = () => 'httpFetchFn';
            factory.parseCoffeeShops = () => 'parseCoffeeShopsFn';
            App.fetchCoffeeShopsFactory.mockReturnValue('expected');

            expect(factory.fetchCoffeeShops()).toBe('expected');
            expect(App.fetchCoffeeShopsFactory).toHaveBeenCalledTimes(1);
            expect(App.fetchCoffeeShopsFactory).toHaveBeenCalledWith(
                'example.com',
                'coffeeShop/path',
                'httpFetchFn',
                'parseCoffeeShopsFn'
            );
            App.fetchCoffeeShopsFactory.mockReset();
        });
    });

    describe('shopDistanceTo()', () => {
        it('returns CoffeeShop.shopDistanceTo()', () => {
            const factory = new Factory(conf);
            expect(factory.shopDistanceTo()).toBe(shopDistanceTo);
        });
    });

    describe('distanceAsc()', () => {
        it('returns CoffeeShop.distanceAsc()', () => {
            const factory = new Factory(conf);
            expect(factory.distanceAsc()).toBe(distanceAsc);
        });
    });

    describe('fetchCoffeeShopAPIToken()', () => {
        it('calls and returns app.fetchCoffeeShopAPITokenFactory() providing all dependencies', () => {
            conf.host = 'example.com';
            conf.tokenPath = 'token/path';
            const factory = new Factory(conf);
            factory.httpFetch = () => 'httpFetchFn';
            App.fetchCoffeeShopAPITokenFactory.mockReturnValue('expected');

            expect(factory.fetchCoffeeShopAPIToken()).toBe('expected');
            expect(App.fetchCoffeeShopAPITokenFactory).toHaveBeenCalledTimes(1);
            expect(App.fetchCoffeeShopAPITokenFactory).toHaveBeenCalledWith(
                'example.com',
                'token/path',
                'httpFetchFn'
            );
            App.fetchCoffeeShopAPITokenFactory.mockReset();
        });
    });

    describe('httpFetch()', () => {
        it('calls and returns IO.httpFetchFactory() providing all dependencies', () => {
            conf.host = 'example.com';
            conf.tokenPath = 'token/path';
            const factory = new Factory(conf);
            factory.resolveJsonResponse = () => 'resolveJsonResponseFn';
            factory.resolveJsonRequestOptions = () => 'resolveJsonRequestOptionsFn';
            factory.https = () => 'https-module';
            IO.httpFetchFactory.mockReturnValue('expected');

            expect(factory.httpFetch()).toBe('expected');
            expect(IO.httpFetchFactory).toHaveBeenCalledTimes(1);
            expect(IO.httpFetchFactory).toHaveBeenCalledWith(
                'https-module',
                'resolveJsonResponseFn',
                'resolveJsonRequestOptionsFn'
            );
            IO.httpFetchFactory.mockReset();
        });
    });

    describe('resolveJsonResponse()', () => {
        it('returns IO.resolveJsonResponseFactory()', () => {
            const factory = new Factory(conf);
            expect(factory.resolveJsonResponse()).toBe(IO.resolveJsonResponseFactory);
        });
    });

});