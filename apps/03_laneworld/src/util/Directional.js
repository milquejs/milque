import { assert } from './assert.js';

const OPPOSITE_DIRECTIONAL_ENCODING_OFFSET = 4;
const CLOCKWISE_ORTHOGONAL_DIRECTIONAL_ENCODING_OFFSET = 2;

export const DIRECTIONAL_ENCODING_BITS = 8;
export const DIRECTIONAL_ENCODING = {
  EAST: 1 << 0,
  NORTHEAST: 1 << 1,
  NORTH: 1 << 2,
  NORTHWEST: 1 << 3,
  WEST: 1 << 4,
  SOUTHWEST: 1 << 5,
  SOUTH: 1 << 6,
  SOUTHEAST: 1 << 7,
};
export const DIRECTIONAL_ENCODING_VALUES = Object.values(DIRECTIONAL_ENCODING);
export const DIRECTIONAL_ENCODING_NULL = 0;

export function isDirectionalEncoding(encoding) {
  return (
    Number.isInteger(encoding) &&
    encoding > 0 &&
    encoding <= DIRECTIONAL_ENCODING.SOUTHEAST
  );
}

export function randomSingleDirectionalEncoding() {
  return 0x1 << Math.floor(Math.random() * DIRECTIONAL_ENCODING_BITS);
}

export function oppositeDirectionalEncoding(encoding) {
  return (0xf0 & (encoding << 4)) | (0x0f & (encoding >> 4));
}

export function rotateDirectionalEncoding(encoding, clockwiseTurns = 1) {
  clockwiseTurns = clockwiseTurns % DIRECTIONAL_ENCODING_BITS;
  if (clockwiseTurns < 0) {
    // Invert it.
    clockwiseTurns = DIRECTIONAL_ENCODING_BITS + clockwiseTurns;
  }
  let otherBits = DIRECTIONAL_ENCODING_BITS - clockwiseTurns;
  return (0xf0 & (encoding << otherBits)) | (encoding >> clockwiseTurns);
}

export function getDirectionalBitArrayFromEncoding(encoding) {
  return [
    (encoding >> 0) & 0x1,
    (encoding >> 1) & 0x1,
    (encoding >> 2) & 0x1,
    (encoding >> 3) & 0x1,
    (encoding >> 4) & 0x1,
    (encoding >> 5) & 0x1,
    (encoding >> 6) & 0x1,
    (encoding >> 7) & 0x1,
  ];
}

export function getDirectionalEncodingFromBitArray(
  ee,
  ne,
  nn,
  nw,
  ww,
  sw,
  ss,
  se
) {
  return (
    (ee << 0) |
    (ne << 1) |
    (nn << 2) |
    (nw << 3) |
    (ww << 4) |
    (sw << 5) |
    (ss << 6) |
    (se << 7)
  );
}

export function getDirectionalVectorFromEncoding(encoding) {
  switch (encoding) {
    case DIRECTIONAL_ENCODING.EAST:
      return [1, 0];
    case DIRECTIONAL_ENCODING.NORTHEAST:
      return [1, -1];
    case DIRECTIONAL_ENCODING.NORTH:
      return [0, -1];
    case DIRECTIONAL_ENCODING.NORTHWEST:
      return [-1, -1];
    case DIRECTIONAL_ENCODING.WEST:
      return [-1, 0];
    case DIRECTIONAL_ENCODING.SOUTHWEST:
      return [-1, 1];
    case DIRECTIONAL_ENCODING.SOUTH:
      return [0, 1];
    case DIRECTIONAL_ENCODING.SOUTHEAST:
      return [1, 1];
    case DIRECTIONAL_ENCODING_NULL:
      throw new Error('Cannot get delta vector from null encoding.');
    default:
      throw new Error(
        'Cannot get delta vector from multi-directional encoding.'
      );
  }
}

export function getDirectionalEncodingFromVector(dx, dy) {
  if (dx === 0 && dy === 0) return 0;
  let px = dx > 0;
  let py = dy > 0;
  let nx = dx < 0;
  let ny = dy < 0;
  let zx = !px && !nx;
  let zy = !py && !ny;
  return (
    ((px && zy ? 1 : 0) << 0) | // East
    ((px && ny ? 1 : 0) << 1) | // North East
    ((zx && ny ? 1 : 0) << 2) | // North
    ((nx && ny ? 1 : 0) << 3) | // North West
    ((nx && zy ? 1 : 0) << 4) | // West
    ((nx && py ? 1 : 0) << 5) | // Sout West
    ((zx && py ? 1 : 0) << 6) | // South
    ((px && py ? 1 : 0) << 7)
  ); // South East
}

export function getOppositeDirectionIndex(directionIndex) {
  return (
    (directionIndex + OPPOSITE_DIRECTIONAL_ENCODING_OFFSET) %
    DIRECTIONAL_ENCODING_BITS
  );
}

export function getClockwiseOrthogonalDirectionIndex(directionIndex) {
  return (
    (directionIndex + CLOCKWISE_ORTHOGONAL_DIRECTIONAL_ENCODING_OFFSET) %
    DIRECTIONAL_ENCODING_BITS
  );
}

export function test() {
  testBitArrayConversion();
  testVectorConversion();
  testRotate();
  testOpposite();
}

function testBitArrayConversion() {
  // Cardinal
  let encoding = getDirectionalEncodingFromBitArray(1, 0, 1, 0, 1, 0, 1, 0);
  let dirs = getDirectionalBitArrayFromEncoding(encoding);
  assert(
    dirs[0] === 1 &&
      dirs[1] === 0 &&
      dirs[2] === 1 &&
      dirs[3] === 0 &&
      dirs[4] === 1 &&
      dirs[5] === 0 &&
      dirs[6] === 1 &&
      dirs[7] === 0
  );
  // Inter-Cardinal
  encoding = getDirectionalEncodingFromBitArray(0, 1, 0, 1, 0, 1, 0, 1);
  dirs = getDirectionalBitArrayFromEncoding(encoding);
  assert(
    dirs[0] === 0 &&
      dirs[1] === 1 &&
      dirs[2] === 0 &&
      dirs[3] === 1 &&
      dirs[4] === 0 &&
      dirs[5] === 1 &&
      dirs[6] === 0 &&
      dirs[7] === 1
  );
}

function testVectorConversion() {
  let encoding = getDirectionalEncodingFromVector(0, 1);
  assert(encoding === DIRECTIONAL_ENCODING.SOUTH);

  let [dx, dy] = getDirectionalVectorFromEncoding(
    DIRECTIONAL_ENCODING.NORTHEAST
  );
  assert(dx === 1 && dy === -1);
}

function testRotate() {
  assert(
    rotateDirectionalEncoding(DIRECTIONAL_ENCODING.SOUTHWEST, 1) ===
      DIRECTIONAL_ENCODING.WEST
  );
  assert(
    rotateDirectionalEncoding(DIRECTIONAL_ENCODING.EAST, 1) ===
      DIRECTIONAL_ENCODING.SOUTHEAST
  );
  assert(
    rotateDirectionalEncoding(DIRECTIONAL_ENCODING.SOUTHEAST, 1) ===
      DIRECTIONAL_ENCODING.SOUTH
  );

  assert(
    rotateDirectionalEncoding(DIRECTIONAL_ENCODING.SOUTHWEST, 9) ===
      DIRECTIONAL_ENCODING.WEST
  );
  assert(
    rotateDirectionalEncoding(DIRECTIONAL_ENCODING.SOUTHWEST, 8) ===
      DIRECTIONAL_ENCODING.SOUTHWEST
  );
  assert(
    rotateDirectionalEncoding(DIRECTIONAL_ENCODING.SOUTHWEST, -1) ===
      DIRECTIONAL_ENCODING.SOUTH
  );
}

function testOpposite() {
  assert(
    oppositeDirectionalEncoding(DIRECTIONAL_ENCODING.NORTHWEST) ===
      DIRECTIONAL_ENCODING.SOUTHEAST
  );
  assert(
    oppositeDirectionalEncoding(DIRECTIONAL_ENCODING.WEST) ===
      DIRECTIONAL_ENCODING.EAST
  );
}
