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
        const fetchShops = this.fetchCoffeeShopList();
        const shopDistanceTo = this.shopDistanceTo();
        const distanceAsc = this.distanceAsc();

        return App.nearestShopsFactory(fetchShops, shopDistanceTo, distanceAsc);
    }

    /**
     * @returns {App.fetchShopList}
     */
    fetchCoffeeShopList() {
        const fetchCoffeeShopAPIToken = this.fetchCoffeeShopAPIToken();
        const fetchCoffeeShops = this.fetchCoffeeShops();

        return App.fetchShopListFactory(fetchCoffeeShopAPIToken, fetchCoffeeShops);
    }

    /**
     * @returns {App.fetchCoffeeShops}
     */
    fetchCoffeeShops() {
        const { host, coffeeShopsPath } = this.config;
        const httpFetch = this.httpFetch();
        const parseCoffeeShops = this.parseCoffeeShops()
        return App.fetchCoffeeShopsFactory(host, coffeeShopsPath, httpFetch, parseCoffeeShops);
    }

    parseCoffeeShops() {
        return App.parseCoffeeShops
    }

    shopDistanceTo() {
        return CoffeeShop.shopDistanceTo;
    }

    distanceAsc() {
        return CoffeeShop.distanceAsc;
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
        const resolveRequestOptions = this.resolveJsonRequestOptions()
        const resolveResponse = this.resolveJsonResponse()
        return IO.httpFetchFactory(this.https(), resolveResponse, resolveRequestOptions);
    }

    resolveJsonRequestOptions() {
        return IO.resolveJsonRequestOptions;
    }

    https() {
        return https;
    }

    resolveJsonResponse() {
        return IO.resolveJsonResponseFactory;
    }

}