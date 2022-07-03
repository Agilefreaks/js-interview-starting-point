
export const ERROR_TOKEN = "ERROR";

export function errorResponse(errorCode) {
    return [ERROR_TOKEN, errorCode];
}
