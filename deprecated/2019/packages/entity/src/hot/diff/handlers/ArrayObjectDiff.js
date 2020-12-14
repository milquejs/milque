import { computeDiff as computeAnyDiff } from '../Diff.js';
import { nextProperty } from '../DiffPath.js';
import { DiffList } from '../DiffList.js';

export function isType(arg)
{
    return Array.isArray(arg);
}

export function applyDiff(source, sourceProp, diff)
{
    switch(diff.type)
    {
        case 'arrayObjectEdit':
            sourceProp[diff.key] = diff.value;
            return true;
        case 'arrayObjectAppend':
            ensureCapacity(diff.key);
            sourceProp[diff.key] = diff.value;
            return true;
        case 'arrayObjectSplice':
            sourceProp.splice(diff.key, diff.value);
            return true;
    }
    return false;
}

export function computeDiff(source, target, path = [], opts = {})
{
    let dst = new DiffList();
    const length = Math.min(source.length, target.length);
    for(let i = 0; i < length; ++i)
    {
        let result = computeAnyDiff(source[i], target[i], nextProperty(path, i), opts);
        if (!result)
        {
            dst.addRecord('arrayObjectEdit', i, target[i], path);
        }
        else
        {
            dst.addRecords(result);
        }
    }

    if (!opts.preserveSource && source.length > target.length)
    {
        dst.addRecord('arrayObjectSplice', target.length, source.length - target.length, path);
    }
    else if (target.length > source.length)
    {
        for(let i = source.length; i < target.length; ++i)
        {
            dst.addRecord('arrayObjectAppend', i, target[i], path);
        }
    }
    return dst;
}

function ensureCapacity(array, capacity)
{
    if (array.length < capacity)
    {
        array.length = capacity;
    }
}
