/**
 * Utility function for mathematical calculations and data processing.
 *
 * Function:
 * - `calculateDistance`: Calculates the Euclidean distance between two geographical points.
 */

export function calculateDistance(x1, y1, x2, y2) {
  // Calculate distance between 2 points using Euclidean formula
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return parseFloat(distance.toFixed(4));
}