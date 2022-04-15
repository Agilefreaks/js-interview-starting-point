import { getNearestShops } from './app.js';

const position = {
    lat: process.argv[2],
    lng: process.argv[3]
}

getNearestShops(position);
