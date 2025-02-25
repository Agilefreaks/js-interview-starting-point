export function calculateDistance(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function validatePosition({ x, y }) {
    x = Number(x);
    x = Number(y);

    if (isNaN(x) || isNaN(y)) {
        throw new Error(
            'Invalid arguments, please add valid numbers as coordinates.',
        );
    }
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getLowestThreeIndices(arr) {
    return arr.sort((a, b) => a.distance - b.distance).slice(0, 3);
}
