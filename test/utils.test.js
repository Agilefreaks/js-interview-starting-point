/**
 * Unit tests for `calculateDistance` function.
 *
 * Tests include:
 * - Verifying distance calculation between two points.
 * - Ensuring function correctly handles identical points.
 * - Handling negative coordinates and large values.
 * - Ensuring accuracy when dealing with floating-point numbers.
 */

import { calculateDistance } from '../src/utils.js';

describe('calculateDistance', () => {
    it('should calculate the correct distance between two points', () => {
      const x1 = 0, y1 = 0, x2 = 3, y2 = 4;
      const result = calculateDistance(x1, y1, x2, y2);
      expect(result).toBeCloseTo(5.0000);
    });
  
    it('should return 0 when both points are the same', () => {
      const x1 = 0, y1 = 0, x2 = 0, y2 = 0;
      const result = calculateDistance(x1, y1, x2, y2);
      expect(result).toBeCloseTo(0.0000);
    });
  
    it('should handle negative coordinates', () => {
      const x1 = -5, y1 = -5, x2 = 5, y2 = 5;
      const result = calculateDistance(x1, y1, x2, y2);
      expect(result).toBeCloseTo(14.1421);
    });

    it('should handle floating point values and return correct distance', () => {
      const x1 = 1.1, y1 = 2.2, x2 = 3.3, y2 = 4.4;
      const result = calculateDistance(x1, y1, x2, y2);
      expect(result).toBeCloseTo(3.1113, 4);
    });

    it('should handle large values correctly', () => {
      const x1 = 1000000, y1 = 1000000, x2 = 2000000, y2 = 2000000;
      const result = calculateDistance(x1, y1, x2, y2);
      expect(result).toBeCloseTo(1414213.5624); 
    });
});
  