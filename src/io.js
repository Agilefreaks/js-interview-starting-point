/**
 * @module IO
 */

/**
 * nodejs http interface.
 * @external https
 * @see {@link https://nodejs.org/dist/latest-v16.x/docs/api/http.html|http}
 */

/**
 * nodejs http interface.
 * @external "http.IncomingMessage"
 * @see {@link https://nodejs.org/dist/latest-v16.x/docs/api/http.html#class-httpincomingmessage|http.IncomingMessage}
 */

/**
 * nodejs http interface.
 * @external "http.requestOptions"
 * @see {@link https://nodejs.org/dist/latest-v16.x/docs/api/http.html#httprequesturl-options-callback|http.request}
 */


/**
 * @type external:"http.requestOptions"
 */
const defaultOptions = {
    port: 443,
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
};

/**
 * @typedef module:IO.httpFetch
 * @type {Function}
 * @param {string} name - name to use in the error message
 * @param {external:"http.requestOptions"} options - http.request options
 * @param {string} [data] - POST data
 * @return {Promise<any>}
 */

/**
 * Creates a utility function for making http json requests
 * @param {external:https} http
 * @param {module:IO.resolveJsonResponse} resolveJsonResponse
 * @return {module:IO.httpFetch}
 */
export function httpFetchFactory(http, resolveJsonResponse) {
    return (name, options, data) => {
        return new Promise((resolve, reject) => {
            const requestOptions = resolveRequestOptions(options, data);
            const req = http.request(requestOptions, resolveJsonResponse(resolve, reject, name));

            req.on('error', (error) => {
                reject(new Error(name + ': Request Failed', { cause: error }));
            });

            if (data !== undefined) {
                req.write(data);
            }

            req.end();
        });
    };
}

/**
 * @typedef module:IO.resolveJsonResponse
 * @type {Function}
 * @param {external:"http.IncomingMessage"} response
 * @returns {void}
 */

/**
 * Returns a function that consumes a
 * {@link https://nodejs.org/dist/latest-v16.x/docs/api/http.html#class-httpincomingmessage|http.IncomingMessage}
 * and calls `resolve` with the parsed JSON object or `reject` with an error
 *
 * @param {Function} resolve - Promise.resolve
 * @param {Function} reject - Promise.reject
 * @param {string} errorPrefix
 * @return {module:IO.resolveJsonResponse}
 */
export function resolveJsonResponseFactory(resolve, reject, errorPrefix) {
    return (response) => {
        const { statusCode } = response;
        const contentType = response.headers['content-type'];

        // TODO maybe pass an expected status code to make this generic
        if (statusCode !== 200) {
            return fail(new Error(`${errorPrefix}: Request Failed.\nStatus Code: ${statusCode}`));
        } else if (!/^application\/json/.test(contentType)) {
            return fail(new Error(`${errorPrefix}: Invalid content-type.\nExpected application/json but received ${contentType}`));
        }

        response.setEncoding('utf8');

        let rawData = '';

        response.on('data', (chunk) => { rawData += chunk; });
        response.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                resolve(parsedData);
            } catch (error) {
                reject(new Error(`${errorPrefix}: Failed parsing json response`, { cause: error }));
            }
        });

        function fail(error) {
            response.resume();
            reject(error);
        }
    };
}

/**
 * @param {external:"http.requestOptions"} options
 * @param {string} data
 * @return {external:"http.requestOptions"}
 */
function resolveRequestOptions(options, data) {
    const requestOptions = { ...defaultOptions, ...options };

    if (data !== undefined) {
        requestOptions.headers = {
            ...requestOptions.headers,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        };
    }

    return requestOptions;
}

