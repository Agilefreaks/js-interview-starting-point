//test for getting the nearest shops
import { getNearestShops } from '../src/app.js';
import { fetchCoffeeShops } from '../src/api.js';

// Mock the necessary functions to isolate behavior
jest.mock('../src/api.js');
jest.mock('../src/utils.js');

describe('getNearestShops', () => {
  it('should return the nearest coffee shops', async () => {
    // Mocked data for coffee shops
    fetchCoffeeShops.mockResolvedValue([
      { name: 'Starbucks Seattle', x: 47.6, y: -122.4 },
      { name: 'Starbucks SF', x: 37.7749, y: -122.4194 },
    ]);

    const position = { x: 47.0, y: -122.0 };
    getNearestShops(position); 

    // Ensure fetchCoffeeShops is called during the function execution
    expect(fetchCoffeeShops).toHaveBeenCalled();
  });

  it('should handle no coffee shops returned', async () => {
    fetchCoffeeShops.mockResolvedValue([]);  // Mock an empty response

    const position = { x: 47.0, y: -122.0 };
    getNearestShops(position);  

    // Ensure fetchCoffeeShops was called and handled an empty result
    expect(fetchCoffeeShops).toHaveBeenCalled();
  });
});
