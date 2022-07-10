import { parseInput } from './parseInput.js';
import { printNearestShops } from './coffeeShop.js';
import { Factory } from './factory.js';

// TODO consider adding these as environment variables or config file
const HOST = 'blue-bottle-api-test.herokuapp.com';
const TOKEN_PATH = '/v1/tokens';
const COFFEE_SHOPS_PATH = '/v1/coffee_shops';
const SHOPS_LIMIT = 3;

const input = parseInput(process.argv);

if (input.error !== null) {
    console.error(input.error);
    process.exit(1);
}

const factory = new Factory({
    host: HOST,
    tokenPath: TOKEN_PATH,
    coffeeShopsPath: COFFEE_SHOPS_PATH
});

const getNearestShops = factory.nearestCoffeeShops();

getNearestShops(input.point, SHOPS_LIMIT)
    .then(printNearestShops.bind(null, console.log))
    .catch(console.error);
