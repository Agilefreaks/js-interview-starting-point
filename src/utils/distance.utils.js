export const isValidPosition = (position) => {
  return !(isNaN(position.x) || isNaN(position.y))
}

export const getSquaredEuclideanDistance = (origin, destination) => {
  if (!isValidPosition(origin) || !isValidPosition(destination)) {
    throw new Error('invalid position')
  }

  return Number(
    Math.pow(Math.abs(Number(destination.x) - Number(origin.x)), 2) +
      Math.pow(Math.abs(Number(destination.y) - Number(origin.y)), 2)
  )
}
