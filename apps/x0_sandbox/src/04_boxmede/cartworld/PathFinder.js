import { uuid } from '@milque/util';
import { getJunctionCoordsFromIndex } from '../laneworld/Junction.js';
import { astarSearch } from '../util/astar.js';

/**
 * @typedef {import('../laneworld/Junction.js').JunctionMap} JunctionMap
 */

export const END_OF_PATH = -1;

export class PathFinder
{
    /**
     * @param {JunctionMap} junctionMap 
     */
    constructor(junctionMap)
    {
        /** @private */
        this.junctionMap = junctionMap;

        /** @private */
        this.paths = {};
        /** @private */
        this.used = new Uint8Array(junctionMap.length);
        /** @private */
        this.weighted = new Float32Array(junctionMap.length).fill(1);

        /** @private */
        this.neighbors = this.neighbors.bind(this);
        /** @private */
        this.heuristics = this.heuristics.bind(this);
        /** @private */
        this.weights = this.weights.bind(this);
    }

    acquirePath(fromIndex, toIndex)
    {
        if (!this.junctionMap.hasJunction(fromIndex) || !this.junctionMap.hasJunction(toIndex))
        {
            throw new Error('Cannot acquire path between non-existant junctions.');
        }
        let pathId = uuid();//`${fromIndex}:${toIndex}`;
        let path;
        if (pathId in this.paths)
        {
            path = this.paths[pathId];
        }
        else
        {
            path = astarSearch(fromIndex, toIndex, this.neighbors, this.heuristics, this.weights);
            if (path.length <= 0) return null;
            this.paths[pathId] = path;
        }
        for(let node of path)
        {
            let prev = this.used[node];
            this.used[node] = prev + 1;
        }
        return pathId;
    }

    releasePath(pathId)
    {
        let path = this.paths[pathId];
        if (!path)
        {
            throw new Error('Cannot release non-existant path.');
        }
        delete this.paths[pathId];
        for(let node of path)
        {
            this.used[node] -= 1;
        }
    }

    prunePath(pathId, pathIndex)
    {
        let path = this.paths[pathId];
        if (!path)
        {
            throw new Error('Cannot prune non-existant path.');
        }
        for(let i = 0; i < pathIndex; ++i)
        {
            let node = path[i];
            if (node !== END_OF_PATH)
            {
                this.used[node] -= 1;
                path[i] = END_OF_PATH;
            }
        }
    }

    isJunctionUsedForAnyPath(juncIndex)
    {
        return this.used[juncIndex] > 0;
    }

    getPathById(pathId)
    {
        return this.paths[pathId];
    }

    getNextInPath(pathId, pathIndex)
    {
        let path = this.paths[pathId];
        if (pathIndex <= 0)
        {
            return path[0];
        }
        else if (pathIndex >= path.length)
        {
            return END_OF_PATH;
        }
        else
        {
            return path[pathIndex];
        }
    }

    setWeight(juncIndex, weight)
    {
        this.weighted[juncIndex] = weight;
    }

    resetWeight(juncIndex)
    {
        this.weighted[juncIndex] = 1;
    }

    getWeight(juncIndex)
    {
        return this.weighted[juncIndex];
    }

    /** @private */
    neighbors(node)
    {
        return this.junctionMap.getJunction(node).getOutlets();
    }

    /** @private */
    heuristics(from, to)
    {
        let [fromX, fromY] = getJunctionCoordsFromIndex(this.junctionMap, from);
        let [toX, toY] = getJunctionCoordsFromIndex(this.junctionMap, to);
        return Math.abs(toX - fromX) + Math.abs(toY - fromY);
    }

    /** @private */
    weights(from, to)
    {
        return this.weighted[to];
    }
}
