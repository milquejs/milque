import { GameObject } from '../entity/GameObject.js';

export class GameObjectSystem
{
    constructor(entityManager)
    {
        this.entityManager = entityManager;
    }

    /** @override */
    update(dt)
    {
        const { entityManager } = this;

        for(let gameObject of entityManager.getComponentInstances(GameObject))
        {
            if ('onUpdate' in gameObject)
            {
                gameObject.onUpdate(dt);
            }
        }
    }

    /** @override */
    render(ctx)
    {
        const { entityManager } = this;

        for(let gameObject of entityManager.getComponentInstances(GameObject))
        {
            if ('onRender' in gameObject)
            {
                gameObject.onRender(ctx);
            }
        }
    }
}
