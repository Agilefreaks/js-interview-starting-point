/**
 * @typedef {object} ShopDistance
 * @property {import('./app.js').Point} point
 * @property {import('./coffeeShop').CoffeeShop} shop
 * @property {number} distance
 */

/**
 * @callback calculateDistance
 * @param {CoffeeShop} shop
 * @returns {ShopDistance}
 */


export class CoffeeShop {
    /**
     * @constructor
     * @param {string} name
     * @param {number} x
     * @param {number} y
     */
    constructor(name, x, y) {

        /** @property {string} */
        this.name = name;

        /** @property {number} */
        this.x = x;

        /** @property {number} */
        this.y = y;
    }
}


/**
 * @param {import("./app.js").Point} point origin for calculating distance from
 * @returns {calculateDistance}
 */
export function shopDistanceTo(point) {
    return (shop) => {
        return {
            point: point,
            shop: shop,
            distance: Math.sqrt(
                Math.pow(point.x - shop.x, 2) + Math.pow(point.y - shop.y, 2)
            )
        };
    };
}

/**
 * @param {{distance:number}} a
 * @param {{distance:number}} b
 * @returns {number}
 */
export function distanceAsc(a, b) {
    return a.distance - b.distance;
}

/**
 * @param {function} printFn
 * @param {Array<ShopDistance>} list
 * @returns {void}
 */
export function printNearestShops(printFn, list) {
    list.forEach(element => {
        printFn(`${element.shop.name}, ${element.distance.toFixed(4)}`);
    });
}