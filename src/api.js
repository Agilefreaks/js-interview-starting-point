const URL = "https://api-challenge.agilefreaks.com/v1";

// Maximum number of retry attempts for failed requests
const MAX_RETRIES = 3;
// Base delay time (ms) before retrying failed requests
const RETRY_DELAY = 1000;

// Utility function to handle fetch requests with error handling and retries
const fetchWithErrorHandling = async (url, options, retries = MAX_RETRIES) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) { 
        const status = response.status;
        const shouldRetry = [401, 503, 504].includes(status); // Only retry on these errors
        
        if (shouldRetry && attempt < retries) {
          const delay = RETRY_DELAY * attempt; // Exponential backoff
          console.warn(`Attempt ${attempt} failed: ${status}. Retrying in ${delay} ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue; 
        }
  
        throw new Error(`Failed to fetch: ${status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === retries) {
        throw new Error(`Request failed after ${retries} retries: ${error.message}`);
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
