import {getNearestShops} from '../src/app';


describe('App', () => {
    it('should return an array when the input is valid', async () => {
        expect(Array.isArray(await getNearestShops({
            lat: 0,
            lng: 0,
        }))).toBe(true)
    });
});
