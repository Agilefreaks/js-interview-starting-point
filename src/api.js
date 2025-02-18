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

// Utility function to handle fetch requests with error handling and retries
const fetchWithErrorHandling = async (url, options, retries = MAX_RETRIES) => {
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
        if (status === HTTP_STATUS.UNAUTHORIZED) {
          throw new Error(errorMessages[status]);
        }
        // Only retry on these errors
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
      if (error.message === errorMessages[HTTP_STATUS.UNAUTHORIZED]) {
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

  // Using fetchWithErrorHandling for error management
  const tokenResponse = await fetchWithErrorHandling(tokenUrl, options);
  return tokenResponse;
}

// Function to fetch coffee shops using an API token
export async function fetchCoffeeShops() {
  // Fetch token before making the coffee shops request
  const tokenObj = await getToken();
  const token = tokenObj.token;  // Destructure the token

  const coffeeShopsUrl = `${URL}/coffee_shops?token=${token}`;
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
