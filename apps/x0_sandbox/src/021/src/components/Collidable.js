import { World } from '../World.js';

World.require('aabbGraph');

export const Collidable = {
    create(props, entityId, entityManager)
    {
        const { aabbGraph } = World.getWorld();
        const { masks } = props;
        for(let maskName in masks)
        {
            aabbGraph.add(entityId, maskName, masks[maskName]);
        }
        return {
            masks,
            source: null,
            target: null,
            collided: false,
        };
    },
    destroy(component, entityId)
    {
        const { aabbGraph } = World.getWorld();
        const { masks } = component;
        for(let maskName in masks)
        {
            aabbGraph.remove(entityId, maskName);
        }
    }
};
