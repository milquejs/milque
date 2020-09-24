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
                if (entityManager.has(Motion, entityId))
                {
                    let motion = entityManager.get(Motion, entityId);
                    shape.dx = motion.motionX;
                    shape.dy = motion.motionY;
                }
                if (entityManager.has(Collidable, entityId))
                {
                    let collidable = entityManager.get(Collidable, entityId);
                    collidable.collision = null;
                    targets.set(shape, entityId);
                }
                boxes.set(shape, entityId);
            }
        }

        let collisions = solveCollisions(boxes.keys(), targets.keys());
        for(let collision of collisions)
        {
            let { target, other, hit } = collision;
            let targetId = boxes.get(target);
            let otherId = boxes.get(other);

            let collidable = entityManager.get(Collidable, targetId);
            collidable.collision = collision;
            
            if (entityManager.has(Collidable, otherId))
            {
                let otherCollidable = entityManager.get(Collidable, otherId);
                otherCollidable.collision = collision;
            }

            if (entityManager.has(Motion, targetId) && entityManager.has(Transform, targetId))
            {
                let otherCollisionMask = entityManager.get(CollisionMask, otherId);
                if (otherCollisionMask.solid)
                {
                    let motion = entityManager.get(Motion, targetId);
                    let transform = entityManager.get(Transform, targetId);
                    transform.x -= collision.hit.dx;
                    transform.y -= collision.hit.dy;
                    if (collision.hit.nx && Math.sign(collision.hit.nx) === Math.sign(motion.motionX))
                    {
                        motion.motionX = 0;
                    }
                    if (collision.hit.ny && Math.sign(collision.hit.ny) === Math.sign(motion.motionY))
                    {
                        motion.motionY = 0;
                    }
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
                    if (collidable.collision)
                    {
                        ctx.strokeStyle = 'red';
                    }
                }
                ctx.strokeRect(x - rx, y - ry, rx * 2, ry * 2);
            }
        }
    }
}
