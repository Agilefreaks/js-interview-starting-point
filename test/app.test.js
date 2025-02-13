//test for getting the nearest shops
import { getNearestShops } from '../src/app.js';

describe('App', () => {
  it('should return an array when the input is valid', () => {
    expect(Array.isArray(getNearestShops({
      lat: 0,
      lng: 0,
    }))).toBe(true);
  });
});
