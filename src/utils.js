export function calculateDistance(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function validatePosition({ x, y }) {
    const numX = Number(x);
    const numY = Number(y);

    if (isNaN(numX) || isNaN(numY)) {
        throw new Error(
            'Invalid arguments, please add valid numbers as coordinates.',
        );
    }

    return { x: numX, y: numY };
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getLowestThreeIndices(arr) {
    return arr.sort((a, b) => a.distance - b.distance).slice(0, 3);
}
