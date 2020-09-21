import { ComponentFactory } from '../ComponentFactory.js';

export class ObjectComponentFactory extends ComponentFactory
{
    static from(entityManager, componentFunction)
    {
        const createCallback = 'create' in componentFunction
            ? componentFunction.create
            : (typeof componentFunction === 'function'
                ? componentFunction
                : undefined);
        const destroyCallback = 'destroy' in componentFunction
            ? componentFunction.destroy
            : undefined;
        return new (this)(entityManager, componentFunction, createCallback, destroyCallback);
    }

    constructor(entityManager, componentType, createCallback = undefined, destroyCallback = undefined)
    {
        super(componentType);
        
        this.entityManager = entityManager;

        if (createCallback)
        {
            this.create = createCallback;
        }

        if (destroyCallback)
        {
            this.destroy = destroyCallback;
        }

        /** @private */
        this.instances = {};
    }

    /** @abstract */
    create(props, entityId, entityManager) { return { ...props }; }
    /** @abstract */
    destroy(component, entityId, entityManager) {}

    /** @override */
    get(entityId) { return this.instances[entityId]; }
    /** @override */
    add(entityId, props)
    {
        let prevInstance = this.instances[entityId];
        if (!prevInstance)
        {
            let nextInstance = this.create(props, entityId, this.entityManager);
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
        this.instances[entityId] = null;
        this.destroy(prevInstance, entityId, this.entityManager);
    }
    /** @override */
    keys() { return Object.keys(this.instances); }
    /** @override */
    values() { return Object.values(this.instances); }
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
                this.destroy(component, entityId, this.entityManager);
            }
        }
        this.instances = {};
    }
}
