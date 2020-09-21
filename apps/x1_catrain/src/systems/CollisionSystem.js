import { Collidable } from './Collidable.js';
import { CollisionMask } from './CollisionMask.js';

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
            let mask = aabbGraph.get(entityId, collisionMask.name);
            if (!mask)
            {
                aabbGraph.add(entityId, collisionMask.name, collisionMask);
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
            /*
            {
                let entityId = collision.owner;
                let otherId = collision.other;
                if (entityManager.has('Motion', entityId) && entityManager.has('Transform', entityId))
                {
                    if (entityManager.has('Solid', otherId))
                    {
                        let solid = entityManager.get('Solid', otherId);
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
            */
        }
    }

    render(ctx)
    {
        const { entityManager } = this;
        for(let collisionMask of entityManager.getComponentInstances(CollisionMask))
        {
            const { x, y, rx, ry } = collisionMask;
            ctx.strokeStyle = 'limegreen';
            ctx.strokeRect(x - rx, y - ry, rx * 2, ry * 2);
        }
    }
}
