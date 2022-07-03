import errorCodes from "./errorcodes.js";
import fetch from "node-fetch";
import SortedDeltaCoffeeShopList from "./sortedDeltaCoffeeShopList.js";

// Token URLs
const TOKEN_URL = "https://blue-bottle-api-test.herokuapp.com/v1/tokens";
const COFFEE_SHOPS_URL =
  "https://blue-bottle-api-test.herokuapp.com/v1/coffee_shops?";

/**
 *
 * @returns {String} token
 */
async function fetchToken() {
  return fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => data.token)
    .catch((error) => {
      console.log("Error while fetching the token", error);
    });
}

/**
 * @param {Object} position
 * @param {Number} position.x
 * @param {Number} position.y
 *
 * @returns {Array<position>}
 */
export async function getNearestShops(position) {
  // Check if we received numbers as arguments
  if (isNaN(position.x) || isNaN(position.y)) {
    console.log("Invalid input: numbers expected");
    return [errorCodes.INVALID_INPUT_ARGS_NAN];
  }

  // Get token
  let token = await fetchToken();

  // Get coffee shops list
  let coffeeShops;
  let resposeCode;
  await fetch(
    COFFEE_SHOPS_URL +
      new URLSearchParams({
        token: token,
      }),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  )
    .then((response) => {
      resposeCode = response.status;
      return response.json();
    })
    .then((json) => (coffeeShops = json));

  // Create a sorted coffee shop list, relative to our position
  let sortedDeltaCoffeShopList = new SortedDeltaCoffeeShopList(
    coffeeShops,
    position.x,
    position.y
  );

  // Get the closest 3 coffee shops
  const closestCoffeeShops = sortedDeltaCoffeShopList.getNClosestCoffeShops(3);

  // Log the 3 closest coffee shops
  closestCoffeeShops.forEach(function (coffeeShop) {
    console.log(coffeeShop.name + ", " + coffeeShop.delta);
  });

  return closestCoffeeShops;
}
