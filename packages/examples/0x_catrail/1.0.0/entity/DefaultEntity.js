import { EntityComponent } from './hybrid/EntityComponent.js';

export class DefaultEntity extends EntityComponent
{
    constructor(world)
    {
        super(world);

        this.onComponentAdd = this.onComponentAdd.bind(this);
        this.onComponentRemove = this.onComponentRemove.bind(this);

        this.world.on('componentadd', this.onComponentAdd);
        this.world.on('componentremove', this.onComponentRemove);
    }

    /** @abstract */
    onDestroy() {}

    onComponentAdd(entityId, componentClass, component, initialValues)
    {
        if (entityId === this.id)
        {
            // NOTE: Since this callback is connected only AFTER EntityComponent has been added
            // we can safely assume that it cannot be added again.
            addComponentProperties(this, componentClass, component);
        }
    }

    onComponentRemove(entityId, componentClass, component)
    {
        if (entityId === this.id)
        {
            if (componentClass === EntityComponent)
            {
                this.world.off('componentadd', this.onComponentAdd);
                this.world.off('componentremove', this.onComponentRemove);

                this.onDestroy();
            }
            else
            {
                removeComponentProperties(this, componentClass, component);
            }
        }
    }
}

function addComponentProperties(target, componentClass, component)
{
    if (typeof component === 'object')
    {
        let ownProps = Object.getOwnPropertyNames(target);
        let newProps = {};
        for(let prop of Object.getOwnPropertyNames(component))
        {
            if (ownProps.includes(prop))
            {
                throw new Error(`Conflicting property names in entity for component '${getComponentTypeName(componentClass)}'.`);
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

function removeComponentProperties(target, componentClass, component)
{
    if (typeof component === 'object')
    {
        for(let prop of Object.getOwnPropertyNames(component))
        {
            delete target[prop];
        }
    }
}
