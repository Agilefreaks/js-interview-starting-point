import { calculateDistance } from "./utils.js";

/**
 * @param {Object} position
 * @param {Number} position.x
 * @param {Number} position.y
 *
 * @returns {Promise<Array<Object>>}
 */

async function createToken(baseUrl) {
  try {
    const tokenResponse = await fetch(`${baseUrl}/v1/tokens`, {
      method: "POST",
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(
        `Token reuqest failed with status ${tokenResponse.status}: ${errorText}`
      );
    }

    const tokenData = await tokenResponse.json();
    return tokenData.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
}

async function fetchCoffeeShops(baseUrl, token) {
  const maxRetries = 3;
  let retryCount = 0;

  async function makeRequest() {
    try {
      const coffeeShopsResponse = await fetch(
        `${baseUrl}/v1/coffee_shops?token=${token}`
      );

      if (!coffeeShopsResponse.ok) {
        if (coffeeShopsResponse.status === 401) {
          console.error("Authorization error. Please check your token.");
          return null;
        } else if (coffeeShopsResponse.status === 406) {
          console.error("Format error. Please check the Accept header.");
          return null;
        } else if (
          coffeeShopsResponse.status === 503 ||
          coffeeShopsResponse.status === 504
        ) {
          if (retryCount < maxRetries) {
            retryCount++;
            console.warn(
              `Service unavailable or timeout. Retrying (attempt ${retryCount})...`
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return makeRequest();
          } else {
            console.error(
              `Max retries reached. Service unavailable or timeout.`
            );
            return null;
          }
        } else {
          const errorText = await coffeeShopsResponse.text();
          throw new Error(
            `Coffee shops request failed with status ${coffeeShopsResponse.status}: ${errorText}`
          );
        }
      }

      const shopsData = await coffeeShopsResponse.json();
      return shopsData;
    } catch (error) {
      console.error("Error fetching coffee shops:", error);
      return [];
    }
  }
  return makeRequest();
}

export async function getNearestShops(position) {
  const baseUrl = "https://api-challenge.agilefreaks.com";

  const token = await createToken(baseUrl);
  if (!token) {
    return;
  }

  const shopsData = await fetchCoffeeShops(baseUrl, token);
  if (!shopsData || shopsData.length === 0) {
    return;
  }

  return shopsData
    .map((shop) => {
      const distance = calculateDistance(
        position.x,
        position.y,
        parseFloat(shop.x),
        parseFloat(shop.y)
      );
      return { ...shop, distance };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map((shop) => ({
      name: shop.name,
      distance: shop.distance.toFixed(4),
    }));
}
