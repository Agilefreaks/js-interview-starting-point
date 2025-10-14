import { getNearestShops } from '../../src/app'

describe('App', () => {
  it('should return an array when the input is valid', async () => {
    await expect(
      Array.isArray(
        await getNearestShops({
          x: 0,
          y: 0,
        })
      )
    ).toBe(true)
  })
})
