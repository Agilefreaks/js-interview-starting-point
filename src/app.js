import { calculateDistance } from './utils.js';
import { fetchCoffeeShops } from './api.js';
/**
 * @param {Object} position
 * @param {Number} position.x
 * @param {Number} position.y
 * 
 * @returns {Array<position>}
 */
export async function getNearestShops(position) {
  const distanceToShop = calculateDistance(0, 0, position.x, position.y);
  console.log(distanceToShop);
  const coffeeShops = await fetchCoffeeShops();
  console.log(distanceToShop, coffeeShops);
  return [];
}
