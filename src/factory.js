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
     * @return {module:app.getNearestShops}
     */
    nearestCoffeeShops() {
        const fetchShops = this.fetchCoffeeShopList();
        const shopDistanceTo = this.shopDistanceTo();
        const distanceAsc = this.distanceAsc();

        return App.nearestShopsFactory(fetchShops, shopDistanceTo, distanceAsc);
    }

    /**
     * @return {module:app.fetchShopList}
     */
    fetchCoffeeShopList() {
        const fetchCoffeeShopAPIToken = this.fetchCoffeeShopAPIToken();
        const fetchCoffeeShops = this.fetchCoffeeShops();

        return App.fetchShopListFactory(fetchCoffeeShopAPIToken, fetchCoffeeShops);
    }

    /**
     * @return {module:app.fetchCoffeeShops}
     */
    fetchCoffeeShops() {
        const { host, coffeeShopsPath } = this.config;
        const httpFetch = this.httpFetch();
        return App.fetchCoffeeShopsFactory(host, coffeeShopsPath, httpFetch);
    }

    /**
     * @return {module:coffeeShop.shopDistanceTo}
     */
    shopDistanceTo() {
        return CoffeeShop.shopDistanceTo;
    }

    /**
     * @return {module:coffeeShop.distanceAsc}
     */
    distanceAsc() {
        return CoffeeShop.distanceAsc;
    }

    /**
     * @return {module:app.fetchCoffeeShopAPIToken}
     */
    fetchCoffeeShopAPIToken() {
        const { host, tokenPath } = this.config;
        const httpFetch = this.httpFetch();
        return App.fetchCoffeeShopAPITokenFactory(host, tokenPath, httpFetch);
    }

    /**
     * @return {module:IO.httpFetch}
     */
    httpFetch() {
        return IO.httpFetchFactory(this.https(), this.resolveJsonResponse());
    }

    /**
     * @return {external:https}
     */
    https() {
        return https;
    }

    /**
     * @return {module.IO.resolveJsonResponseFactory}
     */
    resolveJsonResponse() {
        return IO.resolveJsonResponseFactory;
    }

}