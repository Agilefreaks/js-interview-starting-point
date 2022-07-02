import { getNearestShops } from "./app.js";

// Get command arguments
const args = process.argv.slice(2);

// Check if we received enough arguments. Extra arguments will be ignored
if (args.length < 3) {
  console.log("Invalid input: two arguments required");
  process.exit(1);
}

// Check if we received numbers as arguments
if (isNaN(args[1]) || isNaN(args[2])) {
  console.log("Invalid input: numbers expected");
  process.exit(1);
}

const position = { x: args[1], y: args[2] };
getNearestShops(position);
