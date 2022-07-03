import DeltaCoffeeShop from "./deltaCoffeeShop.js";

/** A list of delta coffee shops. Defined for extension purposes */
class DeltaCoffeeShopList {

  /**
   * Class constructor. Convert and store received coffee shops to delta coffee shops
   * 
   * @param {Array[]} coffeeShop An array of coffee shops
   * @param {Number} currentX Current X coordinate
   * @param {Number} currentY Current Y coordinate
   */
  constructor(coffeeShops, currentX, currentY) {
    this._deltaCoffeeShops = [];
    this._currentX = currentX;
    this._currentY = currentY;

    for (let i = 0; i < coffeeShops.length; i++) {
      const deltaCoffeeShop = new DeltaCoffeeShop(
        coffeeShops[i],
        currentX,
        currentY
      );
      this._deltaCoffeeShops.push(deltaCoffeeShop);
    }
  }
}

export default DeltaCoffeeShopList;
