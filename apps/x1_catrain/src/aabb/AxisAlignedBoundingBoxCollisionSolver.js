import { intersectAxisAlignedBoundingBox, sweepInto } from './AxisAlignedBoundingBoxIntersectionSolver.js';
import { QuadTree } from './QuadTree.js';

/**
 * @typedef CollisionResult
 * @property {import('./AxisAlignedBoundingBoxIntersectionSolver.js').AxisAlignedBoundingBox} target 
 * @property {import('./AxisAlignedBoundingBoxIntersectionSolver.js').AxisAlignedBoundingBox} other 
 * @property {import('./AxisAlignedBoundingBoxIntersectionSolver.js').HitResult} hit 
 */

/**
 * @typedef MotionValues
 * @property {Number} dx
 * @property {Number} dy
 * 
 * @callback MotionCallback
 * @param {import('./AxisAlignedBoundingBoxIntersectionSolver.js').AxisAlignedBoundingBox} box
 * @returns {MotionValues}
 */

/**
 * @param {import('./AxisAlignedBoundingBoxIntersectionSolver.js').AxisAlignedBoundingBox} target 
 * @param {import('./AxisAlignedBoundingBoxIntersectionSolver.js').AxisAlignedBoundingBox} other 
 * @param {import('./AxisAlignedBoundingBoxIntersectionSolver.js').HitResult} hit 
 * @returns {CollisionResult}
 */
function createCollisionResult(target, other, hit)
{
    return {
        target,
        other,
        hit,
    };
}

/** @type {MotionCallback} */
function defaultMotionCallback(box) { return box; }

/**
 * Solves the current graph for collisions.
 * 
 * @param {Array<Object>} boxes A list of all boxes.
 * @param {Array<Object>} [targets=boxes] A list of active target to solve
 * for. If undefined, it will solve collisions using all boxes as active targets.
 * This can be used to prune box collisions that are not relevant, or "active".
 * @param {QuadTree} [opts.quadTree] The quad tree to use for partitioning.
 * @param {MotionCallback} [opts.motionCallback] The callback to get the motion values for a target box.
 * @returns {Array<CollisionResult>} The collisions found in the current graph.
 */
export function solveCollisions(boxes, targets = boxes, opts = {})
{
    const {
        quadTree = new QuadTree(),
        motionCallback = defaultMotionCallback
    } = opts;

    let result = [];
    quadTree.clear();
    quadTree.insertAll(boxes);

    let dx;
    let dy;
    let others = [];
    for(let target of targets)
    {
        quadTree.retrieve(target, others);

        let motionValues = motionCallback(target);
        if (motionValues)
        {
            dx = motionValues.dx || 0;
            dy = motionValues.dy || 0;
        }
        else
        {
            dx = 0;
            dy = 0;
        }

        if (dx || dy)
        {
            let sweep = sweepInto(target, dx, dy, others);
            if (sweep.time < 1)
            {
                result.push(createCollisionResult(target, other, sweep.hit));
            }
        }
        else
        {
            for(let other of others)
            {
                let hit = intersectAxisAlignedBoundingBox(target, other);
                if (hit)
                {
                    result.push(createCollisionResult(target, other, hit));
                }
            }
        }
        others.length = 0;
    }
    return result;
}
