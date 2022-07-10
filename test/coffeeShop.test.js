import { shopDistanceTo, printNearestShops } from '../src/coffeeShop.js';

describe('coffeeShop.js', () => {

    describe('shopDistanceTo()', () => {
        it('calculates distance between two points', () => {
            let calcDistance = shopDistanceTo({ x: -2, y: 0 });
            expect(calcDistance({ x: 2, y: 0 })).toEqual({
                point: { x: -2, y: 0 },
                shop: { x: 2, y: 0 },
                distance: 4
            });

            calcDistance = shopDistanceTo({ x: 0, y: -2 });
            expect(calcDistance({ x: 0, y: 2 })).toEqual({
                point: { x: 0, y: -2 },
                shop: { x: 0, y: 2 },
                distance: 4
            });

            calcDistance = shopDistanceTo({ x: -1, y: -2 });
            expect(calcDistance({ x: 2, y: 2 })).toEqual({
                point: { x: -1, y: -2 },
                shop: { x: 2, y: 2 },
                distance: 5
            });
        });
    });

    describe('printNearestShops()', () => {
        it('prints name and distance rounded to four decimal places', () => {
            const print = jest.fn();
            printNearestShops(print, [
                { shop: { name: 'shop1' }, distance: 0.023456 },
                { shop: { name: 'shop2' }, distance: 12.023456 }
            ]);
            expect(print).toHaveBeenNthCalledWith(1, 'shop1, 0.0235');
            expect(print).toHaveBeenNthCalledWith(2, 'shop2, 12.0235');
        });
    });
});