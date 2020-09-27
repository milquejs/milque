import { CustomComponentFactory } from './CustomComponentFactory.js';

import {
    addAllImpl,
    addImpl,
    addOneImpl,
    deleteImpl,
    flattenInstances,
    getAllImpl,
    removeImpl,
    resolvePropsOrCallback
} from './MultiComponentFactoryHelper.js';

const DEFAULT_PROPS = {};

export class CustomMultiComponentFactory extends CustomComponentFactory
{
    /** @override */
    add(entityId, props = DEFAULT_PROPS)
    {
        let component = this.create(props, entityId);
        return addImpl(this.instances, entityId, component);
    }

    /** @override */
    delete(entityId)
    {
        let result = deleteImpl(this.instances, entityId);
        if (result)
        {
            this.destroy(component, entityId);
        }
        return result;
    }

    /** @override */
    get(entityId) { return this.instances[entityId][0]; }

    /** @override */
    clear()
    {
        let instances = this.instances;
        for(let entityId in instances)
        {
            let componentList = instances[entityId];
            if (componentList)
            {
                instances[entityId] = null;
                for(let component of componentList)
                {
                    this.destroy(component, entityId);
                }
            }
        }
        super.clear();
    }

    /** @override */
    values() { return flattenInstances([], this.instances); }

    addAll(entityId, addCount = 1, propsOrCallback = undefined)
    {
        const propsCallback = resolvePropsOrCallback(propsOrCallback);
        return addAllImpl(this.instances, entityId, addCount, () => {
            let props = propsCallback(entityId);
            return this.create(props, entityId);
        });
    }

    addOne(entityId, propsOrCallback = undefined)
    {
        const propsCallback = resolvePropsOrCallback(propsOrCallback);
        let props = propsCallback(entityId);
        let component = this.create(props, entityId);
        return addOneImpl(this.instances, entityId, component);
    }
    
    removeAll(entityId, startIndex = 0, removeCount = undefined)
    {
        let result = removeImpl(this.instances, entityId, startIndex, removeCount);
        if (result)
        {
            for(let component of result)
            {
                this.destroy(component, entityId);
            }
        }
        return Boolean(result);
    }

    removeOne(entityId, index = 0)
    {
        return this.removeAll(entityId, index, 1);
    }

    getAll(entityId, startIndex = 0, getCount = undefined)
    {
        return getAllImpl(this.instances, entityId, startIndex, getCount);
    }

    getOne(entityId, index = 0)
    {
        return this.instances[entityId][index];
    }
}
