export class GameObjectSystem
{
    constructor(entityManager)
    {
        this.entityManager = entityManager;
    }

    update(dt)
    {
        for(let gameObject of this.entityManager.getComponentInstances('GameObject'))
        {
            if ('onUpdate' in gameObject)
            {
                gameObject.onUpdate(dt);
            }
        }
    }
}