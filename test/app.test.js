import { getNearestShops } from "../src/app";
import { calculateDistance } from "../src/utils.js";

describe("calculateDistance", () => {
  it("should calculate distance correctly", () => {
    const distance = calculateDistance(0, 0, 1, 1);
    expect(distance).toBeCloseTo(1.4142, 4);
  });

  it("should handle negative coordinates", () => {
    const distance = calculateDistance(-1, -1, 1, 1);
    expect(distance).toBeCloseTo(2.8284, 4);
  });

  it("should return 0 when coordinates are the same", () => {
    const distance = calculateDistance(3, 3, 3, 3);
    expect(distance).toBe(0);
  });
});

describe("getNearestShops", () => {
  it("should return an array of three closest shops", async () => {
    const mockShopsData = [
      { name: "Shop 1", x: "0", y: "0" },
      { name: "Shop 2", x: "1", y: "1" },
      { name: "Shop 3", x: "2", y: "2" },
      { name: "Shop 4", x: "3", y: "3" },
    ];

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ token: "test_token" }),
        ok: true,
      }) //Mock token
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockShopsData),
        ok: true,
      }); //Mock shops data
    const shops = await getNearestShops({ x: 0, y: 0 });
    expect(shops.length).toBe(3);
  });

  it("should handle empty shop data", async () => {
    const mockShopsData = [];
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ token: "test_token" }),
        ok: true,
      }) //Mock token
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockShopsData),
        ok: true,
      }); //Mock shops data
    const shops = await getNearestShops({ x: 0, y: 0 });
    expect(shops).toBeUndefined();
  });

  it("should handle negative coordinates", async () => {
    const mockShopsData = [
      { name: "Shop 1", x: "0", y: "0" },
      { name: "Shop 2", x: "1", y: "1" },
      { name: "Shop 3", x: "2", y: "2" },
      { name: "Shop 4", x: "3", y: "3" },
    ];

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ token: "test_token" }),
        ok: true,
      }) //Mock token
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockShopsData),
        ok: true,
      }); //Mock shops data
    const shops = await getNearestShops({ x: -50, y: -120 });
    expect(shops.length).toBe(3);
  });

  it("should handle large coordinates", async () => {
    const mockShopsData = [
      { name: "Shop 1", x: "0", y: "0" },
      { name: "Shop 2", x: "1", y: "1" },
      { name: "Shop 3", x: "2", y: "2" },
      { name: "Shop 4", x: "3", y: "3" },
    ];

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ token: "test_token" }),
        ok: true,
      }) //Mock token
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockShopsData),
        ok: true,
      }); //Mock shops data
    const shops = await getNearestShops({ x: 100000, y: 200000 });
    expect(shops.length).toBe(3);
  });
});
