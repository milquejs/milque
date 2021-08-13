/**
 * @typedef {[number, number]} JunctionCoords
 * @typedef {number} JunctionIndex
 */

export class JunctionMap
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
        this.length = width * height;

        /**
         * @private
         * @type {Record<JunctionIndex, Junction>}
         */
        this.juncs = {};
    }

    /**
     * @param {JunctionIndex} juncIndex 
     * @returns {boolean}
     */
    hasJunction(juncIndex)
    {
        if (juncIndex < 0) return false;
        return Boolean(this.juncs[juncIndex]);
    }

    /**
     * @param {JunctionIndex} juncIndex 
     * @returns {Junction}
     */
    getJunction(juncIndex)
    {
        let result = this.juncs[juncIndex];
        if (!result)
        {
            throw new Error(`Cannot get non-existant junction at index ${juncIndex}.`);
        }
        return result;
    }

    /**
     * @param {JunctionIndex} juncIndex 
     * @param {Junction} junction 
     */
    setJunction(juncIndex, junction)
    {
        let prev = this.juncs[juncIndex];
        if (prev)
        {
            throw new Error(`Cannot replace existing junction at index ${juncIndex}`);
        }
        this.juncs[juncIndex] = junction;
    }

    /**
     * @param {JunctionIndex} juncIndex
     */
    deleteJunction(juncIndex)
    {
        let prev = this.juncs[juncIndex];
        if (!prev)
        {
            throw new Error(`Cannot delete non-existant junction at index ${juncIndex}.`);
        }
        this.juncs[juncIndex] = undefined;
    }

    /**
     * @returns {Array<Junction>}
     */
    getJunctions()
    {
        return Object.values(this.juncs).filter(junc => Boolean(junc));
    }
}

export class Junction
{
    /**
     * @param {number} coordX 
     * @param {number} coordY 
     * @param {number} parkingCapacity 
     */
    constructor(coordX, coordY, parkingCapacity)
    {
        this.coordX = coordX;
        this.coordY = coordY;

        /**
         * @private
         * @type {Array<JunctionIndex>}
         */
        this.outlets = [];
        /**
         * @private
         * @type {Array<JunctionIndex>}
         */
        this.inlets = [];
        /**
         * @private
         * @type {Record<JunctionIndex, Lane>}
         */
        this.lanes = {};

        /** @type {string} */
        this.passing = null;

        /** @type {number} */
        this.parkingCapacity = parkingCapacity;
        /** @type {number} */
        this.parking = 0;
    }

    getInlets()
    {
        return Array.from(this.inlets);
    }

    getOutlets()
    {
        return Array.from(this.outlets);
    }

    hasInlet(juncIndex)
    {
        return this.inlets.includes(juncIndex);
    }

    hasOutlet(juncIndex)
    {
        return this.outlets.includes(juncIndex);
    }

    addInlet(juncIndex, lane)
    {
        if (lane.inlet !== juncIndex)
        {
            throw new Error('Lane inlet does not match junction inlet.');
        }
        this.inlets.push(juncIndex);
    }

    addOutlet(juncIndex, lane)
    {
        if (lane.outlet !== juncIndex)
        {
            throw new Error('Lane outlet does not match junction outlet.');
        }
        this.outlets.push(juncIndex);
        let prev = this.lanes[juncIndex];
        if (prev)
        {
            throw new Error(`Cannot replace existing lane at outlet ${juncIndex}`);
        }
        this.lanes[juncIndex] = lane;
    }

    removeInlet(juncIndex)
    {
        let i = this.inlets.indexOf(juncIndex);
        if (i >= 0)
        {
            this.inlets.splice(i, 1);
        }
        else
        {
            throw new Error(`Cannot remove non-existant inlet ${juncIndex} for junction.`);
        }
    }

    removeOutlet(juncIndex)
    {
        let i = this.outlets.indexOf(juncIndex);
        if (i >= 0)
        {
            this.outlets.splice(i, 1);
            let prev = this.lanes[juncIndex];
            if (!prev)
            {
                throw new Error(`Cannot delete non-existant lane for outlet ${juncIndex}.`);
            }
            this.lanes[juncIndex] = undefined;
        }
        else
        {
            throw new Error(`Cannot remove non-existant outlet ${juncIndex} for junction.`);
        }
    }

    /**
     * @param {JunctionIndex} outletIndex 
     * @returns {Lane}
     */
    getLane(outletIndex)
    {
        let result = this.lanes[outletIndex];
        if (!result)
        {
            throw new Error(`Cannot get non-existant lane for outlet ${outletIndex}.`);
        }
        return result;
    }

    /**
     * @returns {Array<Lane>}
     */
    getLanes()
    {
        return Object.values(this.lanes).filter(lane => Boolean(lane));
    }

    isEmpty()
    {
        return this.inlets.length <= 0 && this.outlets.length <= 0;
    }
}

export class Lane
{
    /**
     * @param {JunctionIndex} inlet 
     * @param {JunctionIndex} outlet 
     * @param {number} length
     */
    constructor(inlet, outlet, length)
    {
        if (inlet === outlet)
        {
            throw new Error('Cannot create lane with the same inlet and outlet.');
        }
        /** @type {JunctionIndex} */
        this.inlet = inlet;
        /** @type {JunctionIndex} */
        this.outlet = outlet;
        /** @type {Array<string>} */
        this.slots = new Array(length);
        /** @type {number} */
        this.length = length;
        /** @type {number} */
        this.blocking = length; // TODO: Not yet implemented. Should allow faster blocking checks.
    }
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} juncIndex 
 * @returns {JunctionIndex}
 */
export function randomOutletJunctionFromJunction(map, juncIndex)
{
    let outlets = map.getJunction(juncIndex).getOutlets();
    let outlet = outlets[Math.floor(Math.random() * outlets.length)];
    return outlet;
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} juncIndex 
 * @returns {Junction}
 */
export function getJunctionByIndex(map, juncIndex)
{
    return map.getJunction(juncIndex);
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} inletIndex 
 * @param {JunctionIndex} outletIndex
 * @returns {Lane}
 */
export function getJunctionLaneByIndex(map, inletIndex, outletIndex)
{
    if (typeof map !== 'object') throw new Error('Missing map.');
    let junc = getJunctionByIndex(map, inletIndex);
    return junc.lanes[outletIndex];
}

/**
 * @param {JunctionMap} map 
 * @param {number} juncX 
 * @param {number} juncY 
 * @returns {Junction}
 */
export function putJunction(map, juncX, juncY, parkingCapacity = 0)
{
    let junc = new Junction(juncX, juncY, parkingCapacity);
    let i = getJunctionIndexFromCoords(map, juncX, juncY);
    map.setJunction(i, junc);
    return junc;
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} juncIndex 
 * @returns {JunctionCoords}
 */
export function getJunctionCoordsFromIndex(map, juncIndex)
{
    if (typeof map !== 'object') throw new Error('Missing map.');
    return [
        juncIndex % map.width,
        Math.floor(juncIndex / map.width),
    ];
}

/**
 * @param {JunctionMap} map 
 * @param {number} juncX 
 * @param {number} juncY 
 * @returns {JunctionIndex}
 */
export function getJunctionIndexFromCoords(map, juncX, juncY)
{
    if (typeof map !== 'object') throw new Error('Missing map.');
    return juncX + juncY * map.width;
}

/**
 * @param {JunctionMap} map 
 * @param {Junction} junc 
 */
export function getJunctionIndexFromJunction(map, junc)
{
    return getJunctionIndexFromCoords(map, junc.coordX, junc.coordY);
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} inletJuncIndex 
 * @param {JunctionIndex} outletJuncIndex 
 */
export function doesLaneExist(map, inletJuncIndex, outletJuncIndex)
{
    let inletJunc = map.getJunction(inletJuncIndex);
    return inletJunc.hasOutlet(outletJuncIndex);
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} inletJuncIndex 
 * @param {JunctionIndex} outletJuncIndex 
 */
export function putLane(map, inletJuncIndex, outletJuncIndex, laneLength)
{
    let inletJunc = map.getJunction(inletJuncIndex);
    let outletJunc = map.getJunction(outletJuncIndex);
    let lane = new Lane(inletJuncIndex, outletJuncIndex, laneLength);
    inletJunc.addOutlet(outletJuncIndex, lane);
    outletJunc.addInlet(inletJuncIndex, lane);
    return lane;
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} inletJuncIndex 
 * @param {JunctionIndex} outletJuncIndex 
 */
export function deleteLane(map, inletJuncIndex, outletJuncIndex)
{
    let inletJunc = map.getJunction(inletJuncIndex);
    let outletJunc = map.getJunction(outletJuncIndex);
    inletJunc.removeOutlet(outletJuncIndex);
    outletJunc.removeInlet(inletJuncIndex);
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} inletJuncIndex 
 * @param {JunctionIndex} outletJuncIndex 
 */
export function getLane(map, inletJuncIndex, outletJuncIndex)
{
    let inletJunc = map.getJunction(inletJuncIndex);
    return inletJunc.getLane(outletJuncIndex);
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} fromJuncIndex
 * @param {JunctionIndex} toJuncIndex
 */
export function connectJunctions(map, fromJuncIndex, toJuncIndex, laneLength = 3)
{
    putLane(map, fromJuncIndex, toJuncIndex, laneLength);
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} fromJuncIndex
 * @param {JunctionIndex} toJuncIndex
 */
export function disconnectJunctions(map, fromJuncIndex, toJuncIndex)
{
    let lane = getLane(map, fromJuncIndex, toJuncIndex);
    if (lane.blocking < lane.length)
    {
        throw new Error('Cannot disconnect junctions with a non-vacated lane.');
    }
    deleteLane(map, fromJuncIndex, toJuncIndex);
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} fromJuncIndex
 * @param {JunctionIndex} toJuncIndex
 * @returns {boolean}
 */
export function isJunctionConnectedTo(map, fromJuncIndex, toJuncIndex)
{
    let from = map.getJunction(fromJuncIndex);
    return from.hasOutlet(toJuncIndex);
}

/**
 * @param {JunctionMap} map 
 * @param {number} juncX 
 * @param {number} juncY 
 * @returns {boolean}
 */
export function isJunctionWithinBounds(map, juncX, juncY)
{
    return juncX >= 0 && juncY >= 0 && juncX < map.width && juncY < map.height;
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} outletIndex 
 * @param {JunctionIndex} juncIndex 
 * @returns {boolean}
 */
export function isJunctionOutletForJunction(map, outletIndex, juncIndex)
{
    let from = map.getJunction(juncIndex);
    return from.hasOutlet(outletIndex);
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} juncIndex
 */
export function removeJunction(map, juncIndex)
{
    let from = map.getJunction(juncIndex);
    if (!isJunctionEmpty(map, juncIndex))
    {
        let outlets = from.getOutlets();
        for(let outlet of outlets)
        {
            disconnectJunctions(map, juncIndex, outlet);
            if (isJunctionEmpty(map, outlet))
            {
                map.deleteJunction(outlet);
            }
        }
        let inlets = from.getInlets();
        for(let inlet of inlets)
        {
            disconnectJunctions(map, inlet, juncIndex);
            if (isJunctionEmpty(map, inlet))
            {
                map.deleteJunction(inlet);
            }
        }
    }
    map.deleteJunction(juncIndex);
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} juncIndex 
 * @returns {boolean}
 */
export function isJunctionEmpty(map, juncIndex)
{
    let junc = map.getJunction(juncIndex);
    return junc.isEmpty();
}

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} juncIndex 
 * @returns {boolean}
 */
export function isNullJunction(map, juncIndex)
{
    return juncIndex === -1 || !map.hasJunction(juncIndex);
}

export const LANE_SLOT_OFFSET = 0.5;

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {JunctionMap} map 
 */
export function drawJunctions(ctx, map, cellSize)
{
    const juncSize = cellSize / 2;
    const margin = (cellSize - juncSize) / 2;
    const laneRadius = juncSize / 3;
    ctx.lineWidth = laneRadius;
    ctx.strokeStyle = 'teal';
    for(let junc of map.getJunctions())
    {
        const { coordX, coordY } = junc;
        let xx = coordX * cellSize;
        let yy = coordY * cellSize;
        ctx.strokeRect(xx + margin, yy + margin, juncSize, juncSize);
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {JunctionMap} map 
 * @param {number} cellSize 
 * @param {number} laneRadius 
 * @param {number} junctionSize 
 */
export function drawLanes(ctx, map, cellSize)
{
    const juncSize = cellSize / 2;
    const laneRadius = juncSize / 3;
    ctx.lineWidth = laneRadius / 4;
    let laneId = 0;
    for(let y = 0; y < map.height; ++y)
    {
        for(let x = 0; x < map.width; ++x)
        {
            let i = x + y * map.width;
            if (!map.hasJunction(i)) continue;
            let junc = map.getJunction(i);
            let beginX = (x + 0.5) * cellSize;
            let beginY = (y + 0.5) * cellSize;
            for(let lane of junc.getLanes())
            {
                let [xx, yy] = getJunctionCoordsFromIndex(map, lane.outlet);
                let endX = (xx + 0.5) * cellSize;
                let endY = (yy + 0.5) * cellSize;
                let dx = endX - beginX;
                let dy = endY - beginY;
                let dr = Math.atan2(dy, dx);
                const laneLength = lane.length;
                let nodeRadius = (cellSize / 3) / laneLength;

                if (junc.passing)
                {
                    ctx.strokeStyle = 'red';
                }
                else
                {
                    ctx.strokeStyle = 'lime';
                }

                ctx.beginPath();
                ctx.arc(beginX, beginY, laneRadius / 2, 0, Math.PI * 2);
                ctx.stroke();

                // Lane Index
                /*
                ctx.lineWidth = 1;
                ctx.font = '32px Arial';
                ctx.strokeStyle = 'white';
                ctx.strokeText(`${laneId++}`, beginX + 8, beginY - 8);
                ctx.lineWidth = laneRadius / 4;
                */

                for(let i = 0; i < laneLength; ++i)
                {
                    let ratio = (i + LANE_SLOT_OFFSET) / laneLength;
                    let tx = beginX + dx * ratio;
                    let ty = beginY + dy * ratio;
                    if (lane.slots[i])
                    {
                        ctx.strokeStyle = 'red';
                    }
                    else
                    {
                        ctx.strokeStyle = 'white';
                    }
                    ctx.beginPath();
                    ctx.arc(tx, ty, nodeRadius, dr, dr + Math.PI);
                    ctx.stroke();
                }
            }
        }
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {JunctionMap} map 
 */
export function drawOutlets(ctx, map, cellSize)
{
    const juncSize = cellSize / 2;
    const laneRadius = juncSize;
    ctx.lineWidth = laneRadius;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#333333';
    for(let y = 0; y < map.height; ++y)
    {
        for(let x = 0; x < map.width; ++x)
        {
            let i = x + y * map.width;
            if (!map.hasJunction(i)) continue;
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

/**
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawPath(ctx, path, cellSize = 128, pathRadius = 2, junctionSize = 32)
{
    if (path && path.length > 1)
    {
        let [prevX, prevY] = getJunctionCoordsFromIndex(path[0]);
        for(let i = 1; i < path.length; ++i)
        {
            let [nextX, nextY] = getJunctionCoordsFromIndex(path[i]);
            let fx = prevX * cellSize + junctionSize / 2;
            let fy = prevY * cellSize + junctionSize / 2;
            let tx = nextX * cellSize + junctionSize / 2;
            let ty = nextY * cellSize + junctionSize / 2;
            let dx = nextX - prevX;
            let dy = nextY - prevY;
            ctx.lineWidth = pathRadius * 2;
            ctx.strokeStyle = 'gold';
            ctx.beginPath();
            ctx.moveTo(fx, fy);
            ctx.lineTo(tx, ty);
            ctx.moveTo(tx, ty);
            let radians = Math.atan2(dy, dx) - Math.PI;
            let arrowX = Math.cos(radians + Math.PI / 8) * pathRadius * 2;
            let arrowY = Math.sin(radians + Math.PI / 8) * pathRadius * 2;
            ctx.lineTo(tx + arrowX, ty + arrowY);
            ctx.stroke();
            prevX = nextX;
            prevY = nextY;
        }
    }
}
