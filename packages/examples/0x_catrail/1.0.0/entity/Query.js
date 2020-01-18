import { getComponentTypeName } from './component/ComponentHelper.js';

const OPERATOR = Symbol('operator');
const HANDLER = Symbol('handler');

export const Not = createOperator(
    function NotOperator(world, entityId, componentClasses)
    {
        return !(world.hasComponent(entityId, ...componentClasses));
    },
    Symbol('!')
);

/**
 * NOTE: Intentionally does not depend on the "world" to exist in order to be created.
 */
export class Query
{
    static select(world, components)
    {
        return new Query(components).select(world, false);
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

    constructor(components)
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

        this.world = null;
        this.persistent = false;
        this.entityIds = new Set();

        this.key = Query.computeKey(components);

        this.onEntityCreate = this.onEntityCreate.bind(this);
        this.onEntityDestroy = this.onEntityDestroy.bind(this);
        this.onComponentAdd = this.onComponentAdd.bind(this);
        this.onComponentRemove = this.onComponentRemove.bind(this);
    }

    matches(world, entityId)
    {
        if (this.world !== world) return false;
        if (!world.hasComponent(entityId, ...this._included)) return false;
        for(let operatedInfo of Object.getOwnPropertyNames(this._operated))
        {
            if (!operatedInfo[HANDLER].call(this, world, entityId, operatedInfo.components))
            {
                return false;
            }
        }
        return true;
    }

    select(world, persistent = true)
    {
        if (this.persistent) return this.entityIds;
        
        this.world = world;
        this.entityIds.clear();

        for(let entityId of world.getEntityIds())
        {
            if (this.matches(world, entityId))
            {
                this.entityIds.add(entityId);
            }
        }

        if (persistent)
        {
            world.on('entitycreate', this.onEntityCreate);
            world.on('entitydestroy', this.onEntityDestroy);
            world.on('componentadd', this.onComponentAdd);
            world.on('componentremove', this.onComponentRemove);

            this.persistent = true;
        }
        return this.entityIds;
    }

    clear()
    {
        if (this.persistent)
        {
            this.world.off('entitycreate', this.onEntityCreate);
            this.world.off('entitydestroy', this.onEntityDestroy);
            this.world.off('componentadd', this.onComponentAdd);
            this.world.off('componentremove', this.onComponentRemove);
            this.persistent = false;
        }

        this.entityIds.clear();
        this.world = null;
    }

    onEntityCreate(entityId)
    {
        if (this.matches(this.world, entityId))
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

    onComponentAdd(entityId, componentClass, component, initialValues)
    {
        this.onComponentRemove(entityId, componentClass, component);
    }
    
    // NOTE: Could be further optimized if we know it ONLY contains includes, etc.
    onComponentRemove(entityId, componentClass, component)
    {
        if (this.matches(this.world, entityId))
        {
            this.entityIds.add(entityId);
        }
        else if (this.entityIds.has(entityId))
        {
            this.entityIds.delete(entityId);
        }
    }
}

export function createOperator(handler, key = Symbol(handler.name))
{
    let result = function(componentClass) {
        return { [OPERATOR]: key, [HANDLER]: handler, component: componentClass };
    };
    // Dynamic renaming of function for debugging purposes
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
    Object.defineProperty(result, 'name', {
        value: name,
        configurable: true,
    });
    return result;
}
