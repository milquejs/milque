function cacheNode(cache, id, f = Number.POSITIVE_INFINITY, g = Number.POSITIVE_INFINITY, h = Number.NaN, parent = null)
{
    cache.fscore[id] = f;
    cache.gscore[id] = g;
    cache.hscore[id] = h;
    cache.parents[id] = parent;
    return id;
}

export function astarSearch(startId, goalId, getNeighbors, getHeuristic)
{
    let cache = {
        fscore: {},
        gscore: {},
        hscore: {},
        parents: {},
    };

    cacheNode(cache, startId);
    let opened = new Set();
    let closed = new Set();
    opened.add(startId);
    while(opened.size > 0)
    {
        let minNodeId;
        for(let openNodeId of opened)
        {
            if (minNodeId)
            {
                if (cache.fscore[openNodeId] < cache.fscore[minNodeId])
                {
                    minNodeId = openNodeId;
                }
            }
            else
            {
                minNodeId = openNodeId;
            }
        }

        let currentNodeId = minNodeId;
        if (currentNodeId === goalId)
        {
            // Completed!
            let result = [];
            while(cache.parents[currentNodeId])
            {
                result.push(currentNodeId);
                currentNodeId = cache.parents[currentNodeId];
            }
            return result.reverse();
        }
        else
        {
            // Not there yet...
            closed.add(currentNodeId);
            opened.delete(currentNodeId);
            for(let neighborNodeId of getNeighbors(currentNodeId))
            {
                if (closed.has(neighborNodeId))
                {
                    continue;
                }

                let g = cache.gscore[currentNodeId] + 1;
                let flag = false;
                if (!opened.has(neighborNodeId))
                {
                    flag = true;
                    cacheNode(cache, neighborNodeId);
                    cache.hscore[neighborNodeId] = getHeuristic(neighborNodeId, goalId);
                    opened.add(neighborNodeId);
                }
                else if (g < cache.gscore[neighborNodeId])
                {
                    flag = true;
                }

                if (flag)
                {
                    cache.parents[neighborNodeId] = currentNodeId;
                    cache.gscore[neighborNodeId] = g;
                    cache.fscore[neighborNodeId] = g + cache.hscore[neighborNodeId];
                }
            }
        }
    }
    return [];
}
