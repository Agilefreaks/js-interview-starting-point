class DeltaCoffeeShop {
  constructor(coffeeShop, currentX, currentY) {
    this._coffeeShop = coffeeShop;
    this._currentX = currentX;
    this._currentY = currentY;
    _delta: 0;
    this.CalculateDelta();
  }

  CalculateDelta() {
    const x = this._coffeeShop.x;
    const y = this._coffeeShop.y;

    this.delta = Math.sqrt(
      Math.pow(x - this._currentX, 2) + Math.pow(y - this._currentY, 2)
    );

    this.delta = parseFloat(this.delta).toFixed(2);
  }

  get delta() {
    return this._delta;
  }

  set delta(value) {
    this._delta = value;
  }

  get name() {
    return this._coffeeShop.name;
  }
}

export default DeltaCoffeeShop;
