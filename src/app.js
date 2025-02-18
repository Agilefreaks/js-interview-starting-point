/**
 * Main application logic for finding the nearest coffee shops.
 *
 * Functions:
 * - `getNearestShops`: Retrieves and sorts coffee shops based on a given location.
 *
 * Features:
 * - Fetches coffee shop data from the API.
 * - Computes distances and returns the closest shops.
 * - Handles edge cases like no available shops.
 */


import { calculateDistance } from "./utils/calculateDistance.js";
import { validateCoordinates } from "./utils/validateCoordinates.js";
import { fetchCoffeeShops } from "./api.js";

/**
 * @param {Object} position
 * @param {Number} position.x
 * @param {Number} position.y
 * 
 * @returns {Array<position>}
 */

export function getPositionFromCLI() {
  let position;
  let error = 'Please provide valid numbers!';
  try {
    position = validateCoordinates(process.argv[2], process.argv[3], error);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
  return position;
}

export async function getNearestShops() {
  let position;

  // Handle invalid CLI arguments
  try {
    position = getPositionFromCLI();
  } catch (error) {
    return;
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
      distance: calculateDistance(position.x, position.y, shop.x, shop.y)
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
