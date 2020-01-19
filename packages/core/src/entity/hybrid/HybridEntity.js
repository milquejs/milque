import { EntityBase } from './EntityBase.js';

export class HybridEntity extends EntityBase
{
    constructor(world)
    {
        super(world);

        this.onComponentAdd = this.onComponentAdd.bind(this);
        this.onComponentRemove = this.onComponentRemove.bind(this);

        this.world.componentHandler.on('add', this.onComponentAdd);
        this.world.componentHandler.on('remove', this.onComponentRemove);
    }

    /** @abstract */
    onDestroy() {}

    onComponentAdd(entityId, componentType, component, initialValues)
    {
        if (entityId === this.id)
        {
            // NOTE: Since this callback is connected only AFTER EntityComponent has been added
            // we can safely assume that it cannot be added again.
            addComponentProperties(this, componentType, component);
        }
    }

    onComponentRemove(entityId, componentType, component)
    {
        if (entityId === this.id)
        {
            if (componentType === EntityComponent)
            {
                this.world.componentHandler.off('add', this.onComponentAdd);
                this.world.componentHandler.off('remove', this.onComponentRemove);

                this.onDestroy();
            }
            else
            {
                removeComponentProperties(this, componentType, component);
            }
        }
    }
}

function addComponentProperties(target, componentType, component)
{
    if (typeof component === 'object')
    {
        let ownProps = Object.getOwnPropertyNames(target);
        let newProps = {};
        for(let prop of Object.getOwnPropertyNames(component))
        {
            if (ownProps.includes(prop))
            {
                throw new Error(`Conflicting property names in entity for component '${getComponentTypeName(componentType)}'.`);
            }

            newProps[prop] = {
                get() { return component[prop]; },
                set(value) { component[prop] = value; },
                configurable: true,
            };
        }
        Object.defineProperties(target, newProps);
    }
}

function removeComponentProperties(target, componentType, component)
{
    if (typeof component === 'object')
    {
        for(let prop of Object.getOwnPropertyNames(component))
        {
            delete target[prop];
        }
    }
}
