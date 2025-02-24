import { getCoffeeShops } from './api.js';

/**
 * @param {Object} position
 * @param {Number} position.x
 * @param {Number} position.y
 *
 * @returns {Array<position>}
 */
export async function getNearestShops(position) {
    const coffeeShops = await getCoffeeShops();
    console.log(coffeeShops);
    return [];
}
