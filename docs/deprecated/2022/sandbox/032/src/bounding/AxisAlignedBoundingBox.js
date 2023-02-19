import { BoundingShape } from './BoundingShape.js';

/**
 * @typedef {import('./BoundingShape.js').BoundingShapeLike} BoundingShapeLike
 *
 * @typedef {BoundingShapeLike} AxisAlignedBoundingBoxLike
 * @property {number} x
 * @property {number} y
 * @property {number} rx
 * @property {number} ry
 */

export class AxisAlignedBoundingBox extends BoundingShape {
  static fromBounds(fromX, fromY, toX, toY) {
    let width = Math.abs(toX - fromX);
    let height = Math.abs(toY - fromY);
    let halfWidth = width * 0.5;
    let halfHeight = height * 0.5;
    return new AxisAlignedBoundingBox(
      fromX + halfWidth,
      fromY + halfHeight,
      halfWidth,
      halfHeight
    );
  }

  constructor(x, y, rx, ry) {
    super('aabb');

    this.x = x;
    this.y = y;
    this.rx = rx;
    this.ry = ry;
  }
}
