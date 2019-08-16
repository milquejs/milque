import ComponentBase from './ComponentBase.js';

const STATIC_TAG_INSTANCE = {};

class ComponentManager
{
    constructor(component)
    {
        this.components = new Map();
        this.type = component;

        this._createComponent = null;
        this._destroyComponent = null;
        if (typeof component === 'string')
        {
            this._createComponent = createComponentByTag;
            this._destroyComponent = destroyComponentByTag;
        }
        else if (component.prototype instanceof ComponentBase)
        {
            this._createComponent = createComponentByClass;
            this._destroyComponent = destroyComponentByClass;
        }
        else
        {
            this._createComponent = createComponentByFunction;
            this._destroyComponent = destroyComponentByFunction;
        }
    }

    add(entity, ...args)
    {
        const dst = this._createComponent(this.type, ...args);
        this.components.set(entity, dst);
        return dst;
    }

    remove(entity)
    {
        if (this.components.has(entity))
        {
            const component = this.components.get(entity);
            if (this._destroyComponent(this.type, component))
            {
                // NOTE: Can re-use component for a new entity!
                // TODO: Implement this later. For now, always assume you can't.
            }

            // Remove it from the entity.
            this.components.delete(entity);
        }
    }

    get(entity)
    {
        return this.components.get(entity);
    }

    has(entity)
    {
        return this.components.has(entity);
    }

    clear()
    {
        this.components.clear();
    }
}

function createComponentByTag(ComponentTag, ...args)
{
    // (...args) are ignored...
    return STATIC_TAG_INSTANCE;
}

function destroyComponentByTag(ComponentTag, instance)
{
    return true;
}

function createComponentByFunction(ComponentFunction, ...args)
{
    return ComponentFunction(...args);
}

function destroyComponentByFunction(ComponentFunction, instance)
{
    return true;
}

function createComponentByClass(ComponentClass, ...args)
{
    const result = new ComponentClass();
    result.create(...args);
    return result;
}

function destroyComponentByClass(ComponentClass, instance)
{
    return instance.destroy();
}

export default ComponentManager;