import { ComponentFactory } from '../entity/ComponentFactory.js';

export class CollisionMaskFactory extends ComponentFactory
{
    /**
     * @param {import('milque').AxisAlignedBoundingBoxGraph} aabbGraph 
     */
    constructor(componentType, aabbGraph)
    {
        super(componentType);

        this.aabbGraph = aabbGraph;
    }

    /** @override */
    get(entityId)
    {
        return this.aabbGraph.get(entityId, 'main');
    }

    getByName(entityId, maskName)
    {
        return this.aabbGraph.get(entityId, maskName);
    }

    add(entityId, props)
    {
        const { name = 'main', box } = props;
        this.aabbGraph.add(entityId, name, box);
        return this.aabbGraph.get(entityId, name).box;
    }

    /** @override */
    delete(entityId)
    {
        this.aabbGraph.remove(entityId, 'main');
    }

    deleteByName(entityId, maskName)
    {
        this.aabbGraph.remove(entityId, maskName);
    }

    /** @override */
    keys()
    {
        return this.aabbGraph.masks.keys();
    }

    /** @override */
    values()
    {
        let result = [];
        for(let box of this.aabbGraph.boxes)
        {
            result.push(box.mask)
        }
        return result;
    }

    boxes()
    {
        return this.aabbGraph.boxes();
    }

    /** @override */
    clear()
    {
        this.aabbGraph.clear();
    }
}
