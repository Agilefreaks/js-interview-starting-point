/**
 * API interaction module for fetching coffee shop data.
 *
 * Functions:
 * - `getToken`: Retrieves an authentication token from the API.
 * - `fetchCoffeeShops`: Fetches the list of coffee shops using the retrieved token.
 *
 * Features:
 * - Implements retry logic for failed requests.
 * - Uses linear backoff for handling API failures.
 * - Ensures proper error handling and logging.
 */

import { HTTP_STATUS, errorMessages, URL } from './constants.js';

// Maximum number of retry attempts for failed requests
const MAX_RETRIES = 3;
// Base delay time (ms) before retrying failed requests
const RETRY_DELAY = 1000;

let currentToken = null;

// Utility function to handle fetch requests with error handling and retries
const fetchWithErrorHandling = async (url, options, retries = MAX_RETRIES, tokenRefreshed = false) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    // Create an AbortController to manage the timeout for fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      // Clean up the timeout once the fetch is successful
      clearTimeout(timeoutId);

      if (!response.ok) {
        const status = response.status || 'Unknown';
        if (status === HTTP_STATUS.UNAUTHORIZED && !tokenRefreshed) {
          console.warn(`Invalid or expired token. Trying with a new token...`);
          await getToken();
          const newCoffeeShopsUrl = `${URL}/coffee_shops?token=${currentToken}`;
          return await fetchWithErrorHandling(newCoffeeShopsUrl, options, retries, true);
        }

        const shouldRetry = [          
          HTTP_STATUS.SERVICE_UNAVAILABLE, 
          HTTP_STATUS.GATEWAY_TIMEOUT,
        ].includes(status); 

        if (shouldRetry && attempt < retries) {
          // Linear backoff
          const delay = RETRY_DELAY * attempt;
          console.warn(`Attempt ${attempt} failed: ${errorMessages[status] || status} Retrying in ${delay} ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue; 
        }
        throw new Error(`API request failed. ${errorMessages[status] || status}`);
      }
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.message.includes(errorMessages[HTTP_STATUS.UNAUTHORIZED])) {
        throw error;
      }
      console.error(`Attempt ${attempt} failed: ${error.message}. ${error.name === 'AbortError' ? 'Request was aborted due to timeout.' : ''}`);
      if (attempt === retries) {
        throw new Error(`Request failed after ${retries} retries.`);
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt)); 
    }
  }
};

// Function to retrieve a token from the API
export async function getToken() {
  const tokenUrl = `${URL}/tokens`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(tokenUrl, options);
      if (!response.ok) {
        const status = response.status || 'Unknown';
        if (attempt < MAX_RETRIES) {
          const delay = RETRY_DELAY * attempt;
          console.warn(`Attempt ${attempt} failed: ${errorMessages[status] || status}. Retrying in ${delay} ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new Error(`API request failed. ${errorMessages[status] || status}`);
      }
      const tokenObj = await response.json();
      currentToken = tokenObj.token;
      return tokenObj;
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}.`);
      if (attempt === MAX_RETRIES) {
        throw new Error(`Request failed after ${MAX_RETRIES} retries.`);
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
    }
  }
}

// Function to fetch coffee shops using an API token
export async function fetchCoffeeShops() {
  if (!currentToken) {
    await getToken();
  }

  const coffeeShopsUrl = `${URL}/coffee_shops?token=${currentToken}`;
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json', 
    },
  };

  // Using fetchWithErrorHandling for error management
  const coffeeShops = await fetchWithErrorHandling(coffeeShopsUrl, options);
  return coffeeShops;
}
