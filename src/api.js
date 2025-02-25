import { sleep } from './utils.js';

const API_URL = 'https://api-challenge.agilefreaks.com';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const REQUEST_TIMEOUT = 5000;

/**
 * Get coffee shops data from the API
 * @returns {Promise<Array>} - Array of coffee shops
 */
export async function getCoffeeShops() {
    let token;
    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            if (!token) {
                const tokenResult = await getToken();
                token = tokenResult.token;
                console.log('[AUTH] Token obtained');
            }
            console.log('[SHOPS] Fetching for shops.');
            return await fetchWithRetry(
                `${API_URL}/v1/coffee_shops`,
                { method: 'GET' },
                token,
                '[SHOPS]',
            );
        } catch (err) {
            if (err.needsNewToken) {
                token = null;
                continue;
            }

            retries++;
            if (retries >= MAX_RETRIES) {
                throw new Error(
                    `[SHOPS] Failed to get coffee shops after ${MAX_RETRIES} attempts: ${err.message}`,
                );
            }

            const delay = retries * RETRY_DELAY;
            console.error(
                `[SHOPS] Error: ${err.message}. Retrying in ${delay}ms (${retries}/${MAX_RETRIES})`,
            );
            await sleep(delay);
        }
    }
}

/**
 * Get an authentication token from the API
 * @returns {Promise<{token: string}>} - Object containing the token
 */
export async function getToken() {
    try {
        return await fetchWithRetry(
            `${API_URL}/v1/tokens`,
            { method: 'POST' },
            null,
            '[AUTH]',
        );
    } catch (err) {
        throw new Error(`Failed to get authentication token: ${err.message}`);
    }
}

/**
 * Wrapper for fetch with retry logic, timeouts, and token handling
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @param {string} [token] - Authentication token
 * @param {string} logPrefix - Prefix for log messages
 * @returns {Promise<any>} - Parsed JSON response
 */
async function fetchWithRetry(url, options = {}, token = null, logPrefix = '') {
    let retries = 0;
    let currentToken = token;

    while (retries < MAX_RETRIES) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        try {
            const urlWithToken = currentToken
                ? `${url}?token=${currentToken}`
                : url;

            const response = await fetch(urlWithToken, {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...options,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.status === 401) {
                console.log(`${logPrefix} Token expired, getting new token`);
                throw { status: 401, needsNewToken: true };
            }

            if (response.status === 503 || response.status === 504) {
                retries++;
                const delay = retries * RETRY_DELAY;
                console.log(
                    `${logPrefix} API error: ${response.status}. Retrying in ${delay}ms (${retries}/${MAX_RETRIES})`,
                );
                await sleep(delay);
                continue;
            }

            if (!response.ok) {
                throw new Error(
                    `${logPrefix} API error: ${response.status} ${response.statusText}`,
                );
            }

            return await response.json();
        } catch (err) {
            clearTimeout(timeoutId);

            if (err.needsNewToken) {
                throw err;
            }

            retries++;
            if (retries >= MAX_RETRIES) {
                throw new Error(
                    `${logPrefix} Failed after ${MAX_RETRIES} attempts: ${err.message}`,
                );
            }

            const delay = retries * RETRY_DELAY;
            console.error(
                `${logPrefix} Error: ${err.message}. Retrying in ${delay}ms (${retries}/${MAX_RETRIES})`,
            );
            await sleep(delay);
        }
    }
}
