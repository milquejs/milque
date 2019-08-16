import EntityView from './EntityView.js';
import ComponentManager from './ComponentManager.js';

class EntityManager
{
    constructor()
    {
        this._entities = new Set();
        this._componentManagers = new Map();
        this._nextEntityID = 1;
    }

    create(...components)
    {
        const entity = this._nextEntityID++;
        this._entities.add(entity);
        for(const component of components)
        {
            this.assign(entity, component);
        }
        return entity;
    }

    destroy(entity)
    {
        for(const componentManager of this._componentManagers.values())
        {
            if (componentManager.has(entity))
            {
                componentManager.remove(entity);
            }
        }
        this._entities.delete(entity);
    }

    entities(...components)
    {
        return new EntityView(this, (entity) => this.has(entity, ...components));
    }

    has(entity, ...components)
    {
        for(const component of components)
        {
            if (this._componentManagers.has(component))
            {
                if (!this._componentManagers.get(component).has(entity))
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        return true;
    }

    get(entity, component, ...components)
    {
        if (components.length > 0)
        {
            const dst = [];
            dst.push(this._componentManagers.get(component).get(entity));
            for(const c of components)
            {
                dst.push(this._componentManagers.get(c).get(entity));
            }
            return dst;
        }
        else
        {
            return this._componentManagers.get(component).get(entity);
        }
    }

    assign(entity, component, ...args)
    {
        let componentManager;
        if (!this._componentManagers.has(component))
        {
            componentManager = new ComponentManager(component);
            this._componentManagers.set(component, componentManager);
        }
        else
        {
            componentManager = this._componentManagers.get(component);
        }
        return componentManager.add(entity, ...args);
    }

    remove(entity, ...components)
    {
        for(const c of components)
        {
            this._componentManagers.get(c).remove(entity);
        }
    }

    clear(...components)
    {
        if (this.components.length > 0)
        {
            for(const c of components)
            {
                this._componentManagers.get(c).clear();
            }
        }
        else
        {
            this._componentManagers.clear();
            this._entities.clear();
        }
    }
}

export default EntityManager;