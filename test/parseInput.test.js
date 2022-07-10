import { parseInput } from '../src/parseInput';

describe('parseInput()', () => {
    it('returns a Point', () => {
        expect(parseInput(['', '', '1', '2'])).toEqual({
            error: null,
            point: {
                x: 1,
                y: 2
            }
        });
        expect(parseInput(['', '', '1.1', '2.1'])).toEqual({
            error: null,
            point: {
                x: 1.1,
                y: 2.1
            }
        });
    });
    it('returns an Error', () => {
        let result = parseInput(['', '', 'a1', '2']);
        expect(result.point).toBe(null);
        expect(result.error.message).toEqual('Input error: expected number for X coordinate but received a1');

        result = parseInput(['', '', '1', 'a2']);
        expect(result.point).toBe(null);
        expect(result.error.message).toEqual('Input error: expected number for Y coordinate but received a2');

        result = parseInput(['', '', 'a1', 'a2']);
        expect(result.point).toBe(null);
        expect(result.error.message).toEqual([
            'Input error: expected number for X coordinate but received a1',
            'Input error: expected number for Y coordinate but received a2'
        ].join('\n'));
    });
});