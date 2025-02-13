import { calculateDistance } from "./utils.js";
import { fetchCoffeeShops } from "./api.js";

/**
 * @param {Object} position
 * @param {Number} position.x
 * @param {Number} position.y
 * 
 * @returns {Array<position>}
 */

function getPositionFromCMD() {
  // Ensure the input is valid before passing to getNearestShops
    const x = parseFloat(process.argv[2]);
    const y = parseFloat(process.argv[3]);

    if (isNaN(x) || isNaN(y)) {
      throw new Error('Invalid coordinates');
    }

    return { x, y };
}

export async function getNearestShops() {
  let position;
  try {
    position = getPositionFromCMD();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  const coffeeShops = await fetchCoffeeShops();
  
  // Process and calculate distance for each shop efficiently
  const nearestShops = coffeeShops
    .map(shop => ({
      id: shop.id, 
      name: shop.name, 
      distance: calculateDistance(position.x, position.y, parseFloat(shop.x), parseFloat(shop.y))
    }))
    .sort((a, b) => a.distance - b.distance) // Sort by distance

  // Get only the top 3 nearest shops
  const topThreeShops = nearestShops.slice(0, 3);

  // Display results with rounded distance
  return displayResult(topThreeShops);
}

function displayResult(topThreeShops) {
  topThreeShops.forEach((shop) => {
    console.log(`${shop.name}, ${shop.distance}`);
  });
}
