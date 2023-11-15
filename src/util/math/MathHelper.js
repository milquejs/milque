/**
 * @param {number} a 
 * @param {number} b 
 * @param {number} t
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * @param {number} value 
 * @param {number} min
 * @param {number} max
 */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * @param {number} value 
 * @param {number} min
 * @param {number} max
 */
export function cycle(value, min, max) {
  let range = max - min;
  let result = (value - min) % range;
  if (result < 0) result += range;
  return result + min;
}

/**
 * @param {number} fromX 
 * @param {number} fromY 
 * @param {number} toX 
 * @param {number} toY 
 * @param {number} radius 
 */
export function withinRadius(fromX, fromY, toX, toY, radius) {
  const dx = fromX - toX;
  const dy = fromY - toY;
  return dx * dx + dy * dy <= radius * radius;
}

/**
 * @param {number} fromX 
 * @param {number} fromY 
 * @param {number} toX 
 * @param {number} toY 
 */
export function distance2(fromX, fromY, toX, toY) {
  let dx = toX - fromX;
  let dy = toY - fromY;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * @param {number} fromX 
 * @param {number} fromY 
 * @param {number} toX 
 * @param {number} toY 
 */
export function direction2(fromX, fromY, toX, toY) {
  let dx = toX - fromX;
  let dy = toY - fromY;
  return Math.atan2(dy, dx);
}

/**
 * @param {number} radians 
 * @param {number} target 
 * @param {number} dt
 */
export function lookAt2(radians, target, dt) {
  let step = cycle(target - radians, -Math.PI, Math.PI);
  return clamp(radians + step, radians - dt, radians + dt);
}

const TO_RAD_FACTOR = Math.PI / 180;
const TO_DEG_FACTOR = 180 / Math.PI;

/**
 * @param {number} degrees
 */
export function toRadians(degrees) {
  return degrees * TO_RAD_FACTOR;
}

/**
 * @param {number} radians
 */
export function toDegrees(radians) {
  return radians * TO_DEG_FACTOR;
}
