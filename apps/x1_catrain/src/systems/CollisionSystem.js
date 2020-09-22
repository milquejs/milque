import { Collidable } from './Collidable.js';
import { CollisionMask } from './CollisionMask.js';
import { Transform } from './Transform.js';
import { Motion } from './Motion.js';

export class CollisionSystem
{
    constructor(entityManager, aabbGraph)
    {
        this.entityManager = entityManager;
        this.aabbGraph = aabbGraph;
    }

    update(dt)
    {
        const { entityManager, aabbGraph } = this;

        for(let entityId of entityManager.getComponentEntityIds(CollisionMask))
        {
            const collisionMask = entityManager.get(CollisionMask, entityId);
            const collisionName = collisionMask.name;
            let mask = aabbGraph.get(entityId, collisionName);
            if (!mask)
            {
                aabbGraph.add(entityId, collisionName, collisionMask);
                mask = aabbGraph.get(entityId, collisionName);
            }

            if (entityManager.has(Transform, entityId))
            {
                let transform = entityManager.get(Transform, entityId);
                mask.box.setPosition(transform.x, transform.y, 0);
            }
        }

        for(let collidable of entityManager.getComponentInstances(Collidable))
        {
            collidable.collision = null;
        }

        let collisions = aabbGraph.solve(entityManager.getComponentEntityIds(Collidable));
        for(let collision of collisions)
        {
            let entityId = collision.owner;
            let otherId = collision.other;

            let collidable = entityManager.get(Collidable, entityId);
            collidable.collision = collision;

            if (entityManager.has(Collidable, otherId))
            {
                let otherCollidable = entityManager.get(Collidable, otherId);
                otherCollidable.collision = collision;
            }

            if (entityManager.has(Motion, entityId) && entityManager.has(Transform, entityId))
            {
                let otherCollisionMask = entityManager.get(CollisionMask, otherId);
                if (otherCollisionMask.solid)
                {
                    
                }
                if (!solid.masks || solid.masks.length <= 0 || solid.masks.includes(collision.otherMask.name))
                {
                    let motion = entityManager.get('Motion', entityId);
                    let transform = entityManager.get('Transform', entityId);
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
        const { entityManager, aabbGraph } = this;
        for(let entityId of entityManager.getComponentEntityIds(CollisionMask))
        {
            const collisionName = entityManager.get(CollisionMask, entityId).name;
            const mask = aabbGraph.get(entityId, collisionName);
            const { x, y, rx, ry } = mask.box;
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
