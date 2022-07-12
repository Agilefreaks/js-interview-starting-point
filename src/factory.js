import https from 'https';
import * as App from './app.js';
import * as CoffeeShop from './coffeeShop.js';
import * as IO from './io.js';

/**
 * @typedef FactoryConfig
 * @type {object}
 * @property {string} host
 * @property {string} tokenPath
 * @property {string} coffeeShopsPath
 */

/**
 * Main factory class used for wiring the application
 */
export class Factory {

    /**
     * @constructor
     * @param {FactoryConfig} config
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * @returns {App.getNearestShops}
     */
    nearestCoffeeShops() {
        return App.nearestShopsFactory(
            this.fetchCoffeeShopList(),
            CoffeeShop.shopDistanceTo,
            CoffeeShop.distanceAsc
        );
    }

    /**
     * @returns {App.fetchShopList}
     */
    fetchCoffeeShopList() {
        return App.fetchShopListFactory(
            this.fetchCoffeeShopAPIToken(),
            this.fetchCoffeeShops()
        );
    }

    /**
     * @returns {App.fetchCoffeeShops}
     */
    fetchCoffeeShops() {
        const { host, coffeeShopsPath } = this.config;
        const httpFetch = this.httpFetch();
        return App.fetchCoffeeShopsFactory(host, coffeeShopsPath, httpFetch, App.parseCoffeeShops);
    }

    /**
     * @returns {App.fetchAPIToken}
     */
    fetchCoffeeShopAPIToken() {
        const { host, tokenPath } = this.config;
        const httpFetch = this.httpFetch();
        return App.fetchCoffeeShopAPITokenFactory(host, tokenPath, httpFetch);
    }

    /**
     * @template T
     * @returns {IO.httpFetch<T>}
     */
    httpFetch() {
        return IO.httpFetchFactory(
            https,
            IO.resolveJsonResponseFactory,
            IO.resolveJsonRequestOptions
        );
    }
}