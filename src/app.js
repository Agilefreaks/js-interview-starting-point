import { getCoffeeShops } from './api.js';
import {
  calculateDistance,
  findNearestShops,
  getLowestThreeIndices,
  validatePosition
} from './utils.js';

/**
 * @param {Object} position
 * @param {Number} position.x
 * @param {Number} position.y
 *
 * @returns {Array<position>}
 */
export async function getNearestShops(position) {
  try {
    const validatedPosition = validatePosition(position);
    const coffeeShops = await getCoffeeShops();

    const closestThreeShops = findNearestShops(coffeeShops, validatedPosition);

    closestThreeShops.forEach((shop) => {
      console.log(`${shop.name}, ${shop.distance.toFixed(4)}`);
    });

    return closestThreeShops;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}
