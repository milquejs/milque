/**
 * @callback PropsCallback
 * @param {import('../EntityManager.js').EntityId} entityId
 * @returns {Object} The non-null props object.
 */

/** @type {PropsCallback} */
const DEFAULT_PROPS_CALLBACK = function(entityId) { return {}; };

/** @returns {PropsCallback} The resolved props callback. */
export function resolvePropsOrCallback(propsOrCallback)
{
    switch(typeof propsOrCallback)
    {
        case 'object':
            return function() { return propsOrCallback; }
        case 'function':
            return propsOrCallback;
        default:
            return DEFAULT_PROPS_CALLBACK;
    }
}

export function flattenInstances(out, instances)
{
    let result = [];
    for(let entityId in instances)
    {
        let componentList = instances[entityId];
        if (componentList)
        {
            result.push(...componentList);
        }
    }
    return result;
}

export function addImpl(instances, entityId, component)
{
    let componentList = instances[entityId];
    if (componentList)
    {
        componentList.push(component);
    }
    else
    {
        instances[entityId] = [component];
    }
    return component;
}

export function deleteImpl(instances, entityId)
{
    let componentList = instances[entityId];
    if (componentList)
    {
        componentList.shift();
        if (componentList.length <= 0)
        {
            instances[entityId] = null;
        }
        return true;
    }
    return false;
}

export function addAllImpl(instances, entityId, addCount, createCallback)
{
    if (addCount <= 0)
    {
        throw new Error('Must add a positive amount of instances for non-singular component.');
    }

    let componentList = instances[entityId];
    if (!componentList)
    {
        componentList = [];
        instances[entityId] = componentList;
    }

    let result = [];
    for(; addCount > 0; --addCount)
    {
        let component = createCallback();
        result.push(component);
        componentList.push(component);
    }
    return result;
}

export function addOneImpl(instances, entityId, component)
{
    let componentList = instances[entityId];
    if (componentList)
    {
        componentList.push(component);
    }
    else
    {
        instances[entityId] = [component];
    }
    return component;
}

export function removeImpl(instances, entityId, startIndex, removeCount)
{
    let componentList = instances[entityId];
    let result = componentList.splice(startIndex, removeCount);
    if (componentList.length <= 0)
    {
        instances[entityId] = null;
    }
    return result;
}

export function getAllImpl(instances, entityId, startIndex, getCount)
{
    let list = instances[entityId];
    if (getCount)
    {
        return list.slice(startIndex, startIndex + getCount);
    }
    else
    {
        return list.slice(startIndex);
    }
}
