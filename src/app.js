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
        validatePosition(position);
        const coffeeShops = await getCoffeeShops();
        const distances = [];

        if (!Array.isArray(coffeeShops)) {
            throw new Error('Invalid data returned by API.');
        }
        coffeeShops.forEach((shop, i) => {
            const distance = calculateDistance(
                { x: shop.x, y: shop.y },
                { x: position.x, y: position.y },
            );
            distances.push({ name: shop.name, distance: distance });
        });

        const closestThreeShops = getLowestThreeIndices(distances);

        closestThreeShops.map(shop => {
            console.log(`${shop.name}, ${shop.distance}`);
        });
    } catch (error) {
        console.error(error.message);
        return;
    }

    return;
}
