import { getCoffeeShops } from './api.js';
import { validatePosition } from './utils.js';

/**
 * @param {Object} position
 * @param {Number} position.x
 * @param {Number} position.y
 *
 * @returns {Array<position>}
 */
export async function getNearestShops(position) {
    validatePosition(position);

    const coffeeShops = await getCoffeeShops();

    return [];
}
