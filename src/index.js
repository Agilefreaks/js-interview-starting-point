import { getNearestShops } from "./app.js";

async function main() {
  const userX = parseFloat(process.argv[2]);
  const userY = parseFloat(process.argv[3]);

  if (isNaN(userX) || isNaN(userY)) {
    console.error("Invalid coordinates. Please provide numbers.");
    return;
  }

  const nearestShops = await getNearestShops({ x: userX, y: userY });

  if (nearestShops && nearestShops.length > 0) {
    nearestShops.forEach((shop) => {
      console.log(`${shop.name}, ${shop.distance}`);
    });
  } else {
    console.log("No coffee shops found near you.");
  }
}

main();
