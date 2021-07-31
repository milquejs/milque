/**
 * @typedef {string} NodeId
 * 
 * @typedef NodeCache
 * @property {Record<string, number>} fscore
 * @property {Record<string, number>} gscore
 * @property {Record<string, number>} hscore
 * @property {Record<string, NodeId>} parents
 */

/**
 * @param {NodeId} startId The string representation of the starting position. Must be unique and deterministic.
 * @param {NodeId} goalId The string representation of the stopping position. Must be unique and deterministic.
 * @param {(node: NodeId) => Array<NodeId>} neighborsCallback Get all reachable neighbors from the given node.
 * @param {(from: NodeId, to: NodeId) => number} heuristicCallback Get the heuristics score between the two nodes.
 * @returns If the goal is not reachable from the start, it will return an empty array.
 */
export function astarSearch(startId, goalId, neighborsCallback, heuristicCallback)
{
    let cache = createCache();
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
            for(let neighborNodeId of neighborsCallback(currentNodeId))
            {
                if (closed.has(neighborNodeId)) continue;
                let g = cache.gscore[currentNodeId] + 1;
                let flag = false;
                if (!opened.has(neighborNodeId))
                {
                    flag = true;
                    cacheNode(cache, neighborNodeId);
                    cache.hscore[neighborNodeId] = heuristicCallback(neighborNodeId, goalId);
                    opened.add(neighborNodeId);
                }
                else if (g < cache.gscore[neighborNodeId])
                {
                    flag = true;
                }
                // Use the new g score if better
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

/**
 * @returns {NodeCache}
 */
function createCache()
{
    return {
        fscore: {},
        gscore: {},
        hscore: {},
        parents: {},
    };
}

/**
 * @param {object} cache 
 * @param {NodeId} id 
 * @param {number} f 
 * @param {number} g 
 * @param {number} h 
 * @param {NodeId} parent 
 * @returns {NodeId}
 */
function cacheNode(cache, id, f = Number.POSITIVE_INFINITY, g = Number.POSITIVE_INFINITY, h = Number.NaN, parent = null)
{
    cache.fscore[id] = f;
    cache.gscore[id] = g;
    cache.hscore[id] = h;
    cache.parents[id] = parent;
    return id;
}
