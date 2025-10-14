jest.mock('#repositories/tokens.repository')

describe('Tokens Service', () => {
  const mockData = {
    token: 'test-token',
  }

  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('refreshTokenService', () => {
    it('should retrieve the token', async () => {
      const { refreshTokenService } = await import('#services/tokens.service')
      const { getTokenRepository } = await import(
        '#repositories/tokens.repository'
      )

      getTokenRepository.mockResolvedValue(mockData)

      const token = await refreshTokenService()

      expect(getTokenRepository).toHaveBeenCalledTimes(1)
      expect(token).toEqual(mockData.token)
    })
  })

  describe('getTokenService', () => {
    afterEach(() => {
      jest.resetModules()
      jest.clearAllMocks()
    })

    it('should return the cached token if available', async () => {
      const { getTokenService, refreshTokenService } = await import(
        '#services/tokens.service'
      )
      const { getTokenRepository } = await import(
        '#repositories/tokens.repository'
      )

      getTokenRepository.mockResolvedValue(mockData)

      await refreshTokenService()
      const token = await getTokenService()

      expect(getTokenRepository).toHaveBeenCalledTimes(1)
      expect(token).toEqual(mockData.token)
    })

    it('should get the token', async () => {
      const { getTokenService } = await import('#services/tokens.service')
      const { getTokenRepository } = await import(
        '#repositories/tokens.repository'
      )

      getTokenRepository.mockResolvedValue(mockData)

      const token = await getTokenService()

      expect(getTokenRepository).toHaveBeenCalledTimes(1)
      expect(token).toEqual(mockData.token)
    })
  })
})
