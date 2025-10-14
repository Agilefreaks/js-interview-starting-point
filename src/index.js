import { getNearestShops } from '#app'
import { isValidPosition } from '#utils/distance.utils'

function main(params) {
  const position = {
    x: process.argv[2],
    y: process.argv[3],
  }

  if (!isValidPosition(position)) {
    console.log('Please provide valid x and y coordinates')
    return
  }

  getNearestShops(position)
}

main()
