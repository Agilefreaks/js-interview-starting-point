import { getNearestShops, getPositionFromCLI } from '../src/app.js';
import { fetchCoffeeShops } from '../src/api.js';

// Utility function to mock `process.argv`
const mockProcessArgv = (x, y) => {
  process.argv = ['node', 'app.js', x, y];
};

jest.mock('../src/api.js');

describe('App Tests', () => {
  let consoleSpy;

  beforeEach(() => {
    // Mock console.log to check output
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clear mocks after each test
    jest.clearAllMocks(); 
  });

  it('should throw an error if invalid coordinates are passed', () => {
    mockProcessArgv('invalid', 'coordinates');
    expect(() => getPositionFromCLI()).toThrow();
  });

  it('should return valid coordinates when valid arguments are passed', () => {
    mockProcessArgv('1', '1');
    const result = getPositionFromCLI();
    expect(result).toEqual({ x: 1, y: 1 });
  });

  it('should throw an error and exit when fetchCoffeeShops fails', async () => {
    // Set up the process.argv for coordinates
    mockProcessArgv('1', '1');

    // Mock fetchCoffeeShops to throw an error (simulate failure)
    fetchCoffeeShops.mockRejectedValueOnce(new Error('Failed to fetch'));
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    await getNearestShops();
    expect(console.error).toHaveBeenCalledWith("Failed to fetch coffee shops:", expect.any(String));
    expect(exitSpy).toHaveBeenCalledWith(1);

    // Restore the original implementations
    exitSpy.mockRestore();
    console.error.mockRestore();
  });

  it('should fetch coffee shops, calculate distances and log the nearest ones', async () => {
    // Mocking the fetchCoffeeShops function to return a fake list of coffee shops
    const mockCoffeeShops = [
      { id: 1, name: 'Coffee Shop 1', x: '1.1', y: '1.1' },
      { id: 2, name: 'Coffee Shop 2', x: '2.1', y: '2.1' },
      { id: 3, name: 'Coffee Shop 3', x: '0.5', y: '0.5' },
      { id: 4, name: 'Coffee Shop 4', x: '0.6', y: '0.5' },
      { id: 5, name: 'Coffee Shop 5', x: '0.7', y: '0.5' },
    ];
  
    fetchCoffeeShops.mockResolvedValue(mockCoffeeShops);
    mockProcessArgv('1', '1');
    await getNearestShops();

    // Checking that the nearest coffee shops were logged correctly
    expect(consoleSpy).toHaveBeenCalledWith('Coffee Shop 1, 0.1414');
    expect(consoleSpy).toHaveBeenCalledWith('Coffee Shop 5, 0.5831');
    expect(consoleSpy).toHaveBeenCalledWith('Coffee Shop 4, 0.6403');

    // Cleaning up the spy after the test
    consoleSpy.mockRestore();
  });
});
