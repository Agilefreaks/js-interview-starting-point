import { getNearestShops } from '../src/app';
import errorCodes from "../src/errorcodes.js";
import { ERROR_TOKEN} from "../src/utils.js"

describe('App', () => {
  it('should return an array when the input is valid', async () => {
    const f = await getNearestShops({x: 0, y: 0});
    expect(Array.isArray(f)).toBe(true);
  });

  it('should return an array even if the input is invalid', async () => {
    const f = await getNearestShops({x: 0, y: "abc"});
    expect(Array.isArray(f)).toBe(true);
  });

  it('should return an array with the error code if the input is invalid', async () => {
    const f = await getNearestShops({x: 0, y: "abc"});
    expect(f.length == 2).toBe(true);
    expect(f[0]).toBe(ERROR_TOKEN);
    expect(f[1]).toBe(errorCodes.INVALID_INPUT_ARGS_NAN);
  });
});
