import { getCoffeeShops } from './api.js';
import {
    calculateDistance,
    getLowestThreeIndices,
    validatePosition,
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

        if (!Array.isArray(coffeeShops)) {
            throw new Error('Invalid data returned by API.');
        }

        const distances = coffeeShops.map(shop => ({
            name: shop.name
            distance: calculateDistance(
                { x: shop.x, y: shop.y },
                validatedPosition,
            )
        });

        const closestThreeShops = getLowestThreeIndices(distances);

        closestThreeShops.forEach(shop => {
            console.log(`${shop.name}, ${shop.distance.toFixed(4)}`);
        });

        return closestThreeShops;
    } catch (error) {
        console.error(error.message);
        return [];
    }
}
