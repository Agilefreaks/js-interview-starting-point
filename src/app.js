import { AsyncList } from './asyncList.js';
import { CoffeeShop } from './coffeeShop.js';

/**
 * @typedef {object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * @callback getNearestShops
 * @param {Point} position
 * @param {number} numberOfShopsToReturn
 * @returns {Promise<Array<import('./coffeeShop.js').ShopDistance>>}
 */

/**
 * @param {fetchShopList} fetchShops
 * @param {import("./coffeeShop.js").shopDistanceTo} shopDistanceTo
 * @param {import("./coffeeShop").distanceAsc} distanceAsc
 * @returns {getNearestShops}
 */
export function nearestShopsFactory(fetchShops, shopDistanceTo, distanceAsc) {
    return (position, numberOfShopsToReturn) => fetchShops()
        .map(shopDistanceTo(position))
        .sort(distanceAsc)
        .take(numberOfShopsToReturn);
}

/**
 * @callback fetchShopList
 * @returns {import('./asyncList.js').AsyncList}
 */

/**
 * @param {fetchAPIToken} fetchAPIToken
 * @param {fetchCoffeeShops} fetchShops
 * @returns {fetchShopList}
 */
export function fetchShopListFactory(fetchAPIToken, fetchShops) {
    return () => new AsyncList(fetchAPIToken().then(fetchShops));
}

/**
 * @callback fetchAPIToken
 * @returns {Promise<string>}
 */

/**
 * @param {string} host
 * @param {string} path
 * @param {import("./io.js").httpFetch<{token?: string}>} httpFetch
 * @return {fetchAPIToken}
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
 * @callback fetchCoffeeShops
 * @param {string} token
 * @return {Promise<import('./coffeeShop.js').CoffeeShop[]>}
 */

/**
 * @typedef {object} RawShopData
 * @property {string} [name]
 * @property {string} [x]
 * @property {string} [y]
 */

/**
 * @param {string} host
 * @param {string} path
 * @param {import('./io.js').httpFetch<Array<RawShopData>>} httpFetch
 * @param {parseCoffeeShops} parseData
 * @return {fetchCoffeeShops}
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
 * @param {Array<RawShopData>} list
 * @returns {Array<import('./coffeeShop').CoffeeShop>|Promise}
 */
export function parseCoffeeShops(list) {
    if (!Array.isArray(list)) {
        return Promise.reject(new Error('Invalid coffee shop data'));
    }
    const result = [];
    const success = list.every(item => {
        if (typeof item.name !== 'string') return false;
        const x = parseFloat(item.x)
        const y = parseFloat(item.y)
        if (Number.isNaN(x)) return false;
        if (Number.isNaN(y)) return false;

        result.push(new CoffeeShop(item.name, x, y));

        return true;
    });

    if (!success) {
        return Promise.reject(new Error('Invalid coffee shop data'));
    }

    return result;
}