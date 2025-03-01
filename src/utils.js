export function findNearestShops(coffeeShops, positions, firstXShops = 3) {
  if (!Array.isArray(coffeeShops)) {
    throw new Error('Invalid data returned by API.');
  }

  const distances = coffeeShops.map((shop) => ({
    name: shop.name,
    distance: calculateDistance({ x: shop.x, y: shop.y }, positions)
  }));

  return getClosestIndices(distances, firstXShops);
}

export function calculateDistance(point1, point2) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function validatePosition({ x, y }) {
  const numX = Number(x);
  const numY = Number(y);

  if (isNaN(numX) || isNaN(numY)) {
    throw new Error(
      'Invalid arguments, please add valid numbers as coordinates.'
    );
  }

  return { x: numX, y: numY };
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getClosestIndices(arr, firstXShops) {
  return arr.sort((a, b) => a.distance - b.distance).slice(0, firstXShops);
}
