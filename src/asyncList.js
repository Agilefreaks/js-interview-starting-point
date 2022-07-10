/**
 * @module asyncList
 */

/**
 * @typedef module:asyncList.modifier
 * @type {function}
 * @param {Array}
 * @returns {Array}
 */


export class AsyncList {

    /**
     * @param {Promise} promise
     * @param {module:asyncList.modifier} [modifier]
     */
    constructor(promise, modifier) {
        this._promise = promise;
        if (typeof modifier === 'function') {
            this._modifier = modifier;
        } else {
            this._modifier = data => data;
        }
    }

    /**
     * @return {Promise}
     */
    run() {
        if (typeof this._modifier === 'function') {
            return this._promise.then(data => {
                if (!Array.isArray(data)) return this._modifier([data]);
                return this._modifier(data);
            });
        }
        return this._promise;
    }

    /**
     * @param {function} fn
     * @return {AsyncList}
     */
    map(fn) {
        const modifier = this._modifier;
        return new AsyncList(this._promise, (data) => modifier(data).map(fn));
    }

    /**
     * @param {function} fn
     * @return {AsyncList}
     */
    sort(fn) {
        const modifier = this._modifier;
        return new AsyncList(this._promise, (data) => modifier(data).sort(fn));
    }

    /**
     * @param {number} n
     * @return {Promise}
     */
    take(n) {
        const modifier = this._modifier;
        return new AsyncList(this._promise, (data) => modifier(data).slice(0, n)).run();
    }
}