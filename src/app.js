import axios from "axios";
import distance from "euclidean-distance";

// Get the API token
async function getToken() {
  let token;
  try {
    const response = await axios.post(
      "https://blue-bottle-api-test.herokuapp.com/v1/tokens",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    token = response.data.token;
  } catch (e) {
    console.error(`Exception occurred while fetching the token: ${e}`);
  }
  return token;
}

// Get all shop data from the API
async function getShopData() {
  const token = await getToken();

  try {
    const response = await axios.get(
      `https://blue-bottle-api-test.herokuapp.com/v1/coffee_shops?token=${token}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (e) {
    if (e.response.status == 401 || 406 || 503 || 504) {
      console.error(`Exception occurred while fetching shop list : ${e}`);
      return [];
    }
  }
}

/**
 * @param {Object} position
 * @param {Number} position.x
 * @param {Number} position.y
 *
 * @returns {Array<position>}
 */

// Calculate distance of each shop from the given coordinate
export default async function getNearestShops(position) {
  const shopData = await getShopData();

  if (shopData.length > 0) {
    let distancelist = [];

    shopData.forEach((shop) => {
      const calculatedDistance = distance(
        [position.x, position.y],
        [shop.x, shop.y]
      );

      const shopDistance = {
        // Round distances to four decimal places
        distance: calculatedDistance.toFixed(4),
        shop: shop.name,
      };

      distancelist.push(shopDistance);
    });

    // Sort distanceList by distance
    distancelist.sort((a, b) => a.distance - b.distance);

    // Return the closest 3 shops
    let results = distancelist.slice(0, 3);
    return results;
  } else {
    console.error(
      "The shop list has not been loaded due to an error. Please try again later."
    );
    return [];
  }
}
