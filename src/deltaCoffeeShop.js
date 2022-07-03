/** Contains the deserialized information of a coffee shop + the distance to it relative to current position */
class DeltaCoffeeShop {

  /**
   * Class constructor. Assign arguments and calculate the delta
   * 
   * @param {*} coffeeShop The coffee shop information
   * @param {Number} currentX Current X coordinate
   * @param {Number} currentY Current Y coordinate
   */
  constructor(coffeeShop, currentX, currentY) {
    this._coffeeShop = coffeeShop;
    this._currentX = currentX;
    this._currentY = currentY;
    _delta: 0;
    this.CalculateDelta();
  }

  /** Calculate the distance between the coffee shop position and our current position */
  CalculateDelta() {
    // Get coffee shop coordinates
    const x = this._coffeeShop.x;
    const y = this._coffeeShop.y;

    // Determine the distance between us and the coffee shop
    this.delta = Math.sqrt(
      Math.pow(x - this._currentX, 2) + Math.pow(y - this._currentY, 2)
    );

    // Round to two decimals
    this.delta = parseFloat(this.delta).toFixed(4);
  }

  /** Getter for the delta value */
  get delta() {
    return this._delta;
  }

  /** Setter for the delta value */
  set delta(value) {
    this._delta = value;
  }

  /** Getter for the name of the coffee shop */
  get name() {
    return this._coffeeShop.name;
  }
}

export default DeltaCoffeeShop;
