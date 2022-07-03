import DeltaCoffeeShopList from "./deltaCoffeeShopList.js";

/** A list of delta coffee shops kept in ascending order */
class SortedDeltaCoffeShopList extends DeltaCoffeeShopList {

  /**
   * Class constructor. Convert and store received coffee
   * shops to delta coffee shops and sort them
   * 
   * @param {Array[]} coffeeShop An array of coffee shops
   * @param {Number} currentX Current X coordinate
   * @param {Number} currentY Current Y coordinate
   */
  constructor(coffeeShops, currentX, currentY) {
    // Create a DeltaCoffeeShopList
    super(coffeeShops, currentX, currentY);

    // Sort the internal list
    this._deltaCoffeeShops.sort(function (x, y) {
      return x.delta - y.delta;
    });
  }

  /**
   * Get the closest N coffee shops
   * 
   * @param {Number} n The number of coffee shops to be returned
   * 
   * @returns An array with the closest N coffee shops, containing the name and the delta value
   */
  getNClosestCoffeShops(n) {
    // If received N is too large, return all coffee shops
    if (n >= this._deltaCoffeeShops.length) {
      n = this._deltaCoffeeShops.length;
    }

    // Local vars
    let slicedArray = this._deltaCoffeeShops.slice(0, n);
    let closestCoffeeShops = [];

    // Keep only the name and the delta from the selected coffee shops
    for (let i = 0; i < n; i++) {
      let coffeeShop = {
        name: slicedArray[i].name,
        delta: parseFloat(slicedArray[i].delta),
      };
      closestCoffeeShops.push(coffeeShop);
    }

    return closestCoffeeShops;
  }
}

export default SortedDeltaCoffeShopList;
