import { Collidable } from './Collidable.js';
import { CollisionMask } from './CollisionMask.js';

export class CollisionSystem
{
    constructor(entityManager, aabbGraph)
    {
        this.entityManager = entityManager;
        this.aabbGraph = aabbGraph;

        entityManager.addComponentListener(Transform, 'create', component => {
            
        });
        entityManager.addComponentListener(Transform, 'destroy', component => {

        });
    }

    onComponentCreate(component)
    {
        this.aabbGraph.add(component, component);
    }

    onComponentDestroy(component)
    {

    }

    update(dt)
    {
        const { entityManager, aabbGraph } = this;

        for(let collisionMask of entityManager.getComponentInstances(CollisionMask))
        {
            if (!collisionMask.init)
            {
                aabbGraph.
                collisionMask.init = true;
            }

            if (collisionMask.dead)
            {
                collisionMask.dead = false;
            }
        }

        for(let collidable of entityManager.getComponentInstances(Collidable))
        {
            collidable.collision = null;
        }
        let collisions = aabbGraph.solve(entityManager.getComponentEntityIds(Collidable));
        for(let collision of collisions)
        {
            collidable.collision = collision;
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
}
