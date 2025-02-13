import { getNearestShops } from './app.js';

// Ensure the input is valid before passing to getNearestShops
const x = parseFloat(process.argv[2]);
const y = parseFloat(process.argv[3]);

if (isNaN(x) || isNaN(y)) {
  console.error('Invalid coordinates');
  process.exit(1);
}

const position = { x, y };
getNearestShops(position);
