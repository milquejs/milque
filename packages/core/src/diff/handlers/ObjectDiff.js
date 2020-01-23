import { computeDiff as computeAnyDiff } from '../Diff.js';
import { nextProperty } from '../DiffPath.js';
import { DiffList } from '../DiffList.js';

export function isType(arg)
{
    return typeof arg === 'object';
}

export function applyDiff(source, sourceProp, diff)
{
    switch(diff.type)
    {
        case 'new':
        case 'edit':
            sourceProp[diff.key] = diff.value;
            return true;
        case 'delete':
            delete sourceProp[diff.key];
            return true;
    }
    return false;
}

export function computeDiff(source, target, path = [], opts = {})
{
    let dst = new DiffList();
    let sourceKeys = new Set(Object.getOwnPropertyNames(source));
    for(let key of Object.getOwnPropertyNames(target))
    {
        if (!sourceKeys.has(key))
        {
            dst.addRecord('new', key, target[key], path);
        }
        else
        {
            sourceKeys.delete(key);
            let result = computeAnyDiff(source[key], target[key], nextProperty(path, key), opts);
            if (!result)
            {
                dst.addRecord('edit', key, target[key], path);
            }
            else
            {
                dst.addRecords(result);
            }
        }
    }
    if (!opts.preserveSource)
    {
        for(let sourceKey of sourceKeys)
        {
            dst.addRecord('delete', sourceKey, undefined, path);
        }
    }
    return dst;
}
