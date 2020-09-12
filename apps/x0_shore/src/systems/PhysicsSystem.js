export class PhysicsSystem
{
    constructor(entityManager, aabbGraph)
    {
        this.entityManager = entityManager;
        this.aabbGraph = aabbGraph;
    }

    update(dt)
    {
        const { entityManager, aabbGraph } = this;

        for(let collidable of entityManager.getComponentInstances('Collidable'))
        {
            collidable.collided = false;
        }
        let collisions = aabbGraph.solve(entityManager.getComponentEntityIds('Motion'));
        for(let collision of collisions)
        {
            {
                let entityId = collision.box.owner;
                let collidable = entityManager.get('Collidable', entityId);
                collidable.collided = true;
            }
            {
                let entityId = collision.otherBox.owner;
                let collidable = entityManager.get('Collidable', entityId);
                collidable.collided = true;
            }
            {
                let entityId = collision.mask.owner;
                let otherId = collision.otherMask.owner;
                if (entityManager.has('Motion', entityId) && entityManager.has('Transform', entityId))
                {
                    if (entityManager.has('Solid', otherId))
                    {
                        let solid = entityManager.get('Solid', otherId);
                        if (solid.masks.includes(collision.otherBox.maskName))
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
        }
    }
}
