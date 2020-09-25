import { Collidable } from './Collidable.js';
import { CollisionMask } from './CollisionMask.js';
import { Transform } from './Transform.js';
import { Motion } from './Motion.js';

import { solveCollisions } from '../aabb/AxisAlignedBoundingBoxCollisionSolver.js';

export class CollisionSystem
{
    constructor(entityManager)
    {
        this.entityManager = entityManager;
    }

    update(dt)
    {
        const { entityManager } = this;

        let boxes = new Map();
        let targets = new Map();

        for(let entityId of entityManager.getComponentEntityIds(CollisionMask))
        {
            const collisionMask = entityManager.get(CollisionMask, entityId);
            if (collisionMask.shapeType === 'aabb')
            {
                let shape = collisionMask.shape;
                if (entityManager.has(Transform, entityId))
                {
                    let transform = entityManager.get(Transform, entityId);
                    shape.x = transform.x + collisionMask.offsetX;
                    shape.y = transform.y + collisionMask.offsetY;
                }
                if (entityManager.has(Collidable, entityId))
                {
                    let collidable = entityManager.get(Collidable, entityId);
                    collidable.collisions.length = 0;
                    targets.set(shape, entityId);
                }
                boxes.set(shape, entityId);
            }
        }

        let collisions = solveCollisions(boxes.keys(), targets.keys(), {
            // Use sweep for any entity with motion...
            sweepVectorCallback(box)
            {
                let entityId = boxes.get(box);
                if (entityManager.has(Motion, entityId))
                {
                    let motion = entityManager.get(Motion, entityId);
                    return [motion.motionX, motion.motionY];
                }
                else
                {
                    return null;
                }
            }
        });

        for(let collision of collisions)
        {
            let { target, other, hit } = collision;
            let targetId = boxes.get(target);
            let otherId = boxes.get(other);

            // Update Collidable collisions...
            let collidable = entityManager.get(Collidable, targetId);
            collidable.collisions.push(collision);
            
            if (entityManager.has(Collidable, otherId))
            {
                let otherCollidable = entityManager.get(Collidable, otherId);
                otherCollidable.collisions.push(collision);
            }

            // Resolve Motion for collisions...
            if (entityManager.has(Motion, targetId) && entityManager.has(Transform, targetId))
            {
                let otherCollisionMask = entityManager.get(CollisionMask, otherId);
                if (otherCollisionMask.solid)
                {
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

    render(ctx)
    {
        const { entityManager } = this;
        for(let entityId of entityManager.getComponentEntityIds(CollisionMask))
        {
            const collisionMask = entityManager.get(CollisionMask, entityId);
            if (collisionMask.shapeType === 'aabb')
            {
                const { x, y, rx, ry } = collisionMask.shape;
                ctx.strokeStyle = 'limegreen';
                if (entityManager.has(Collidable, entityId))
                {
                    let collidable = entityManager.get(Collidable, entityId);
                    if (collidable.collisions.length > 0)
                    {
                        ctx.strokeStyle = 'red';
                    }
                }
                ctx.strokeRect(x - rx, y - ry, rx * 2, ry * 2);
            }
        }
    }
}
