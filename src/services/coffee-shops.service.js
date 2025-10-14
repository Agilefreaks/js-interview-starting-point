import { getCoffeeShopsRepository } from '#repositories/coffee-shops.repository'
import { getTokenService, refreshTokenService } from '#services/tokens.service'
import { getSquaredEuclideanDistance } from '#utils/distance.utils'

export const getCoffeeShopsService = async () => {
  try {
    const token = await getTokenService()

    return await getCoffeeShopsRepository(token)
  } catch (e) {
    if (e.status === 401) {
      // if unauthorized error, refresh the token and retry the operation
      const newToken = await refreshTokenService()
      return getCoffeeShopsRepository(newToken)
    }

    throw e
  }
}

export const getClosestCoffeeShopsWithDistance = async ({
  position,
  limit = 3,
}) => {
  try {
    const coffeeShops = await getCoffeeShopsService()

    // First augment the coffee shops with the squared euclidean distance
    const coffeeShopsWithSquaredDistance = coffeeShops.map((coffeeShop) => ({
      ...coffeeShop,
      squaredDistance: getSquaredEuclideanDistance(position, coffeeShop),
    }))

    // We use the squaredDistance for sorting, since it is slower to calculate the square root
    const orderedCoffeeShops = coffeeShopsWithSquaredDistance.sort(
      (coffeeShopA, coffeeShopB) =>
        coffeeShopA.squaredDistance - coffeeShopB.squaredDistance
    )

    // only get the first {limit} coffee shops, and calculate the distance for them
    return orderedCoffeeShops
      .slice(0, limit)
      .map(({ squaredDistance, ...coffeeShop }) => ({
        ...coffeeShop,
        distance: Math.sqrt(squaredDistance).toFixed(4),
      }))
  } catch (e) {
    return []
  }
}
