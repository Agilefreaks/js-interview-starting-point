/**
 * @template T , U
 */
export class AsyncList {

    /**
     * @param {Promise<T>|Promise<Array<T>>} promise
     * @param {function(Array<T>):Array<U>|Array<T>} [modifier]
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
     * @return {Promise<Array<T>>|Promise<Array<T>>}
     */
    run() {
        return this._promise.then(data => {
            if (!Array.isArray(data)) return this._modifier([data]);
            return this._modifier(data);
        });
    }

    /**
     * @template V
     * @param {function(T):V} fn
     * @return {AsyncList<T, V>}
     */
    map(fn) {
        const modifier = this._modifier;
        return new AsyncList(this._promise, (data) => modifier(data).map(fn));
    }

    /**
     * @param {function(T, T):number} fn
     * @return {AsyncList<T, U>}
     */
    sort(fn) {
        const modifier = this._modifier;
        return new AsyncList(this._promise, (data) => modifier(data).sort(fn));
    }

    /**
     * @param {number} n
     * @return {Promise<Array<T>>|Promise<Array<U>>}
     */
    take(n) {
        const modifier = this._modifier;
        return new AsyncList(this._promise, (data) => modifier(data).slice(0, n)).run();
    }
}