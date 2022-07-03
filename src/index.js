import { getNearestShops } from "./app.js";
import { ERROR_TOKEN } from "./utils.js";

// Get command arguments
const args = process.argv.slice(2);
const position = { x: args[1], y: args[2] };
const shops = await getNearestShops(position);

if (shops[0] == ERROR_TOKEN) {
  console.log("Operation failed. Error Code: " + shops[1]);
  process.exit();
}

// Log the 3 closest coffee shops
shops.forEach(function (coffeeShop) {
  console.log(coffeeShop.name + ", " + coffeeShop.delta);
});
