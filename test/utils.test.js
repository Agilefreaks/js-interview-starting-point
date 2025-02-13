//test the result of distance calculation
import { calculateDistance } from '../src/utils.js';

describe('calculateDistance', () => {
    it('should calculate the correct distance between two points', () => {
      const x1 = 0, y1 = 0, x2 = 3, y2 = 4;
      const result = calculateDistance(x1, y1, x2, y2);
      expect(result).toBe(5.0000);
    });
  
    it('should return 0 when both points are the same', () => {
      const x1 = 0, y1 = 0, x2 = 0, y2 = 0;
      const result = calculateDistance(x1, y1, x2, y2);
      expect(result).toBe(0.0000);
    });
  
    it('should handle negative coordinates', () => {
      const x1 = -5, y1 = -5, x2 = 5, y2 = 5;
      const result = calculateDistance(x1, y1, x2, y2);
      expect(result).toBe(14.1421);
    });
});
  