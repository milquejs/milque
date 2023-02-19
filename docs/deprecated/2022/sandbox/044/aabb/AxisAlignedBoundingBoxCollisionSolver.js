import {
  intersectAxisAlignedBoundingBox,
  sweepInto,
} from './AxisAlignedBoundingBoxIntersectionSolver.js';
import { QuadTree } from './QuadTree.js';

/**
 * @typedef CollisionResult
 * @property {import('./AxisAlignedBoundingBoxIntersectionSolver.js').AxisAlignedBoundingBox} target
 * @property {import('./AxisAlignedBoundingBoxIntersectionSolver.js').AxisAlignedBoundingBox} other
 * @property {import('./AxisAlignedBoundingBoxIntersectionSolver.js').HitResult} hit
 * @property {import('./AxisAlignedBoundingBoxIntersectionSolver.js').SweepResult} [sweep=null]
 */

/**
 * @typedef {Array<Number>} SweepVector
 *
 * @callback SweepVectorCallback
 * @param {import('./AxisAlignedBoundingBoxIntersectionSolver.js').AxisAlignedBoundingBox} box
 * @returns {SweepVector}
 */

/**
 * @param {import('./AxisAlignedBoundingBoxIntersectionSolver.js').AxisAlignedBoundingBox} target
 * @param {import('./AxisAlignedBoundingBoxIntersectionSolver.js').AxisAlignedBoundingBox} other
 * @param {import('./AxisAlignedBoundingBoxIntersectionSolver.js').HitResult} hit
 * @param {import('./AxisAlignedBoundingBoxIntersectionSolver.js').SweepResult} sweep
 * @returns {CollisionResult}
 */
function createCollisionResult(target, other, hit, sweep) {
  return {
    target,
    other,
    hit,
    sweep,
  };
}

/** @type {SweepVectorCallback} */
function defaultSweepVectorCallback(box) {
  return box;
}

/**
 * Solves the current graph for collisions.
 *
 * @param {Array<Object>} boxes A list of all boxes.
 * @param {Array<Object>} [targets=boxes] A list of active target to solve
 * for. If undefined, it will solve collisions using all boxes as active targets.
 * This can be used to prune box collisions that are not relevant, or "active".
 * @param {Object} [opts] Any additional options.
 * @param {QuadTree} [opts.quadTree] The quad tree to use for partitioning.
 * @param {SweepVectorCallback} [opts.sweepVectorCallback] The callback to get the sweep vector for a target box.
 * @param {Function} [opts.filter]
 * @returns {Array<CollisionResult>} The collisions found in the current graph.
 */
export function solveCollisions(boxes, targets = boxes, opts = {}) {
  const {
    quadTree = new QuadTree(),
    sweepVectorCallback = defaultSweepVectorCallback,
    filter,
  } = opts;

  quadTree.clear();
  quadTree.insertAll(boxes);

  let result = [];
  let others = [];
  for (let target of targets) {
    quadTree.retrieve(target, others);

    let sweepVector = sweepVectorCallback(target);
    if (sweepVector) {
      if (filter) {
        others = others.filter((value) => filter(target, value));
      }
      let dx = sweepVector[0] || 0;
      let dy = sweepVector[1] || 0;
      let sweep = sweepInto(target, dx, dy, others);
      if (sweep.hit) {
        result.push(
          createCollisionResult(target, sweep.other, sweep.hit, sweep)
        );
      }
    } else {
      for (let other of others) {
        if (!filter || filter(target, other)) {
          let hit = intersectAxisAlignedBoundingBox(target, other);
          if (hit) {
            result.push(createCollisionResult(target, other, hit, null));
          }
        }
      }
    }
    others.length = 0;
  }
  return result;
}
