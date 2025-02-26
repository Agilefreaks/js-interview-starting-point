import { getNearestShops } from './app.js';

async function main() {
    const x = process.argv[2];
    const y = process.argv[3];

    if (x === undefined || y === undefined) {
        console.error(
            'Usage: yarn start <user x coordinate> <user y coordinate>',
        );
        process.exit(1);
    }

    await getNearestShops({ x, y });
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
