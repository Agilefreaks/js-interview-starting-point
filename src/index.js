import { getNearestShops } from "./app.js";
import errorCodes from "./errorcodes.js"

// Get command arguments
const args = process.argv.slice(2);

// Check if we received enough arguments. Extra arguments will be ignored
if (args.length < 3) {
  console.log("Invalid input: two arguments required");
  process.exit(errorCodes.INVALID_INPUT_ARGS_NB);
}

// Check if we received numbers as arguments
if (isNaN(args[1]) || isNaN(args[2])) {
  console.log("Invalid input: numbers expected");
  process.exit(errorCodes.INVALID_INPUT_ARGS_NAN);
}

const position = { x: args[1], y: args[2] };
getNearestShops(position);
