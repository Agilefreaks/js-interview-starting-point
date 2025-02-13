const URL = "https://api-challenge.agilefreaks.com/v1";

// Utility function to handle fetch requests with error handling
const fetchWithErrorHandling = async (url, options) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    return response.json(); 
  } catch (error) {
    console.error('Error in fetch request:', error);
    throw new Error(`Request failed: ${error.message || error}`);
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
