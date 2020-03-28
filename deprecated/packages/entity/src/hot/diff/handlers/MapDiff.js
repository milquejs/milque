import { computeDiff as computeAnyDiff } from '../Diff.js';
import { nextFunction } from '../DiffPath.js';
import { DiffList } from '../DiffList.js';

export function isType(arg)
{
    return arg instanceof Map;
}

export function applyDiff(source, sourceProp, diff)
{
    switch(diff.type)
    {
        case 'mapNew':
        case 'mapSet':
            sourceProp.set(diff.key, diff.value);
            return true;
        case 'mapDelete':
            sourceProp.delete(diff.key);
            return true;
    }
    return false;
}

// NOTE: Same as set diffing, keys MUST be checked with '===' and CANNOT be diffed.
// Although values can.
export function computeDiff(source, target, path = [], opts = {})
{
    let dst = new DiffList();
    for(let [key, value] of target)
    {
        if (!source.has(key))
        {
            dst.addRecord('mapNew', key, value, path);
        }
        else
        {
            let result = computeAnyDiff(source.get(key), value, nextFunction(path, 'get', [ key ]), opts);
            if (!result)
            {
                dst.addRecord('mapSet', key, value, path);
            }
            else
            {
                dst.addRecords(result);
            }
        }
    }
    if (!opts.preserveSource)
    {
        for(let key of source.keys())
        {
            if (!target.has(key))
            {
                dst.addRecord('mapDelete', key, undefined, path);
            }
        }
    }
    return dst;
}
