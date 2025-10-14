import config from '#config/api.config'
import { httpRequest } from '#utils/http.utils'
import { getCoffeeShopsRepository } from '#repositories/coffee-shops.repository'

jest.mock('#utils/http.utils')

describe('Coffee Shop Repository', () => {
  describe('getCoffeeShopsRepository', () => {
    const token = 'test-token'

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should call httpRequest with the correct url', async () => {
      httpRequest.mockResolvedValue([])

      await getCoffeeShopsRepository(token)

      expect(httpRequest).toHaveBeenCalledTimes(1)
      expect(httpRequest).toHaveBeenCalledWith(
        `${config.API_URL}/v1/coffee_shops?token=${token}`
      )
    })
  })
})
