import { getClosestCoffeeShopsWithDistance } from '#services/coffee-shops.service'

/**
 * @param {Object} position
 * @param {Number} position.x
 * @param {Number} position.y
 *
 * @returns {Array<position>}
 */
export async function getNearestShops(position) {
  // code
  const result = await getClosestCoffeeShopsWithDistance({ position })

  result.forEach((item) => {
    console.log(item.name, item.distance)
  })

  return result
}
