import { uuid } from '@milque/util';
import { getJunctionCoordsFromIndex } from '../laneworld/Junction.js';
import { astarSearch } from '../util/astar.js';

/**
 * @typedef {import('../laneworld/Junction.js').JunctionMap} JunctionMap
 */

const END_OF_PATH = -1;

export class PathFinder
{
    /**
     * @param {JunctionMap} junctionMap 
     */
    constructor(junctionMap)
    {
        this.junctionMap = junctionMap;

        this.paths = {};
        this.used = {};

        this.neighbors = this.neighbors.bind(this);
        this.heuristics = this.heuristics.bind(this);
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
            let prev = this.used[node] || 0;
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

    neighbors(node)
    {
        return this.junctionMap.getJunction(node).getOutlets();
    }

    heuristics(from, to)
    {
        let [fromX, fromY] = getJunctionCoordsFromIndex(this.junctionMap, from);
        let [toX, toY] = getJunctionCoordsFromIndex(this.junctionMap, to);
        return Math.abs(toX - fromX) + Math.abs(toY - fromY);
    }

    weights(from, to)
    {
        return Math.max(1, this.used[to]);
    }
}
