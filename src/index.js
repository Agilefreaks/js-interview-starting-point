import getNearestShops from "./app.js";

// Get argument list from command line
const position = process.argv.slice(2);

let input = {
  x: Number(position[0]),
  y: Number(position[1]),
};

getNearestShops(input)
  .then((results) => {
    results.forEach((result) => {
      console.log(`${result.shop}, ${result.distance}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
