/**
 * @module coffeeShop
 */

/**
 */
export class CoffeeShop {
    /**
     * @constructor
     * @param {string} name
     * @param {number} x
     * @param {number} y
     */
    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
    }
}

/**
 * @typedef module:coffeeShop.calculateDistance
 * @type {function}
 * @param {CoffeeShop} shop
 * @return {{position: module:app.Point, shop: module:coffeeShop.CoffeeShop, distance: number}}
 */

/**
 *
 * @param {module:app.Point} point
 * @return {module:coffeeShop.calculateDistance}
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
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
export function distanceAsc(a, b) {
    return a.distance - b.distance;
}

/**
 * @param {function} printFn
 * @param {{position: module:app.Point, shop: CoffeeShop, distance: number}} list
 * @returns {void}
 */
export function printNearestShops(printFn, list) {
    list.forEach(element => {
        printFn(`${element.shop.name}, ${element.distance.toFixed(4)}`);
    });
}