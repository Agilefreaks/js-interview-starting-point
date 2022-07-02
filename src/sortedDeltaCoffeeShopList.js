import DeltaCoffeeShopList from "./deltaCoffeeShopList.js";

// In ascending order
class SortedDeltaCoffeShopList extends DeltaCoffeeShopList {
  constructor(coffeeShops, currentX, currentY) {
    super(coffeeShops, currentX, currentY);

    this._deltaCoffeeShops.sort(function (x, y) {
      return x.delta - y.delta;
    });
  }

  getNClosestCoffeShops(n) {
    if (n >= this._deltaCoffeeShops.length) {
      n = this._deltaCoffeeShops.length;
    }

    let slicedArray = this._deltaCoffeeShops.slice(0, n);
    let closestCoffeeShops = [];
    for (let i = 0; i < n; i++) {
      let coffeeShop = {
        name: slicedArray[i].name,
        delta: slicedArray[i].delta,
      };

      closestCoffeeShops.push(coffeeShop);
    }

    return closestCoffeeShops;
  }
}

export default SortedDeltaCoffeShopList;
