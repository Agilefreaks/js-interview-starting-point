import { httpRequest, HttpError } from '#utils/http.utils.js'
import { mocks } from './mocks.js'

describe('HTTP utils', () => {
  describe('httpRequest', () => {
    const mockFetch = jest.fn()
    const originalFetch = global.fetch
    const url = 'https://api.example.com'

    beforeEach(() => {
      global.fetch = mockFetch
    })

    afterEach(() => {
      global.fetch = originalFetch
      jest.clearAllMocks()
    })

    it('should return json content when content-type is application/json', async () => {
      const mockData = { success: true }
      const jsonMock = jest.fn().mockResolvedValue(mockData)

      const responseMock = mocks.getHttpSuccessJsonReponse()
      responseMock.json = jsonMock
      mockFetch.mockResolvedValue(responseMock)

      const result = await httpRequest(url)
      expect(result).toEqual(mockData)

      expect(jsonMock).toHaveBeenCalledTimes(1)

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith(url, {})
    })

    it('should return text content when content-type is not application/json', async () => {
      const mockData = 'success'
      const textMock = jest.fn().mockResolvedValue(mockData)

      const responseMock = mocks.getHttpSuccessTextReponse()
      responseMock.text = textMock
      mockFetch.mockResolvedValue(responseMock)

      const result = await httpRequest('https://api.example.com')
      expect(result).toEqual(mockData)

      expect(textMock).toHaveBeenCalledTimes(1)

      expect(global.fetch).toHaveBeenCalledTimes(1)
      expect(global.fetch).toHaveBeenCalledWith(url, {})
    })

    it('should call fetch with the correct url and params', async () => {
      mockFetch.mockResolvedValue(mocks.getHttpSuccessJsonReponse())

      await httpRequest(url, { method: 'POST' })

      expect(global.fetch).toHaveBeenCalledWith(url, { method: 'POST' })
    })

    it('should throw HttpError for client errors without retries', async () => {
      const mockData = 'Unauthorized'
      const textMock = jest.fn().mockResolvedValue(mockData)

      const responseMock = mocks.getHttp401ErrorResponse()
      responseMock.text = textMock
      mockFetch.mockResolvedValue(responseMock)

      const requestPromise = httpRequest(url)

      await expect(requestPromise).rejects.toThrow(HttpError)
      await expect(requestPromise).rejects.toMatchObject({
        status: 401,
        message: mockData,
      })

      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should retry the request for server errors and return a success result', async () => {
      const mockDataSuccess = { success: true }
      const jsonMockSuccess = jest.fn().mockResolvedValue(mockDataSuccess)

      const errorResponseMock = mocks.getHttp503ErrorResponse()

      const successResponseMock = mocks.getHttpSuccessJsonReponse()
      successResponseMock.json = jsonMockSuccess

      mockFetch.mockResolvedValueOnce(errorResponseMock)
      mockFetch.mockResolvedValueOnce(errorResponseMock)
      mockFetch.mockResolvedValueOnce(successResponseMock)

      const result = await httpRequest(url, {}, 3)
      expect(result).toEqual({ success: true })
      expect(global.fetch).toHaveBeenCalledTimes(3)
    })

    it('should retry the request for server errors and throw the final error', async () => {
      const mockData = 'Server error'
      const textMock = jest.fn().mockResolvedValue(mockData)

      const errorResponseMock = mocks.getHttp503ErrorResponse()
      errorResponseMock.text = textMock
      mockFetch.mockResolvedValue(errorResponseMock)

      mockFetch.mockResolvedValue(errorResponseMock)

      const requestPromise = httpRequest(url, {}, 3)

      await expect(requestPromise).rejects.toThrow(HttpError)
      await expect(requestPromise).rejects.toMatchObject({
        status: 503,
        message: mockData,
      })

      expect(global.fetch).toHaveBeenCalledTimes(3)
    })
  })
})
