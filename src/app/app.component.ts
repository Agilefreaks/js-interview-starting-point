import { Component, OnInit } from '@angular/core';
import { CoffeeShopsService } from './services/coffeeShops.service';
import { retry, switchMap } from 'rxjs';
import { CoffeeShopModel } from './models/coffeeShop.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  coffeeShops = new Array<CoffeeShopModel>();
  coordinatesFormControl = new FormGroup({
    xCoordinate: new FormControl([], Validators.required),
    yCoordinate: new FormControl([], Validators.required)
  });

  constructor(private coffeeShop: CoffeeShopsService) {
  }

  ngOnInit(): void {
    this.getCoffeeShops();
  }

  getCoffeeShops(): void {
    this.coffeeShop.getToken().pipe(
      switchMap((result: any) => {
        return this.coffeeShop.getCoffeeShops(result.token);
      }), retry(5)).subscribe(result => this.coffeeShops = result);

  }

  getNearbyCS(): void {
    const userLocation = { x: this.coordinatesFormControl.value.xCoordinate, y: this.coordinatesFormControl.value.yCoordinate };
    for (let coffeeShop of this.coffeeShops) {
      coffeeShop.distanceFromUser = Number(this.distance({ x: coffeeShop.x, y: coffeeShop.y }, userLocation));
    }
    this.coffeeShops.sort((a: CoffeeShopModel, b: CoffeeShopModel): number => a.distanceFromUser - b.distanceFromUser);
    this.coffeeShops = this.coffeeShops.slice(0, 3);
  }

  distance(coffeeShop: { x: number, y: number }, userLocation: { x: number, y: number }) {
    const deltaX = this.diff(coffeeShop.x, userLocation.x);
    const deltaY = this.diff(coffeeShop.y, userLocation.y);
    const dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)).toFixed(4);
    return (dist);
  };

  diff(num1: number, num2: number): number {
    return num1 > num2 ? num1 - num2 : num2 - num1;
  };
}
