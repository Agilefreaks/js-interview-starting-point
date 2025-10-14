import {
  getCoffeeShopsService,
  getClosestCoffeeShopsWithDistance,
} from '#services/coffee-shops.service'

describe('Coffee Shops Integration', () => {
  describe('getCoffeeShopsService', () => {
    it('should return a list of coffee shops', async () => {
      const coffeeShops = await getCoffeeShopsService()

      expect(Array.isArray(coffeeShops)).toBe(true)
      expect(coffeeShops.length).toBeGreaterThan(0)
      expect(coffeeShops[0]).toHaveProperty('id')
      expect(coffeeShops[0]).toHaveProperty('name')
      expect(coffeeShops[0]).toHaveProperty('x')
      expect(coffeeShops[0]).toHaveProperty('y')
    })
  })

  describe('getClosestCoffeeShopsWithDistance', () => {
    it('should return a list of 3 coffee shops with distances', async () => {
      const coffeeShops = await getClosestCoffeeShopsWithDistance({
        position: { x: 47.6, y: -122.4 },
      })

      expect(Array.isArray(coffeeShops)).toBe(true)
      expect(coffeeShops.length).toBe(3)

      expect(coffeeShops[0]).toHaveProperty('name')
      expect(coffeeShops[0]).toHaveProperty('distance')
    })

    it('should return an empty array if an invalid position is used', async () => {
      const coffeeShops = await getClosestCoffeeShopsWithDistance({
        position: { x: 'invalid', y: -122.4 },
      })

      expect(Array.isArray(coffeeShops)).toBe(true)
      expect(coffeeShops.length).toBe(0)
    })
  })
})
