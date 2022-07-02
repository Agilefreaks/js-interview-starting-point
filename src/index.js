import { getNearestShops } from './app.js';

// Get command arguments
const args = process.argv.slice(2);
const position = { x: args[1], y: args[2] };
getNearestShops(position);
