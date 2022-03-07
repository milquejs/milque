import { Collidable } from './Collidable.js';
import { CollisionMask } from './CollisionMask.js';
import { Transform } from './Transform.js';
import { Motion } from './Motion.js';

import { solveCollisions } from '../aabb/AxisAlignedBoundingBoxCollisionSolver.js';

export class CollisionSystem {
  constructor(entityManager) {
    /** @type {import('../entity/EntityManager.js').EntityManager} */
    this.entityManager = entityManager;
  }

  update(dt) {
    const { entityManager } = this;

    let boxes = new Map();
    let masks = new Map();
    let targets = new Map();

    for (let [entityId, collisionMasks] of entityManager
      .getComponentFactory(CollisionMask)
      .entries()) {
      for (let collisionMask of collisionMasks) {
        if (collisionMask.shapeType === 'aabb') {
          let shape = collisionMask.shape;
          if (entityManager.has(Transform, entityId)) {
            let transform = entityManager.get(Transform, entityId);
            shape.x = transform.x + collisionMask.offsetX;
            shape.y = transform.y + collisionMask.offsetY;
          }
          if (entityManager.has(Collidable, entityId)) {
            let collidable = entityManager.get(Collidable, entityId);
            collidable.collisions.length = 0;
            targets.set(shape, entityId);
          }
          boxes.set(shape, entityId);
          masks.set(shape, collisionMask);
        }
      }
    }

    let collisions = solveCollisions(boxes.keys(), targets.keys(), {
      // Use sweep for any entity with motion...
      sweepVectorCallback(box) {
        let entityId = boxes.get(box);
        if (entityManager.has(Motion, entityId)) {
          let motion = entityManager.get(Motion, entityId);
          return [motion.motionX, motion.motionY];
        } else {
          return null;
        }
      },
      filter(target, other) {
        let targetId = boxes.get(target);
        let otherId = boxes.get(other);
        return targetId !== otherId;
      },
    });

    for (let collision of collisions) {
      let { target, other } = collision;
      let targetId = boxes.get(target);
      let collisionMask = masks.get(target);
      let otherCollisionMask = masks.get(other);

      // Update Collidable collisions...
      let collidable = entityManager.get(Collidable, targetId);
      collidable.collisions.push(collision);

      // Resolve Motion for collisions...
      if (!collisionMask.trigger) {
        if (
          entityManager.has(Motion, targetId) &&
          entityManager.has(Transform, targetId)
        ) {
          if (otherCollisionMask.solid) {
            let motion = entityManager.get(Motion, targetId);
            let transform = entityManager.get(Transform, targetId);
            // Every entity that has Motion will be using sweep test.
            transform.x = collision.sweep.x;
            transform.y = collision.sweep.y;
            motion.motionX = collision.sweep.dx;
            motion.motionY = collision.sweep.dy;
          }
        }
      }
    }
  }

  render(ctx) {
    const { entityManager } = this;
    for (let [entityId, collisionMasks] of entityManager
      .getComponentFactory(CollisionMask)
      .entries()) {
      for (let collisionMask of collisionMasks) {
        const { shapeType, shape } = collisionMask;
        if (shapeType === 'aabb') {
          const { x, y, rx, ry } = shape;
          ctx.strokeStyle = 'limegreen';
          if (entityManager.has(Collidable, entityId)) {
            let collidable = entityManager.get(Collidable, entityId);
            if (collidable.collisions.length > 0) {
              ctx.strokeStyle = 'red';
            }
          }
          ctx.strokeRect(x - rx, y - ry, rx * 2, ry * 2);
        }
      }
    }
  }
}
