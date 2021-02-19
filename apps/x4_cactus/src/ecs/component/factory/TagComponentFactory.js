import { ComponentFactory } from './ComponentFactory.js';

export class TagComponentFactory extends ComponentFactory
{
    constructor()
    {
        super();
        
        this.instances = new Set();
    }

    /** @override */
    create(entityId)
    {
        this.instances.add(entityId);
    }

    /** @override */
    delete(entityId)
    {
        this.instances.delete(entityId);
    }

    /** @override */
    get(entityId)
    {
        return this.instances.has(entityId);
    }

    /** @override */
    has(entityId)
    {
        return this.instances.has(entityId);
    }

    /** @override */
    clear()
    {
        this.instances.clear();
    }
}
