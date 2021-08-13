/**
 * @typedef {import('../laneworld/Junction.js').JunctionMap} JunctionMap
 * @typedef {import('../laneworld/Junction.js').JunctionIndex} JunctionIndex
 */

import { disconnectJunctions, isJunctionEmpty, removeJunction } from '../laneworld/Junction.js';

export class Persistence
{
    /**
     * @param {JunctionMap} junctionMap 
     */
    constructor(junctionMap)
    {
        this.junctionMap = junctionMap;
        /** @type {Record<string, Array<JunctionIndex>>} */
        this.persists = {};
    }

    clear()
    {
        this.persists = {};
    }

    markPersistentJunction(juncIndex, dependentIndex = juncIndex)
    {
        this.markPersistentJunctionImpl(juncIndex, dependentIndex);
        if (juncIndex !== dependentIndex)
        {
            this.markPersistentJunctionImpl(dependentIndex, juncIndex);
        }
    }

    /** @private */
    markPersistentJunctionImpl(juncIndex, dependentIndex)
    {
        let list = this.persists[juncIndex];
        if (!list)
        {
            list = this.persists[juncIndex] = [];
        }
        let i = list.indexOf(dependentIndex);
        if (i < 0)
        {
            list.push(dependentIndex);
        }
        else
        {
            throw new Error('Cannot mark persistence for junction already persistent.');
        }
    }

    unmarkPersistentJunction(juncIndex, dependentIndex = juncIndex)
    {
        this.unmarkPersistentJunctionImpl(juncIndex, dependentIndex);
        if (juncIndex !== dependentIndex)
        {
            this.unmarkPersistentJunctionImpl(dependentIndex, juncIndex);
        }
    }

    /** @private */
    unmarkPersistentJunctionImpl(juncIndex, dependentIndex)
    {
        let list = this.persists[juncIndex];
        let i = list.indexOf(dependentIndex);
        if (i >= 0)
        {
            list.splice(i, 1);
        }
        else
        {
            throw new Error('Cannot unmark persistence for junction already non-persistent.');
        }
    }

    isPersistentJunction(juncIndex)
    {
        let list = this.persists[juncIndex];
        if (list)
        {
            return list.length > 0;
        }
        else
        {
            return false;
        }
    }

    retainOnlyPersistentJunctionConnections(juncIndex)
    {
        const map = this.junctionMap;
        let list = this.persists[juncIndex];
        if (!list || list.length <= 0)
        {
            throw new Error('Cannot retain non-persistent junction.');
        }
        let junc = map.getJunction(juncIndex);
        for(let outletIndex of junc.getOutlets())
        {
            if (!list.includes(outletIndex))
            {
                disconnectJunctions(map, juncIndex, outletIndex);
                if (isJunctionEmpty(map, outletIndex))
                {
                    removeJunction(map, outletIndex);
                }
            }
        }
        for(let inletIndex of junc.getInlets())
        {
            if (!list.includes(inletIndex))
            {
                disconnectJunctions(map, inletIndex, juncIndex);
                if (isJunctionEmpty(map, inletIndex))
                {
                    removeJunction(map, inletIndex);
                }
            }
        }
    }
}
