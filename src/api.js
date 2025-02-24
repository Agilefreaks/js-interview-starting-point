import { sleep } from './utils.js';

const API_URL = 'https://api-challenge.agilefreaks.com';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const RETRY_STATUSES = { 504: 'direct', 503: 'direct', 401: 'newToken' };

export async function getCoffeeShops() {
    let retries = 0;
    let token;

    while (retries < MAX_RETRIES) {
        try {
            if (!token) {
                const tokenResult = await getToken();
                token = tokenResult.token;
            }

            const response = await fetch(
                `${API_URL}/v1/coffee_shops?token=${token}`,
                { method: 'GET' },
            );

            if (response.status === 401) {
                console.log('Token expired, getting new token');
                token = null;
                continue;
            }

            if (response.status === 503 || response.status === 504) {
                retries++;
                const delay = retries * RETRY_DELAY;
                console.log(
                    `API error: ${response.status}. Retrying in ${delay}ms (${retries}/${MAX_RETRIES})`,
                );
                await sleep(delay);
                continue;
            }

            if (!response.ok) {
                throw new Error(
                    `API error: ${response.status} ${response.statusText}`,
                );
            }

            return await response.json();
        } catch (err) {
            retries++;

            if (retries >= MAX_RETRIES) {
                console.error(
                    `Failed to get coffee shops after ${MAX_RETRIES} attempts: ${err.message}`,
                );
                process.exit(1);
            }

            const delay = retries * RETRY_DELAY;
            console.error(
                `Error fetching coffee shops: ${err.message}. Retrying in ${delay}ms (${retries}/${MAX_RETRIES})`,
            );
            await sleep(delay);
        }
    }
}

export async function getToken() {
    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            const response = await fetch(`${API_URL}/v1/tokens`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(
                    `Token API error: ${response.status} ${response.statusText}`,
                );
            }

            return await response.json();
        } catch (err) {
            retries++;

            if (retries >= MAX_RETRIES) {
                console.error(
                    `Failed to get coffee shops after ${MAX_RETRIES} attempts: ${err.message}`,
                );
                process.exit(1);
            }

            const delay = retries * RETRY_DELAY;
            console.error(
                `Error fetching token: ${err.message}. Retrying in ${delay}ms (${retries}/${MAX_RETRIES})`,
            );
            await sleep(delay);
        }
    }
}
