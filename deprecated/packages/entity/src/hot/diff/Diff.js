import { resolveObject } from './DiffPath.js';

import * as ObjectDiff from './handlers/ObjectDiff.js';
import * as ArrayObjectDiff from './handlers/ArrayObjectDiff.js';
import * as SetDiff from './handlers/SetDiff.js';
import * as MapDiff from './handlers/MapDiff.js';

export const DEFAULT_HANDLERS = [
    ArrayObjectDiff,
    MapDiff,
    SetDiff,
];

export const DEFAULT_OPTS = {
    handlers: DEFAULT_HANDLERS,
    preserveSource: true,
    maxDepth: 1000,
};

export function computeDiff(source, target, path = [], opts = DEFAULT_OPTS)
{
    // Force replacement since we have reached maximum depth...
    if (path.length >= opts.maxDepth) return null;
    // Check if type at least matches...
    if (typeof source !== typeof target) return null;
    // If it's an object...(which there are many kinds)...
    if (typeof source === 'object')
    {
        for(let handler of opts.handlers)
        {
            let type = handler.isType(source);
            if (type ^ (handler.isType(target))) return null;
            if (type) return handler.computeDiff(source, target, path, opts);
        }

        // It's probably just a simple object...
        return ObjectDiff.computeDiff(source, target, path, opts);
    }
    else
    {
        // Any other primitive types...
        if (source === target) return [];
        else return null;
    }
}

export function applyDiff(source, diffList, opts = DEFAULT_OPTS)
{
    let sourceProp = source;
    for(let diff of diffList)
    {
        // Find property...
        sourceProp = resolveObject(source, diff.path);

        // Apply property diff...
        let flag = false;
        for(let handler of opts.handlers)
        {
            flag = handler.applyDiff(source, sourceProp, diff);
            if (flag) break;
        }

        // Apply default property diff...
        if (!flag)
        {
            ObjectDiff.applyDiff(source, sourceProp, diff);
        }
    }
    return source;
}
