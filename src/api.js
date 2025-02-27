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
    try {
        console.log('[SHOPS] Fetching for shops.');
        return await fetchWithRetry(
            `${API_URL}/v1/coffee_shops`,
            { method: 'GET' },
            '[SHOPS]',
        );
    } catch (err) {
        throw new Error(`[SHOPS] API error: 400 Bad Request`);
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

let cachedToken = '';
async function fetchWithRetry(url, options = {}, logPrefix = '') {
    let retries = 0;

    while (retries < MAX_RETRIES) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        try {
            cachedToken ||= (await getToken()).token;

            const response = await fetch(`${url}?token=${cachedToken}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...options.headers,
                },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);
            if (response.status === 401) {
                cachedToken = '';
                console.log(`${logPrefix} Token expired, getting new token`);
                continue;
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

/**
 * Get an authentication token from the API
 * @returns {Promise<{token: string}>} - Object containing the token
 */
export async function getToken() {
    try {
        console.log('[AUTH] Fetching for token');
        const response = await fetch(`${API_URL}/v1/tokens`, {
            method: 'POST',
        });

        return await response.json();
    } catch (err) {
        throw new Error(`Failed to get authentication token: ${err.message}`);
    }
}
