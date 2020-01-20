import { getComponentTypeName } from '../component/ComponentHelper.js';

const OPERATOR = Symbol('operator');
const HANDLER = Symbol('handler');

/**
 * NOTE: Intentionally does not depend on the "entityManager" to exist in order to be created.
 */
export class EntityQuery
{
    static select(entityManager, components)
    {
        return new EntityQuery(components, false).select(entityManager);
    }

    static computeKey(components)
    {
        let result = [];
        for(let component of components)
        {
            if (typeof component === 'object' && OPERATOR in component)
            {
                result.push(component[OPERATOR].toString() + getComponentTypeName(component));
            }
            else
            {
                result.push(getComponentTypeName(component));
            }
        }
        return result.sort().join('-');
    }

    constructor(components, persistent = true)
    {
        this._included = [];
        this._operated = {};

        for(let component of components)
        {
            if (typeof component === 'object' && OPERATOR in component)
            {
                const operator = component[OPERATOR];
                if (operator in this._operated)
                {
                    this._operated[operator].components.push(component.component);
                }
                else
                {
                    this._operated[operator] = {
                        components: [component.component],
                        handler: component[HANDLER],
                    };
                }
            }
            else
            {
                this._included.push(component);
            }
        }

        this.entityManager = null;
        this.persistent = persistent;
        this.entityIds = new Set();

        this.key = EntityQuery.computeKey(components);

        this.onEntityCreate = this.onEntityCreate.bind(this);
        this.onEntityDestroy = this.onEntityDestroy.bind(this);
        this.onComponentAdd = this.onComponentAdd.bind(this);
        this.onComponentRemove = this.onComponentRemove.bind(this);
    }

    matches(entityManager, entityId)
    {
        if (this.entityManager !== entityManager) return false;
        if (!entityManager.hasComponent(entityId, ...this._included)) return false;
        for(let operatedInfo of Object.getOwnPropertyNames(this._operated))
        {
            if (!operatedInfo[HANDLER].call(this, entityManager, entityId, operatedInfo.components))
            {
                return false;
            }
        }
        return true;
    }

    select(entityManager)
    {
        let flag = this.entityManager === entityManager;
        if (this.persistent && flag) return this.entityIds;
        
        const prevEntityManager = this.entityManager;
        this.entityManager = entityManager;
        this.entityIds.clear();

        for(let entityId of entityManager.getEntityIds())
        {
            if (this.matches(entityManager, entityId))
            {
                this.entityIds.add(entityId);
            }
        }

        if (this.persistent && !flag)
        {
            if (prevEntityManager)
            {
                prevEntityManager.entityHandler.off('create', this.onEntityCreate);
                prevEntityManager.entityHandler.off('destroy', this.onEntityDestroy);
                prevEntityManager.componentHandler.off('add', this.onComponentAdd);
                prevEntityManager.componentHandler.off('remove', this.onComponentRemove);
            }

            this.entityManager.entityHandler.on('create', this.onEntityCreate);
            this.entityManager.entityHandler.on('destroy', this.onEntityDestroy);
            this.entityManager.componentHandler.on('add', this.onComponentAdd);
            this.entityManager.componentHandler.on('remove', this.onComponentRemove);
        }

        return this.entityIds;
    }

    selectComponent(entityManager, component = this._included[0])
    {
        let result = this.select(entityManager);
        let dst = [];
        for(let entityId of result)
        {
            dst.push(entityManager.getComponent(entityId, component));
        }
        return dst;
    }

    clear()
    {
        if (this.persistent)
        {
            this.entityManager.entityHandler.off('create', this.onEntityCreate);
            this.entityManager.entityHandler.off('destroy', this.onEntityDestroy);
            this.entityManager.componentHandler.off('add', this.onComponentAdd);
            this.entityManager.componentHandler.off('remove', this.onComponentRemove);
        }

        this.entityIds.clear();
        this.entityManager = null;
    }

    onEntityCreate(entityId)
    {
        if (this.matches(this.entityManager, entityId))
        {
            this.entityIds.add(entityId);
        }
    }

    onEntityDestroy(entityId)
    {
        if (this.entityIds.has(entityId))
        {
            this.entityIds.delete(entityId);
        }
    }

    onComponentAdd(entityId, componentType, component, initialValues)
    {
        this.onComponentRemove(entityId, componentType, component);
    }
    
    // NOTE: Could be further optimized if we know it ONLY contains includes, etc.
    onComponentRemove(entityId, componentType, component)
    {
        if (this.matches(this.entityManager, entityId))
        {
            this.entityIds.add(entityId);
        }
        else if (this.entityIds.has(entityId))
        {
            this.entityIds.delete(entityId);
        }
    }
}
