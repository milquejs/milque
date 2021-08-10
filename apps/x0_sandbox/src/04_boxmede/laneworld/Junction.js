
/**
 * @typedef {import('../LaneWorld.js').LaneWorld} LaneWorld
 * @typedef {[number, number]} JunctionCoords
 * @typedef {number} JunctionIndex
 */

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

        /** @type {Array<JunctionIndex>} */
        this.outlets = [];
        /** @type {Array<JunctionIndex>} */
        this.inlets = [];
        /** @type {Record<JunctionIndex, Lane>} */
        this.lanes = {};

        /** @type {string} */
        this.passing = null;

        /** @type {number} */
        this.parkingCapacity = parkingCapacity;
        /** @type {number} */
        this.parking = 0;
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

export function randomOutletJunctionFromJunction(world, juncIndex)
{
    let outlets = getJunctionByIndex(world, juncIndex).outlets;
    let outlet = outlets[Math.floor(Math.random() * outlets.length)];
    return outlet;
}

/**
 * @param {LaneWorld} world 
 * @param {JunctionIndex} juncIndex 
 * @returns {Junction}
 */
export function getJunctionByIndex(world, juncIndex)
{
    if (typeof world !== 'object') throw new Error('Missing world.');
    return world.juncs[juncIndex];
}

/**
 * @param {LaneWorld} world 
 * @param {JunctionIndex} inletIndex 
 * @param {JunctionIndex} outletIndex
 * @returns {Lane}
 */
export function getJunctionLaneByIndex(world, inletIndex, outletIndex)
{
    if (typeof world !== 'object') throw new Error('Missing world.');
    let junc = getJunctionByIndex(world, inletIndex);
    return junc.lanes[outletIndex];
}

/**
 * @param {LaneWorld} world 
 * @param {number} juncX 
 * @param {number} juncY 
 * @returns {Junction}
 */
export function putJunction(world, coordX, coordY, parkingCapacity = 0)
{
    let junc = new Junction(coordX, coordY, parkingCapacity);
    world.juncs[getJunctionIndexFromCoords(world, coordX, coordY)] = junc;
    return junc;
}

/**
 * @param {LaneWorld} world 
 * @param {JunctionIndex} juncIndex 
 * @returns {JunctionCoords}
 */
export function getJunctionCoordsFromIndex(world, juncIndex)
{
    if (typeof world !== 'object') throw new Error('Missing world.');
    return [
        juncIndex % world.width,
        Math.floor(juncIndex / world.width),
    ];
}

/**
 * @param {LaneWorld} world 
 * @param {number} juncX 
 * @param {number} juncY 
 * @returns {JunctionIndex}
 */
export function getJunctionIndexFromCoords(world, juncX, juncY)
{
    if (typeof world !== 'object') throw new Error('Missing world.');
    return juncX + juncY * world.width;
}

/**
 * @param {LaneWorld} world 
 * @param {JunctionIndex} fromJuncIndex
 * @param {JunctionIndex} toJuncIndex
 */
export function connectJunction(world, fromJuncIndex, toJuncIndex, laneLength = 4)
{
    let from = getJunctionByIndex(world, fromJuncIndex);
    if (!from) throw new Error('Cannot connect from a non-existant junction.');
    let to = getJunctionByIndex(world, toJuncIndex);
    if (!to) throw new Error('Cannot connect to a non-existant junction.');

    if (from.outlets.includes(toJuncIndex)) throw new Error('Cannot connect junctions that are already connected!');
    from.outlets.push(toJuncIndex);
    from.lanes[toJuncIndex] = new Lane(fromJuncIndex, toJuncIndex, laneLength);

    if (to.inlets.includes(fromJuncIndex)) throw new Error('Cannot connect junctions that are already connected!');
    to.inlets.push(fromJuncIndex);
}

/**
 * @param {LaneWorld} world 
 * @param {JunctionIndex} fromJuncIndex
 * @param {JunctionIndex} toJuncIndex
 */
export function disconnectJunction(world, fromJuncIndex, toJuncIndex)
{
    /** @type {Junction} */
    let from = getJunctionByIndex(world, fromJuncIndex);
    if (!from) throw new Error('Cannot disconnect from a non-existant junction.');
    /** @type {Junction} */
    let to = getJunctionByIndex(world, toJuncIndex);
    if (!to) throw new Error('Cannot disconnect to a non-existant junction.');

    let outletIndex = from.outlets.indexOf(toJuncIndex);
    if (outletIndex < 0) throw new Error('Cannot disconnect junctions that are not connected!');
    from.outlets.splice(outletIndex, 1);

    /** @type {Lane} */
    let lane = from.lanes[toJuncIndex];
    if (lane.blocking < lane.length)
    {
        throw new Error('Cannot disconnect junctions with a non-vacated lane.');
    }
    delete from.lanes[toJuncIndex];

    let inletIndex = to.inlets.indexOf(fromJuncIndex);
    if (inletIndex < 0) throw new Error('Cannot disconnect junctions that are not connected!');
    to.inlets.splice(inletIndex, 1);
}

/**
 * @param {LaneWorld} world 
 * @param {JunctionIndex} fromJuncIndex
 * @param {JunctionIndex} toJuncIndex
 * @returns {boolean}
 */
export function isJunctionConnectedTo(world, fromJuncIndex, toJuncIndex)
{
    let junc = getJunctionByIndex(world, fromJuncIndex);
    // If outlet exist, can assume inlet exists as well.
    return junc.outlets.includes(toJuncIndex);
}

/**
 * @param {LaneWorld} world 
 * @param {number} juncX 
 * @param {number} juncY 
 * @returns {boolean}
 */
export function isJunctionWithinBounds(world, juncX, juncY)
{
    return juncX >= 0 && juncY >= 0 && juncX < world.width && juncY < world.height;
}

/**
 * @param {LaneWorld} world 
 * @param {JunctionIndex} outletIndex 
 * @param {JunctionIndex} juncIndex 
 * @returns {boolean}
 */
export function isJunctionOutletForJunction(world, outletIndex, juncIndex)
{
    let junc = getJunctionByIndex(world, juncIndex);
    if (junc)
    {
        return junc.outlets.includes(outletIndex);
    }
    return false;
}

/**
 * @param {LaneWorld} world 
 * @param {JunctionIndex} juncIndex
 */
export function deleteJunction(world, juncIndex)
{
    let from = getJunctionByIndex(world, juncIndex);
    if (!from) throw new Error('Cannot delete a non-existant junction.');
    for(let inletIndex of from.inlets)
    {
        disconnectJunction(world, inletIndex, juncIndex);
    }
    for(let outletIndex of from.outlets)
    {
        disconnectJunction(world, juncIndex, outletIndex);
    }
    delete world.juncs[juncIndex];
}

/**
 * @param {LaneWorld} world 
 * @param {JunctionIndex} juncIndex 
 * @returns {boolean}
 */
export function isNullJunction(world, juncIndex)
{
    if (typeof world !== 'object') throw new Error('Missing world.');
    return !(juncIndex in world.juncs);
}

export const LANE_SLOT_OFFSET = 0.5;

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {LaneWorld} world 
 */
export function drawJunctions(ctx, world, cellSize = 128, laneRadius = 4, junctionSize = 32)
{
    for(let junc of Object.values(world.juncs))
    {
        const { coordX, coordY } = junc;
        let xx = coordX * cellSize;
        let yy = coordY * cellSize;
        ctx.lineWidth = laneRadius * 2;
        ctx.strokeStyle = 'teal';
        ctx.strokeRect(xx, yy, junctionSize, junctionSize);
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {LaneWorld} world 
 * @param {number} cellSize 
 * @param {number} laneRadius 
 * @param {number} junctionSize 
 */
export function drawLanes(ctx, world, cellSize = 128, laneRadius = 4, junctionSize = 32)
{
    for(let y = 0; y < world.height; ++y)
    {
        for(let x = 0; x < world.width; ++x)
        {
            let junc = world.juncs[x + y * world.width];
            if (junc)
            {
                let beginX = x * cellSize + junctionSize / 2;
                let beginY = y * cellSize + junctionSize / 2;
                for(let outlet of junc.outlets)
                {
                    let [xx, yy] = getJunctionCoordsFromIndex(world, outlet);
                    let endX = xx * cellSize + junctionSize / 2;
                    let endY = yy * cellSize + junctionSize / 2;

                    if (junc.passing)
                    {
                        ctx.strokeStyle = 'red';
                    }
                    else
                    {
                        ctx.strokeStyle = 'lime';
                    }

                    ctx.beginPath();
                    ctx.arc(beginX, beginY, laneRadius, 0, Math.PI * 2);
                    ctx.stroke();

                    let dx = endX - beginX;
                    let dy = endY - beginY;
                    let dr = Math.atan2(dy, dx);
                    let lane = junc.lanes[outlet];
                    const laneLength = lane.length;
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
                        ctx.arc(tx, ty, laneRadius, dr, dr + Math.PI);
                        ctx.stroke();
                    }
                }
            }
        }
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {LaneWorld} world 
 */
export function drawOutlets(ctx, world, cellSize = 128, laneRadius = 4, junctionSize = 32)
{
    for(let y = 0; y < world.height; ++y)
    {
        for(let x = 0; x < world.width; ++x)
        {
            let junc = world.juncs[x + y * world.width];
            if (junc)
            {
                let halfJunctionSize = junctionSize / 2;
                let beginX = x * cellSize + halfJunctionSize;
                let beginY = y * cellSize + halfJunctionSize;
                for(let outlet of junc.outlets)
                {
                    let [xx, yy] = getJunctionCoordsFromIndex(world, outlet);
                    let endX = xx * cellSize + halfJunctionSize;
                    let endY = yy * cellSize + halfJunctionSize;
                    ctx.lineWidth = laneRadius * 2;
                    ctx.strokeStyle = '#333';
                    ctx.beginPath();
                    ctx.moveTo(beginX, beginY);
                    ctx.lineTo(endX, endY);
                    ctx.stroke();
                }
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
