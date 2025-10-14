export const mocks = {
  getHttpSuccessJsonReponse: () => ({
    ok: true,
    headers: {
      get: () => 'application/json',
    },
    json: jest.fn(),
  }),
  getHttpSuccessTextReponse: () => ({
    ok: true,
    headers: {
      get: () => 'text/plain',
    },
    text: jest.fn(),
  }),
  getHttp401ErrorResponse: () => ({
    ok: false,
    status: 401,
    text: jest.fn(),
  }),
  getHttp503ErrorResponse: () => ({
    ok: false,
    status: 503,
    text: jest.fn(),
  }),
}
