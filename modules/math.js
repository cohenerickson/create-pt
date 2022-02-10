export function angleDeg (vector1, vector2) {
  return Math.atan2(vector2.y - vector1.y, vector2.x - vector1.x) * 180 / Math.PI;
}