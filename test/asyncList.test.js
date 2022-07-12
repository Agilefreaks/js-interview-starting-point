import { AsyncList } from '../src/asyncList.js';

describe('asyncList.js', () => {
    describe('run', () => {
        it('returns the promise with no changes', () => {
            const list = new AsyncList(Promise.resolve([1, 2]));
            return expect(list.run()).resolves.toEqual([1, 2]);
        });

        it('applies the modifier to the wrapped promise then returns the promise', () => {
            const list = new AsyncList(Promise.resolve([1, 2]), (a) => a.map(x => x + 1));
            return expect(list.run()).resolves.toEqual([2, 3]);
        });

        it('if promise value is not an array it wraps it in one', () => {
            const list = new AsyncList(Promise.resolve(1));
            return expect(list.run()).resolves.toEqual([1]);
        });
    });

    describe('map()', () => {
        it('applies the map function on every item in the list', () => {
            const list = new AsyncList(Promise.resolve([1, 2]));
            const add1 = (n) => n + 1;
            return expect(list.map(add1).run()).resolves.toEqual([2, 3]);
        });
    });

    describe('sort()', () => {
        it('sorts the promised wrapped list ascending', () => {
            const list = new AsyncList(Promise.resolve([4, 7, 1, 2]));
            const asc = (a, b) => a - b;
            return expect(list.sort(asc).run()).resolves.toEqual([1, 2, 4, 7]);
        });

        it('sorts the promised wrapped list descending', () => {
            const list = new AsyncList(Promise.resolve([4, 7, 1, 2]));
            const desc = (a, b) => b - a;
            return expect(list.sort(desc).run()).resolves.toEqual([7, 4, 2, 1]);
        });
    });

    describe('take()', () => {
        it('reduces the list to first n elements then calls and returns run()', () => {
            const list = new AsyncList(Promise.resolve([3, 7, 2, 4]));
            return expect(list.take(2)).resolves.toEqual([3, 7]);
        });
    });

});