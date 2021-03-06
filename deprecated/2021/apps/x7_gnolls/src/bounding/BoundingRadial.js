import { BoundingShape } from './BoundingShape.js';

/**
 * @typedef {import('./BoundingShape.js').BoundingShapeLike} BoundingShapeLike
 * 
 * @typedef {BoundingShapeLike} BoundingRadialLike
 * @property {number} x
 * @property {number} y
 * @property {number} r
 */

export class BoundingRadial extends BoundingShape
{
    constructor(x, y, r)
    {
        super('radial');
        
        this.x = x;
        this.y = y;
        this.r = r;
    }
}
