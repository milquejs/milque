import { createHitResult } from './IntersectionHelper.js';

/**
 * @typedef {import('../bounding/BoundingRadial.js').BoundingRadialLike} BoundingRadialLike
 * @typedef {import('./IntersectionHelper.js').HitResult} HitResult
 */

/**
 * @param {BoundingRadialLike} a The bounding radial to test against.
 * @param {number} x The center x position of the bounding radial.
 * @param {number} y The center y position of the bounding radial.
 * @param {number} y The radius of the bounding radial.
 * @returns {HitResult|null} The hit result info, or null if not intersecting.
 */
export function intersectBoundingRadial(a, x, y, r)
{
    let dr = a.r + r;
    let dx = Math.abs(a.x - x);
    let dy = Math.abs(a.y - y);
    let distSqu = dx * dx + dy * dy;
    let radiiSqu = dr * dr;
    if (distSqu <= radiiSqu)
    {
        return createHitResult(0, 0, 0, 0, 0, 0, 0);
    }
    else
    {
        return null;
    }
}
