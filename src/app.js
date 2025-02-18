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
  try {
    const coffeeShopsResponse = await fetch(
      `${baseUrl}/v1/coffee_shops?token=${token}`
    );

    if (!coffeeShopsResponse.ok) {
      const errorText = await coffeeShopsResponse.text();
      throw new Error(
        `Coffee shops reuqest failed with status ${coffeeShopsResponse.status}: ${errorText}`
      );
    }

    const shopsData = await coffeeShopsResponse.json();
    return shopsData;
  } catch (error) {
    console.error("Error fetching coffee shops:", error);
    return [];
  }
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

  const coffeeShops = shopsData.map((shop) => {
    const distance = calculateDistance(
      position.x,
      position.y,
      parseFloat(shop.x),
      parseFloat(shop.y)
    );
    return { ...shop, distance };
  });

  coffeeShops.sort((a, b) => a.distance - b.distance);

  const closestCoffeShops = coffeeShops.slice(0, 3);

  return closestCoffeShops.map((shop) => ({
    name: shop.name,
    distance: shop.distance.toFixed(4),
  }));
}
