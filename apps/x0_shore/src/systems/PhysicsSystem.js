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
        let collisions = aabbGraph.solve();
        for(let collision of collisions)
        {
            {
                let entityId = collision.box.owner;
                let collidable = entityManager.get('Collidable', entityId);
                collidable.collided = true;
            }
            {
                let entityId = collision.other.owner;
                let collidable = entityManager.get('Collidable', entityId);
                collidable.collided = true;
            }
        }
    }
}
