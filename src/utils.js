export function calculateDistance(userPosX, userPosY, shopPosX, shopPosY) {
  const distanceX = shopPosX - userPosX;
  const distanceY = shopPosY - userPosY;
  return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
}
