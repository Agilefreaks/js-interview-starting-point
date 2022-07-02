import fetch from "node-fetch";

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
      Accept: "application/json"
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
  // Get token
  let token = await fetchToken();

  // Get coffee shops list
  let coffeeShopsData;
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
    .then((response) => response.json())
    .then((json) => (coffeeShopsData = json));

  return [];
}
