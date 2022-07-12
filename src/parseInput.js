/**
 * @typedef {object} ParseInputResult
 * @property {Error|null} error
 * @property {import('./app.js').Point|null} point
 */

/**
 * Parses process.argv
 *
 * @param {string[]} args
 * @returns {ParseInputResult}
 */
export function parseInput(args) {
    /** @type {ParseInputResult} */
    const result = {
        error: null,
        point: null
    };
    const errors = [];
    const [x, y] = args.slice(2);
    const point = {
        x: parseFloat(x),
        y: parseFloat(y)
    };

    if (Number.isNaN(point.x)) {
        errors.push(`Input error: expected number for X coordinate but received ${x}`);
    }
    if (Number.isNaN(point.y)) {
        errors.push(`Input error: expected number for Y coordinate but received ${y}`);
    }

    if (errors.length > 0) {
        result.error = new Error(errors.join('\n'));
        return result;
    }

    result.point = point;
    return result;
}