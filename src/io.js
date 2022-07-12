/**
 * @type {import('http').RequestOptions}
 */
const defaultOptions = {
    port: 443,
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
};

/**
 * @callback resolveRequestOptions
 * @param {import('http').RequestOptions} options
 * @param {string} [data]
 * @returns {import('http').RequestOptions}
 */

/**
 * @template T
 * @callback httpFetch
 * @param {string} name name used as prefix for error messages
 * @param {import('http').RequestOptions} options
 * @param {string} [data] POST data
 * @returns {Promise<T>} 
 */

/**
 * @template T
 * @param {import('https')} https
 * @param {resolveResponseFactory<T>} resolveResponse
 * @param {resolveRequestOptions} resolveRequestOptions
 * @returns {httpFetch<T>}
 */
export function httpFetchFactory(https, resolveResponse, resolveRequestOptions) {
    return (name, options, data) => {
        return new Promise((resolve, reject) => {
            const requestOptions = resolveRequestOptions(options, data);
            const req = https.request(requestOptions, resolveResponse(resolve, reject, name));

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
 * @callback resolveResponse
 * @param {import('http').IncomingMessage} response
 * @returns {void}
 */

/**
 * @template T
 * @callback resolveResponseFactory
 * @param {function(T):void} resolve called with the parsed JSON object
 * @param {function(Error):void} reject called on error with Error object
 * @param {string} errorPrefix
 * @returns {resolveResponse}
 */


/**
 * @template T
 * @type {resolveResponseFactory<T>}
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
 * @type {resolveRequestOptions}
 */
export function resolveJsonRequestOptions(options, data = '') {
    const requestOptions = { ...defaultOptions, ...options };

    if (data.length > 0) {
        requestOptions.headers = {
            ...requestOptions.headers,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        };
    }

    return requestOptions;
}

