import { ComponentFactory } from '../component/factory/ComponentFactory.js';

export class EntityComponentFactory extends ComponentFactory
{
    constructor()
    {
        super();
        
        this.instances = {};
    }

    /** @override */
    create(entityId)
    {
        this.instances[entityId] = { ref: null };
    }

    /** @override */
    delete(entityId)
    {
        this.instances[entityId] = undefined;
    }

    /** @override */
    get(entityId)
    {
        return this.instances[entityId].ref;
    }

    /** @override */
    has(entityId)
    {
        let instance = this.instances[entityId];
        return Boolean(instance && instance.ref);
    }

    /** @override */
    clear()
    {
        this.instances = {};
    }
}
