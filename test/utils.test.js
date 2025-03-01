import {
  calculateDistance,
  validatePosition,
  getClosestIndices,
  findNearestShops
} from '../src/utils.js';

describe('Utility Functions', () => {
  describe('findNearestShops', () => {
    const mockShops = [
      { name: 'Coffee A', x: 10, y: 10 },
      { name: 'Coffee B', x: 5, y: 5 },
      { name: 'Coffee C', x: 20, y: 20 }
    ];

    const userPosition = { x: 0, y: 0 };

    test('returns nearest shops in correct order', () => {
      const result = findNearestShops(mockShops, userPosition);

      expect(result.length).toBe(3);
      expect(result[0].name).toBe('Coffee B');
      expect(result[1].name).toBe('Coffee A');
      expect(result[2].name).toBe('Coffee C');
    });

    test('limits results to specified number', () => {
      const result = findNearestShops(mockShops, userPosition, 1);

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Coffee B');
    });

    test('throws error for invalid input', () => {
      expect(() => {
        findNearestShops(null, userPosition);
      }).toThrow('Invalid data returned by API.');
    });
  });

  describe('calculateDistance', () => {
    test('calculates distance correctly between two points', () => {
      const point1 = { x: 0, y: 0 };
      const point2 = { x: 2, y: 2 };
      expect(
        Math.round(calculateDistance(point1, point2) * 10000) / 10000
      ).toBe(2.8284);
    });

    test('handles negative coordinates', () => {
      const point1 = { x: -1, y: -2 };
      const point2 = { x: 2, y: 2 };
      expect(calculateDistance(point1, point2)).toBeCloseTo(5);
    });
  });

  describe('validatePosition', () => {
    test('accepts valid coordinates', () => {
      expect(() => validatePosition({ x: 10, y: 20 })).not.toThrow();
      expect(() => validatePosition({ x: -10.5, y: 20.5 })).not.toThrow();
    });

    test('throws error for non-numeric coordinates', () => {
      expect(() => validatePosition({ x: 'a', y: 20 })).toThrow();
      expect(() => validatePosition({ x: 10, y: 'b' })).toThrow();
      expect(() => validatePosition({ x: 'a', y: 'b' })).toThrow();
      expect(() => validatePosition({ x: null, y: undefined })).toThrow();
    });
  });

  describe('getClosestIndices', () => {
    test('returns three lowest distance entries', () => {
      const distances = [
        { name: 'Shop A', distance: 5 },
        { name: 'Shop B', distance: 2 },
        { name: 'Shop C', distance: 10 },
        { name: 'Shop D', distance: 1 },
        { name: 'Shop E', distance: 7 }
      ];

      const result = getClosestIndices(distances, 3);

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Shop D');
      expect(result[1].name).toBe('Shop B');
      expect(result[2].name).toBe('Shop A');
    });

    test('handles array with fewer than three entries', () => {
      const distances = [
        { name: 'Shop A', distance: 5 },
        { name: 'Shop B', distance: 2 }
      ];

      const result = getClosestIndices(distances, 3);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Shop B');
      expect(result[1].name).toBe('Shop A');
    });
  });
});
