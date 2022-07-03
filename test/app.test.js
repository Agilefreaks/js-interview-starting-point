import { getNearestShops } from "../src/app";
import DeltaCoffeeShop from "../src/deltaCoffeeShop";
import DeltaCoffeeShopList from "../src/deltaCoffeeShopList";
import SortedDeltaCoffeShopList from "../src/sortedDeltaCoffeeShopList";
import errorCodes from "../src/errorcodes.js";
import { ERROR_TOKEN, errorResponse } from "../src/utils.js";

describe("App", () => {
  it("should return an array when the input is valid", async () => {
    const f = await getNearestShops({ x: 0, y: 0 });
    expect(Array.isArray(f)).toBe(true);
  });

  it("should return an array even if the input is invalid", async () => {
    const f = await getNearestShops({ x: 0, y: "abc" });
    expect(Array.isArray(f)).toBe(true);
  });

  it("should return an array with the error code if the input is invalid", async () => {
    const f = await getNearestShops({ x: 0, y: "abc" });
    expect(f.length == 2).toBe(true);
    expect(f[0]).toBe(ERROR_TOKEN);
    expect(f[1]).toBe(errorCodes.INVALID_INPUT_ARGS_NAN);
  });

  it("should return an array with three coffee shops, containing the name and the delta value", async () => {
    const f = await getNearestShops({ x: 47.6, y: -122.4 });
    expect(f.length == 3).toBe(true);
    f.forEach(function (coffeeShop) {
      expect(coffeeShop[0] === ERROR_TOKEN).toBe(false);
      expect(typeof coffeeShop.name).toBe("string");
      expect(typeof coffeeShop.delta).toBe("number");
    });
  });
});

describe("Utils", () => {
  it("should return the error response in the expected format", () => {
    let resp = errorResponse(errorCodes.GENERIC_ERROR);
    let expectedResp = [ERROR_TOKEN, errorCodes.GENERIC_ERROR];
    expect(resp[0]).toBe(expectedResp[0]);
    expect(resp[1]).toBe(expectedResp[1]);

    resp = errorResponse(errorCodes.INVALID_INPUT_ARGS_NAN);
    expectedResp = [ERROR_TOKEN, errorCodes.INVALID_INPUT_ARGS_NAN];
    expect(resp[0]).toBe(expectedResp[0]);
    expect(resp[1]).toBe(expectedResp[1]);

    resp = errorResponse(errorCodes.UNAUTHORIZED);
    expectedResp = [ERROR_TOKEN, errorCodes.UNAUTHORIZED];
    expect(resp[0]).toBe(expectedResp[0]);
    expect(resp[1]).toBe(expectedResp[1]);

    resp = errorResponse(errorCodes.UNACCEPTABLE_ACCEPT_FORMAT);
    expectedResp = [ERROR_TOKEN, errorCodes.UNACCEPTABLE_ACCEPT_FORMAT];
    expect(resp[0]).toBe(expectedResp[0]);
    expect(resp[1]).toBe(expectedResp[1]);

    resp = errorResponse(errorCodes.SERVICE_UNAVAILABLE);
    expectedResp = [ERROR_TOKEN, errorCodes.SERVICE_UNAVAILABLE];
    expect(resp[0]).toBe(expectedResp[0]);
    expect(resp[1]).toBe(expectedResp[1]);

    resp = errorResponse(errorCodes.TIMEOUT);
    expectedResp = [ERROR_TOKEN, errorCodes.TIMEOUT];
    expect(resp[0]).toBe(expectedResp[0]);
    expect(resp[1]).toBe(expectedResp[1]);
  });
});

function determineDistance(x1, x2, y1, y2) {
  x1 = parseFloat(x1);
  x2 = parseFloat(x2);
  y1 = parseFloat(y1);
  y2 = parseFloat(y2);

  const nbOfDecimals = 4;
  return parseFloat(
    Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)).toFixed(nbOfDecimals)
  );
}

const coffeeShops = [
  {
    id: 1,
    created_at: "2021-02-10T12:50:14.422Z",
    updated_at: "2021-02-10T12:50:14.422Z",
    name: "Blue Bottle Seattle",
    x: "47.581",
    y: "-122.316",
  },
  {
    id: 2,
    created_at: "2021-02-10T12:50:14.431Z",
    updated_at: "2021-02-10T12:50:14.431Z",
    name: "Blue Bottle SF",
    x: "37.521",
    y: "-122.334",
  },
  {
    id: 3,
    created_at: "2021-02-10T12:50:14.437Z",
    updated_at: "2021-02-10T12:50:14.437Z",
    name: "Blue Bottle Moscow",
    x: "55.752",
    y: "37.595",
  },
  {
    id: 4,
    created_at: "2021-02-10T12:50:14.444Z",
    updated_at: "2021-02-10T12:50:14.444Z",
    name: "Blue Bottle Seattle2",
    x: "47.587",
    y: "-122.337",
  },
  {
    id: 5,
    created_at: "2021-02-10T12:50:14.451Z",
    updated_at: "2021-02-10T12:50:14.451Z",
    name: "Blue Bottle Rio De Janeiro",
    x: "-22.923",
    y: "-43.234",
  },
  {
    id: 6,
    created_at: "2021-02-10T12:50:14.457Z",
    updated_at: "2021-02-10T12:50:14.457Z",
    name: "Blue Bottle Sydney",
    x: "-33.872",
    y: "151.207",
  },
];

describe("DeltaCoffeeShop", () => {
  it("should correctly determine the delta when both points are zero", () => {
    const coffeeShop = {
      id: 1,
      name: "Above average coffee shop",
      x: 0,
      y: 0,
    };
    const localX = coffeeShop.x,
      localY = coffeeShop.y;
    const deltaCoffeeShop = new DeltaCoffeeShop(coffeeShop, localX, localY);
    expect(deltaCoffeeShop.delta).toBe(0);
  });

  it("should correctly determine the delta when both points are equal", () => {
    const coffeeShop = {
      id: 1,
      name: "Above average coffee shop",
      x: -27.0,
      y: 13,
    };
    const localX = coffeeShop.x,
      localY = coffeeShop.y;
    const deltaCoffeeShop = new DeltaCoffeeShop(coffeeShop, localX, localY);
    expect(deltaCoffeeShop.delta).toBe(0);
  });

  it("should correctly determine the delta when X coordinate differs", () => {
    const coffeeShop = {
      id: 1,
      name: "Above average coffee shop",
      x: -27.0,
      y: 13,
    };
    const localX = coffeeShop.x + 10,
      localY = coffeeShop.y;
    const deltaCoffeeShop = new DeltaCoffeeShop(coffeeShop, localX, localY);
    expect(deltaCoffeeShop.delta).toBe(10);
  });

  it("should correctly determine the delta when Y coordinate differs", () => {
    const coffeeShop = {
      id: 1,
      name: "Above average coffee shop",
      x: -27.0,
      y: 13,
    };
    const localX = coffeeShop.x,
      localY = coffeeShop.y + 10;
    const deltaCoffeeShop = new DeltaCoffeeShop(coffeeShop, localX, localY);
    expect(deltaCoffeeShop.delta).toBe(10);
  });

  it("should correctly determine the delta", () => {
    const coffeeShop = {
      id: 1,
      name: "Above average coffee shop",
      x: -27.0,
      y: 13,
    };
    const localX = 47.123,
      localY = -30;
    const deltaCoffeeShop = new DeltaCoffeeShop(coffeeShop, localX, localY);
    const expectedDelta = determineDistance(
      coffeeShop.x,
      localX,
      coffeeShop.y,
      localY
    );
    expect(deltaCoffeeShop.delta).toBe(expectedDelta);
  });
});

describe("DeltaCoffeeShopList", () => {
  it("should correctly construct the DeltaCoffeeShopList", () => {
    const localX = 12.34,
      localY = -56.78;
    const deltaCoffeeShopList = new DeltaCoffeeShopList(
      coffeeShops,
      localX,
      localY
    );

    expect(deltaCoffeeShopList._currentX).toBe(localX);
    expect(deltaCoffeeShopList._currentY).toBe(localY);

    for (let i = 0; i < coffeeShops.length; i++) {
      const coffeeShop = deltaCoffeeShopList._deltaCoffeeShops[i];
      const expectedDelta = determineDistance(
        coffeeShop.x,
        localX,
        coffeeShop.y,
        localY
      );
      expect(coffeeShop.delta).toBe(expectedDelta);
    }
  });
});

describe("SortedDeltaCoffeeShopList", () => {
  it("should correctly construct the SortedDeltaCoffeeShopList", () => {
    const localX = 12.34,
      localY = -56.78;
    const sortedDeltaCoffeeShopList = new SortedDeltaCoffeShopList(
      coffeeShops,
      localX,
      localY
    );

    // Check that the coffee shops were ordered in ascending order
    const expectedIdOrder = [5, 2, 1, 4, 3, 6];
    for (let i = 0; i < coffeeShops.length; i++) {
      const coffeeShop = sortedDeltaCoffeeShopList._deltaCoffeeShops[i];
      expect(coffeeShop.id).toBe(expectedIdOrder[i].id);
    }
  });
});
