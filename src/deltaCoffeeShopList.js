import DeltaCoffeeShop from "./deltaCoffeeShop.js";

class DeltaCoffeeShopList {
  constructor(coffeeShops, currentX, currentY) {
    this._deltaCoffeeShops = [];
    this._currentX = currentX;
    this._currentY = currentY;

    for (let i = 0; i < coffeeShops.length; i++) {
      let deltaCoffeeShop = new DeltaCoffeeShop(
        coffeeShops[i],
        currentX,
        currentY
      );
      this._deltaCoffeeShops.push(deltaCoffeeShop);
    }
  }
}

export default DeltaCoffeeShopList;
