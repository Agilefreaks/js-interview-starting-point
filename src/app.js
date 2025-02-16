import { calculateDistance } from "./utils.js";
import { fetchCoffeeShops } from "./api.js";

/**
 * @param {Object} position
 * @param {Number} position.x
 * @param {Number} position.y
 * 
 * @returns {Array<position>}
 */

export function getPositionFromCLI() {
  // Ensure the input is valid before passing to getNearestShops
  const x = parseFloat(process.argv[2]);
  const y = parseFloat(process.argv[3]);

  if (isNaN(x) || isNaN(y)) {
    throw new Error('Invalid coordinates. Please provide valid numbers!');
  }

  return { x, y };
}

export async function getNearestShops() {
  let position;

  // Handle invalid CLI arguments
  try {
    position = getPositionFromCLI();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  let coffeeShops = [];
  try {
    coffeeShops = await fetchCoffeeShops();
    if (!Array.isArray(coffeeShops)) {
      throw new Error("Coffee shops data is not valid");
    }
  } catch (error) {
    console.error("Failed to fetch coffee shops:", error.message);
    process.exit(1);
  }
  
  // Calculate distances, sort by nearest first, and take the top 3 results
  const nearestShops = coffeeShops
    .map(shop => ({
      id: shop.id, 
      name: shop.name, 
      distance: calculateDistance(position.x, position.y, parseFloat(shop.x), parseFloat(shop.y))
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  // Display results
  displayResult(nearestShops);
}

function displayResult(topThreeShops) {
  // Display result based on number of coffee shops found
  if (topThreeShops.length === 0) {
    console.log("No coffee shops found nearby.");
  } else {
    topThreeShops.forEach((shop) => {
      console.log(`${shop.name}, ${shop.distance}`);
    });
  }
}
