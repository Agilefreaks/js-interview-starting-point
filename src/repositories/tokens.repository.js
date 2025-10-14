import config from '#config/api.config'
import { httpRequest } from '#utils/http.utils'

export const getTokenRepository = async () => {
  return httpRequest(`${config.API_URL}/v1/tokens`, {
    method: 'POST',
  })
}
