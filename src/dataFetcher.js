import fetch from "node-fetch";

/** @const {String} TOKEN_URL url for fetching the token */
const TOKEN_URL = "https://blue-bottle-api-test.herokuapp.com/v1/tokens";

/** @const {String} COFFEE_SHOPS_URL url for fetching the coffee shops */
const COFFEE_SHOPS_URL =
  "https://blue-bottle-api-test.herokuapp.com/v1/coffee_shops?";

/**
 * Fetch the coffee shops list
 *
 * @returns {Array[]} an array containing the json coffee shops list and the response code
 */
export default async function fetchCoffeeShops() {
  let responseCode;

  // Fetch the token
  let response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const token = data.token;

      // Chain the token fetch with the coffee shops list fetch
      return fetch(
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
      ).then((response) => {
        responseCode = response.status;
        return response.json();
      });
    });

  return [response, responseCode];
}
