import { AsyncList } from './asyncList.js';
import { CoffeeShop } from './coffeeShop.js';

/** @module app */

/**
 * @typedef module:app.Point
 * @type {Object}
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef module:app.getNearestShops
 * @type {function}
 * @param {module:app.Point} position
 * @param {number} numberOfShopsToReturn
 *
 * @returns {Promise<Array<{position: module:app.Point, shop: module:coffeeShop.CoffeeShop, distance: number}>>}
 */

/**
 * @param {module:app.fetchShopList} fetchCoffeeShops
 * @param {module:coffeeShop.shopDistanceTo} fetchCoffeeShops
 * @param {module:coffeeShop.distanceAsc} distanceAsc
 *
 * @returns {module:app.getNearestShops}
 */
export function nearestShopsFactory(fetchCoffeeShops, shopDistanceTo, distanceAsc) {
    return (position, numberOfShopsToReturn) => fetchCoffeeShops()
        .map(shopDistanceTo(position))
        .sort(distanceAsc)
        .take(numberOfShopsToReturn);
}

/**
 * @typedef module:app.fetchShopList
 * @type {function}
 * @returns {module:asyncList.AsyncList}
 */

/**
 * @param {module:app.fetchCoffeeShopAPIToken} fetchCoffeeShopAPIToken
 * @param {module:app.fetchCoffeeShops} fetchShops
 * @returns {module:app.fetchShopList}
 */
export function fetchShopListFactory(fetchCoffeeShopAPIToken, fetchShops) {
    return () => new AsyncList(fetchCoffeeShopAPIToken().then(fetchShops));
}

/**
 * @typedef module:app.fetchCoffeeShopAPIToken
 * @type {function}
 * @returns {Promise<string>}
 */

/**
 * @param {string} host
 * @param {string} path
 * @param {module:IO.httpFetch} httpFetch
 * @return {module:app.fetchCoffeeShopAPIToken}
 */
export function fetchCoffeeShopAPITokenFactory(host, path, httpFetch) {
    const ERROR_PREFIX = 'Fetch Token';
    return () => {
        const options = {
            host: host,
            path: path,
            method: 'POST'
        };

        return httpFetch(ERROR_PREFIX, options).then(data => {
            if (data.token === undefined) {
                return Promise.reject(new Error(ERROR_PREFIX + ': no token found in response'));
            }
            return data.token;
        });
    };
}

/**
 *
 * @typedef module:app.fetchCoffeeShops
 * @type {function}
 * @param {string} token
 * @return {Promise<module:coffeeShop.CoffeeShop[]>}
 */

/**
 * @param {string} host
 * @param {string} path
 * @param {module:IO.httpFetch} httpFetch
 * @param {module:app.parseCoffeeShops} parseData
 * @return {module:app.fetchCoffeeShops}
 */
export function fetchCoffeeShopsFactory(host, path, httpFetch, parseData) {
    const ERROR_PREFIX = 'Fetch coffee-shops';
    return (token) => {
        const searchParams = new URLSearchParams({ token: token });
        const options = {
            host: host,
            path: path + '?' + searchParams.toString(),
        };
        return httpFetch(ERROR_PREFIX, options).then(parseData);
    };
}

/**
 * @param {Array<{name: string, x: number, y: number}>} list
 * @returns {Array<module:coffeeShop.CoffeeShop>|Promise}
 */
export function parseCoffeeShops(list) {
    if (!Array.isArray(list)) {
        return Promise.reject(new Error('Invalid coffee shop data'));
    }
    const result = [];
    const success = list.every(item => {
        if (typeof item.name !== 'string') return false;
        if (typeof item.x !== 'number') return false;
        if (typeof item.y !== 'number') return false;

        result.push(new CoffeeShop(item.name, item.x, item.y));

        return true;
    });

    if (!success) {
        return Promise.reject(new Error('Invalid coffee shop data'));
    }

    return result;
}