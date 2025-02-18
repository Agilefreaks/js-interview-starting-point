export const HTTP_STATUS = {
    SUCCESS: 200,
    UNAUTHORIZED: 401,
    NOT_ACCEPTABLE: 406,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
  };
  
export const errorMessages = {
    [HTTP_STATUS.SUCCESS]: 'Successful fetch.',
    [HTTP_STATUS.UNAUTHORIZED]: 'Invalid or expired token. Please attempt with a valid token.',
    [HTTP_STATUS.NOT_ACCEPTABLE]: 'Unacceptable Accept format.',
    [HTTP_STATUS.SERVICE_UNAVAILABLE]: 'Service unavailable.',
    [HTTP_STATUS.GATEWAY_TIMEOUT]: 'Timeout.',
};

export const URL = "https://api-challenge.agilefreaks.com/v1";
