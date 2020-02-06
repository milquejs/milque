import { EntityBase } from './EntityBase.js';
import { EntityComponent } from './EntityComponent.js';

export class ReflexiveEntity extends EntityBase
{
    constructor(entityManager)
    {
        super(entityManager);

        this.onComponentAdd = this.onComponentAdd.bind(this);
        this.onComponentRemove = this.onComponentRemove.bind(this);

        this.entityManager.entityHandler.addEntityListener(this.id, 'componentadd', this.onComponentAdd);
        this.entityManager.entityHandler.addEntityListener(this.id, 'componentremove', this.onComponentRemove);
    }
    
    /** @abstract */
    onDestroy() {}

    onComponentAdd(entityId, componentType, component, initialValues)
    {
        if (this.id !== entityId) return;

        // NOTE: Since this callback is connected only AFTER EntityComponent has been added
        // we can safely assume that it cannot be added again.
        addComponentProperties(this, componentType, component);
    }

    onComponentRemove(entityId, componentType, component)
    {
        if (this.id !== entityId) return;
        
        if (componentType === EntityComponent)
        {
            this.entityManager.entityHandler.removeEntityListener(this.id, 'componentadd', this.onComponentAdd);
            this.entityManager.entityHandler.removeEntityListener(this.id, 'componentremove', this.onComponentRemove);
            
            this.onDestroy();
        }
        else
        {
            removeComponentProperties(this, componentType, component);
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
