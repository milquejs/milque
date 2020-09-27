import { ComponentFactory } from '../ComponentFactory.js';

export class CustomComponentFactory extends ComponentFactory
{
    constructor(componentType, createCallback = undefined, destroyCallback = undefined)
    {
        super(componentType);

        if (createCallback) this.create = createCallback;
        if (destroyCallback) this.destroy = destroyCallback;

        /** @private */
        this.instances = {};
    }

    /** @abstract */
    create(props, entityId) { return { ...props }; }
    /** @abstract */
    destroy(component, entityId) {}
    
    /** @override */
    get(entityId) { return this.instances[entityId]; }
    /** @override */
    add(entityId, props)
    {
        let prevInstance = this.instances[entityId];
        if (!prevInstance)
        {
            let nextInstance = this.create(props, entityId);
            this.instances[entityId] = nextInstance;
            return nextInstance;
        }
        else
        {
            throw new Error(`Failed to add component - entity already has component of the same type ${getName(this.componentType)}.`);
        }
    }
    /** @override */
    delete(entityId)
    {
        const prevInstance = this.instances[entityId];
        if (prevInstance)
        {
            this.instances[entityId] = null;
            this.destroy(prevInstance, entityId);
            return true;
        }
        return false;
    }
    /** @override */
    keys() { return Object.keys(this.instances); }
    /** @override */
    values() { return Object.values(this.instances); }
    /** @override */
    entries() { return Object.entries(this.instances); }
    /** @override */
    clear()
    {
        let instances = this.instances;
        for(let entityId in instances)
        {
            let component = instances[entityId];
            if (component)
            {
                instances[entityId] = null;
                this.destroy(component, entityId);
            }
        }
        this.instances = {};
    }
}
