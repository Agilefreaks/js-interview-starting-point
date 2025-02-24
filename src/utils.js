/**
 * Creates a delay by returning a Promise that resolves after the specified time
 * @param {Number} ms
 * @returns {Promise<undefined>}
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
