/**
 * Utility function for mathematical calculations and data processing.
 *
 * Function:
 * - `calculateDistance`: Calculates the Euclidean distance between two geographical points.
 */

import { validateCoordinates } from "./validateCoordinates.js";

export function calculateDistance(x1, y1, x2, y2) {
  try {
    const firstPoint = validateCoordinates(x1, y1);
    const secondPoint = validateCoordinates(x2, y2, 'Invalid coordinates from API');
    const distance = Math.sqrt(Math.pow(secondPoint.x - firstPoint.x, 2) + Math.pow(secondPoint.y - firstPoint.y, 2));
    return parseFloat(distance.toFixed(4));
  } catch (error) {
    throw error;
  }
}