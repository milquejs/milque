import { DiffList } from '../DiffList.js';

export function isType(arg)
{
    return arg instanceof Set;
}

export function applyDiff(source, sourceProp, diff)
{
    switch(diff.type)
    {
        case 'setAdd':
            sourceProp.add(diff.key);
            return true;
        case 'setDelete':
            sourceProp.delete(diff.key);
            return true;
    }
    return false;
}

// NOTE: If the set's contents are objects, there is no way to "update" that object.
// Therefore, this diff only works if NEW objects are added. This is the case for
// any object with indexed with keys. Keys MUST be checked with '===' and CANNOT be diffed.
export function computeDiff(source, target, path = [], opts = {})
{
    let dst = new DiffList();
    for(let value of target)
    {
        if (!source.has(value))
        {
            dst.addRecord('setAdd', value, undefined, path);
        }
    }
    if (!opts.preserveSource)
    {
        for(let value of source)
        {
            if (!target.has(value))
            {
                dst.addRecord('setDelete', value, undefined, path);
            }
        }
    }
    return dst;
}
