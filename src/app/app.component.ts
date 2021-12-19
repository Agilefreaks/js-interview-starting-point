import { Component, OnInit } from '@angular/core';
import { CoffeeShopsService } from './services/coffeeShops.service';
import {  retry, switchMap } from 'rxjs';
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
    for (let coffeeShop of this.coffeeShops) {
      coffeeShop.distanceFromUser = Number(this.distance(this.coordinatesFormControl.value.xCoordinate, this.coordinatesFormControl.value.yCoordinate,
        Number(coffeeShop.x), Number(coffeeShop.y)));
    }
    this.coffeeShops.sort((a: CoffeeShopModel, b: CoffeeShopModel): number => a.distanceFromUser - b.distanceFromUser);
    this.coffeeShops = this.coffeeShops.slice(0, 3);
  }

  distance(x1: number, y1: number, x2: number, y2: number) {
    const deltaX = this.diff(x1, x2);
    const deltaY = this.diff(y1, y2);
    const dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)).toFixed(4);
    return (dist);
  };

  diff(num1: any, num2: any) {
    if (num1 > num2) {
      return (num1 - num2);
    } else {
      return (num2 - num1);
    }
  };
}
