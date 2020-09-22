import { ObjectComponentFactory } from './ObjectComponentFactory.js';

export class MultiObjectComponentFactory extends ObjectComponentFactory
{
    /** @override */
    add(entityId, props)
    {
        let component = this.create(props, entityId);
        let componentList = this.instances[entityId];
        if (componentList)
        {
            componentList.push(component);
        }
        else
        {
            this.instances[entityId] = [component];
        }
    }

    /** @override */
    delete(entityId)
    {
        let componentList = this.instances[entityId];
        componentList.shift();
        if (componentList.length <= 0)
        {
            this.instances[entityId] = null;
        }
    }

    /** @override */
    get(entityId)
    {
        return this.instances[entityId][0];
    }

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
        this.instances = {};
    }

    /** @override */
    values()
    {
        let result = [];
        for(let entityId in this.instances)
        {
            let componentList = this.instances[entityId];
            if (componentList)
            {
                result.push(...componentList);
            }
        }
        return result;
    }

    addAll(entityId, addCount = 1)
    {
        if (addCount <= 0)
        {
            throw new Error('Must add a positive amount of instances for non-singular component.');
        }

        let instances = this.instances;
        let componentList = instances[entityId];
        if (!componentList)
        {
            componentList = [];
            instances[entityId] = componentList;
        }

        let result = [];
        for(; addCount > 0; --addCount)
        {
            let component = this.create(DEFAULT_PROPS, entityId, this);
            result.push(component);
            componentList.push(component);
        }
        return result;
    }
    
    removeAll(entityId, startIndex = 0, removeCount = undefined)
    {
        let instances = this.instances;
        let componentList = instances[entityId];
        let result = componentList.splice(startIndex, removeCount);
        if (componentList.length <= 0)
        {
            instances[entityId] = null;
        }
        for(let component of result)
        {
            this.destroy(component, entityId, this);
        }
        return result.length > 0;
    }

    getOne(entityId, index = 0)
    {
        return this.instances[entityId][index];
    }

    getAll(entityId, startIndex = 0, getCount = undefined)
    {
        let list = this.instances[entityId];
        if (getCount)
        {
            return list.slice(startIndex, startIndex + getCount);
        }
        else
        {
            return list.slice(startIndex);
        }
    }
    
    getInstanceLists()
    {
        return super.values();
    }
}
