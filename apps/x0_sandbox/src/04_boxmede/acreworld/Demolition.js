/**
 * @typedef {import('../laneworld/Junction.js').JunctionMap} JunctionMap
 * @typedef {import('../laneworld/Junction.js').JunctionIndex} JunctionIndex
 * @typedef {import('../cartworld/PathFinder.js').PathFinder} PathFinder
 * @typedef {import('./Persistence.js').Persistence} Persistence
 */

import { getJunctionCoordsFromIndex, removeJunction } from '../laneworld/Junction.js';

export class Demolition
{
    /**
     * @param {JunctionMap} junctionMap 
     * @param {PathFinder} pathFinder
     * @param {Persistence} persistence
     */
    constructor(junctionMap, pathFinder, persistence)
    {
        /** @private */
        this.junctionMap = junctionMap;
        /** @private */
        this.pathFinder = pathFinder;
        /** @private */
        this.persistence = persistence;

        /** @private */
        this.demolish = new Uint8Array(junctionMap.length);
        /** @private */
        this.lanes = {};
    }

    update()
    {
        let len = this.demolish.length;
        for(let i = 0; i < len; ++i)
        {
            if (this.isJunctionMarkedForDemolition(i))
            {
                if (!this.junctionMap.hasJunction(i))
                {
                    throw new Error('Trying to demolish non-existant, but marked, junction.');
                }
                if (!this.pathFinder.isJunctionUsedForAnyPath(i))
                {
                    performDemolish(this.junctionMap, this.persistence, i);
                    this.unmarkForDemolition(i);
                }
            }
        }
    }

    clear()
    {
        let len = this.demolish.length;
        for(let i = 0; i < len; ++i)
        {
            if (this.isJunctionMarkedForDemolition(i))
            {
                this.unmarkForDemolition(i);
            }
        }
    }

    markForDemolition(juncIndex)
    {
        this.demolish[juncIndex] = 1;
        this.pathFinder.setWeight(juncIndex, Number.POSITIVE_INFINITY);
    }

    unmarkForDemolition(juncIndex)
    {
        this.demolish[juncIndex] = 0;
        this.pathFinder.resetWeight(juncIndex);
    }

    isJunctionMarkedForDemolition(juncIndex)
    {
        return this.demolish[juncIndex] > 0;
    }
}
 
function performDemolish(map, persistence, juncIndex)
{
    if (persistence.isPersistentJunction(juncIndex))
    {
        persistence.retainOnlyPersistentJunctionConnections(juncIndex);
    }
    else
    {
        removeJunction(map, juncIndex);
    }
}


/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {JunctionMap} map 
 * @param {Demolition} demolition
 * @param {number} cellSize
 */
export function drawDemolition(ctx, map, demolition, cellSize)
{
    const juncSize = cellSize / 2;
    const laneRadius = juncSize;
    ctx.lineWidth = laneRadius;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#660000';
    for(let y = 0; y < map.height; ++y)
    {
        for(let x = 0; x < map.width; ++x)
        {
            let i = x + y * map.width;
            if (!map.hasJunction(i)) continue;
            if (!demolition.isJunctionMarkedForDemolition(i)) continue;
            let junc = map.getJunction(i);
            let beginX = (x + 0.5) * cellSize;
            let beginY = (y + 0.5) * cellSize;
            for(let outlet of junc.outlets)
            {
                let [xx, yy] = getJunctionCoordsFromIndex(map, outlet);
                let endX = (xx + 0.5) * cellSize;
                let endY = (yy + 0.5) * cellSize;
                ctx.beginPath();
                ctx.moveTo(beginX, beginY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
        }
    }
}