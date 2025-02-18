export function validateCoordinates(x, y, errorMessage) {
    const parsedX = parseFloat(x);
    const parsedY = parseFloat(y);
    
    if (isNaN(parsedX) || isNaN(parsedY)) {
      throw new Error(`Invalid coordinates: [${x}, ${y}]. ${errorMessage || ''}`);
    }
    return { x: parsedX, y: parsedY };
}