import { getTokenRepository } from '#repositories/tokens.repository'

let CACHED_TOKEN = ''

export const refreshTokenService = async () => {
  const { token } = await getTokenRepository()
  CACHED_TOKEN = token
  return token
}

export const getTokenService = async () => {
  if (CACHED_TOKEN) {
    // use cached token if it exists
    return CACHED_TOKEN
  }

  return refreshTokenService()
}
