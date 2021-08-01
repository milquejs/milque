import { lerp, lookAt2, uuid } from '@milque/util';

/**
 * @typedef {import('./LaneWorld.js').LaneWorld} LaneWorld
 * @typedef {[number, number]} JunctionCoords
 * @typedef {number} JunctionIndex
 */

export class Junction
{
    constructor(parkingCapacity)
    {
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
        this.blocking = length;
    }
}

export class Cart
{
    constructor(id, juncX, juncY)
    {
        this.id = id;
        this.lastUpdatedTicks = -1;
        this.currentJunction = -1;
        this.currentOutlet = -1;
        this.currentSlot = -1;
        this.passingJunction = -1;
        this.maxLaneSpeed = 2;

        this.x = juncX;
        this.y = juncY;
        this.radians = 0;
        this.speed = 0;
    }
}

export function createCart(world, juncX, juncY)
{
    let cartId = uuid();
    let cart = new Cart(cartId, juncX, juncY);
    world.carts[cartId] = cart;
    parkCartOnJunction(world, cartId, getJunctionIndexFromCoords(world, juncX, juncY));
}

export function parkCartOnJunction(world, cartId, juncIndex)
{
    if (tryAcquireParkingInJunction(world, cartId, juncIndex))
    {
        forceCartOnJunction(world, cartId, juncIndex);
    }
    else
    {
        throw new Error('Unable to park cart on junction.');
    }
}

export function moveCartTowards(world, cartId, outletIndex, steps)
{
    let cart = getCartById(world, cartId);
    let junc = getJunctionByIndex(world, cart.currentJunction);
    if (!junc.outlets.includes(outletIndex)) throw new Error('Missing outlet at junction to move cart towards.');
    let lane = junc.lanes[outletIndex];
    if (cart.currentOutlet === -1)
    {
        // Not on the way yet. Try to merge into a lane.
        let furthest = getFurthestAvailableSlotInLane(world, lane, 0);
        if (furthest > 0)
        {
            // No longer parking in the junction.
            if (junc.parking > 0)
            {
                junc.parking -= 1;
            }
            // Move the cart.
            let nextSlot = Math.min(furthest, steps);
            cart.currentOutlet = outletIndex;
            cart.currentSlot = nextSlot;
            lane.slots[nextSlot] = cart.id;
            if (nextSlot >= lane.length) throw new Error('Cannot put cart in slot greater than lane length.');
            return;
        }
        else
        {
            // Cannot move in as it is blocked.
            return;
        }
    }
    else
    {
        // Already on the way. Try to move forward.
        let prevSlot = cart.currentSlot;
        let furthest = getFurthestAvailableSlotInLane(world, lane, prevSlot + 1);
        let nextSlot = prevSlot + steps;
        if (furthest >= lane.length && nextSlot >= lane.length)
        {
            if (tryAcquireParkingInJunction(world, cartId, outletIndex))
            {
                forceCartOnJunction(world, cartId, outletIndex);
                let nextJunc = nextJunctionForCart(world, cartId);
                moveCartTowards(world, cartId, nextJunc, nextSlot - lane.length);
            }
            else
            {
                let aheadNextJunc = peekAheadNextJunctionForCart(world, cartId, outletIndex);
                if (canJunctionLaneAcceptCart(world, outletIndex, aheadNextJunc) && tryAcquirePassThroughJunction(world, cartId, outletIndex))
                {
                    // No blockers. Full steam ahead!
                    cart.passingSlot = prevSlot;
                    forceCartOnJunction(world, cartId, outletIndex);
                    nextJunctionForCart(world, cartId);
                    moveCartTowards(world, cartId, aheadNextJunc, nextSlot - lane.length);
                    return;
                }
                else
                {
                    // Move forward as far as possible before the blocker.
                    nextSlot = Math.min(lane.length - 1, furthest, nextSlot);
                    cart.currentOutlet = outletIndex;
                    cart.currentSlot = nextSlot;
                    lane.slots[prevSlot] = undefined;
                    lane.slots[nextSlot] = cart.id;
                    if (nextSlot >= lane.length) throw new Error('Cannot put cart in slot greater than lane length.');
                    return;
                }
            }
        }
        else
        {
            // Move forward as far as possible before the blocker.
            nextSlot = Math.min(lane.length - 1, furthest, nextSlot);
            cart.currentOutlet = outletIndex;
            cart.currentSlot = nextSlot;
            lane.slots[prevSlot] = undefined;
            lane.slots[nextSlot] = cart.id;
            if (nextSlot >= lane.length) throw new Error('Cannot put cart in slot greater than lane length.');
            return;
        }
    }
}

function tryAcquireParkingInJunction(world, cartId, juncIndex)
{
    if (juncIndex < 0) throw new Error('Junction index must be non-negative.');
    let junc = getJunctionByIndex(world, juncIndex);
    if (junc.parking < junc.parkingCapacity)
    {
        junc.parking += 1;
        return true;
    }
    else
    {
        return false;
    }
}

function canJunctionLaneAcceptCart(world, inletIndex, outletIndex)
{
    if (inletIndex < 0 || outletIndex < 0) throw new Error('Junction index must be non-negative.');
    let lane = getJunctionLaneByIndex(world, inletIndex, outletIndex);
    if (!lane) throw new Error('Cannot find lane for given inlet and outlet.');
    let slot = getFurthestAvailableSlotInLane(world, lane, 0);
    return slot >= 0;
}

function tryAcquirePassThroughJunction(world, cartId, juncIndex)
{
    if (juncIndex < 0) throw new Error('Junction index must be non-negative.');
    let junc = world.juncs[juncIndex];
    if (!junc.passing)
    {
        junc.passing = cartId;
        let cart = getCartById(world, cartId);
        cart.passingJunction = juncIndex;
        return true;
    }
    else
    {
        return false;
    }
}

function nextJunctionForCart(world, cartId)
{
    let cart = world.carts[cartId];
    return peekAheadNextJunctionForCart(world, cartId, cart.currentJunction);
}

function peekAheadNextJunctionForCart(world, cartId, nextJuncIndex)
{
    let outlets = getJunctionByIndex(world, nextJuncIndex).outlets;
    let outlet = outlets[Math.floor(Math.random() * outlets.length)];
    return outlet;
}

function getFurthestAvailableSlotInLane(world, lane, initialSlot)
{
    if (!(lane instanceof Lane)) throw new Error(`Invalid lane - ${lane}`);
    if (initialSlot < 0) throw new Error('Slot must be non-negative.');
    for(let i = initialSlot; i < lane.length; ++i)
    {
        if (lane.slots[i])
        {
            return i - 1;
        }
    }
    return lane.length;
}

/**
 * @param {LaneWorld} world 
 * @param {string} cartId 
 * @param {JunctionIndex} juncIndex 
 */
export function forceCartOnJunction(world, cartId, juncIndex)
{
    if (typeof juncIndex !== 'number' || Number.isNaN(juncIndex))
    {
        throw new Error('Invalid junction index.');
    }
    let cart = world.carts[cartId];
    if (cart.currentJunction !== -1)
    {
        // Remove from previous junction.
        let junc = world.juncs[cart.currentJunction];
        if (cart.currentOutlet !== -1)
        {
            // Remove from previous lane.
            let lane = junc.lanes[cart.currentOutlet];
            if (cart.currentSlot < 0 || cart.currentSlot >= lane.length)
            {
                throw new Error('Cannot remove cart not in a valid slot.');
            }
            lane.slots[cart.currentSlot] = null;
        }
        else if (junc.parking > 0)
        {
            // No longer parked there.
            junc.parking -= 1;
        }
    }
    cart.currentJunction = juncIndex;
    cart.currentOutlet = -1;
    cart.currentSlot = -1;
}

/**
 * @param {LaneWorld} world 
 */
export function updateTraffic(world)
{
    const worldTicks = ++world.worldTicks;
    // Update carts
    for(let cart of Object.values(world.carts))
    {
        if (cart.lastUpdatedTicks < worldTicks)
        {
            cart.lastUpdatedTicks = worldTicks;
            if (cart.currentJunction === -1)
            {
                throw new Error('Cart is not on a junction!');
            }
            if (cart.passingJunction !== -1)
            {
                let junc = getJunctionByIndex(world, cart.passingJunction);
                junc.passing = null;
                cart.passingJunction = -1;
            }
            if (cart.currentOutlet === -1)
            {
                let outlet = nextJunctionForCart(world, cart.id);
                cart.currentOutlet = outlet;
            }
            moveCartTowards(world, cart.id, cart.currentOutlet, cart.maxLaneSpeed);
        }
    }
}

/**
 * @param {LaneWorld} world 
 * @param {CartId} cartId 
 * @returns {Cart}
 */
export function getCartById(world, cartId)
{
    if (typeof world !== 'object') throw new Error('Missing world.');
    return world.carts[cartId];
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
    let junc = world.juncs[inletIndex];
    return junc.lanes[outletIndex];
}

/**
 * @param {LaneWorld} world 
 * @param {number} juncX 
 * @param {number} juncY 
 * @returns {Junction}
 */
export function putJunction(world, juncX, juncY, parkingCapacity = 0)
{
    let junc = new Junction(parkingCapacity);
    world.juncs[getJunctionIndexFromCoords(world, juncX, juncY)] = junc;
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
    let from = world.juncs[fromJuncIndex];
    if (!from) throw new Error('Cannot connect from a non-existant junction.');
    let to = world.juncs[toJuncIndex];
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
    let from = world.juncs[fromJuncIndex];
    if (!from) throw new Error('Cannot disconnect from a non-existant junction.');
    /** @type {Junction} */
    let to = world.juncs[toJuncIndex];
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
    let junc = world.juncs[fromJuncIndex];
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
 * @param {JunctionIndex} juncIndex
 */
export function deleteJunction(world, juncIndex)
{
    let from = world.juncs[juncIndex];
    if (!from) throw new Error('Cannot delete a non-existant junction.');
    for(let inletIndex of from.inlets)
    {
        disconnectJunction(world, inletIndex, juncIndex);
    }
    for(let outletIndex of from.outlets)
    {
        disconnectJunction(world, juncIndex, outletIndex);
    }
    world.juncs[juncIndex] = null;
}

const LANE_SLOT_OFFSET = 0.5;

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {LaneWorld} world 
 */
export function drawJunctions(ctx, world, cellSize = 128, laneRadius = 4, junctionSize = 32)
{
    for(let y = 0; y < world.height; ++y)
    {
        for(let x = 0; x < world.width; ++x)
        {
            let junc = world.juncs[x + y * world.width];
            if (junc)
            {
                let xx = x * cellSize;
                let yy = y * cellSize;
                ctx.lineWidth = laneRadius * 2;
                ctx.strokeStyle = 'teal';
                ctx.strokeRect(xx, yy, junctionSize, junctionSize);
            }
        }
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
 * @param {LaneWorld} world
 */
export function drawCarts(ctx, world, cellSize = 128, junctionSize = 32, cartRadius = 10)
{
    const HALF_JUNC_SIZE = junctionSize / 2;
    const FRAMES_PER_TICK = 50;
    const FRAMES_PER_HALF_TICK = FRAMES_PER_TICK / 2;
    const OFFSET_FRAMES = 5;
    let frameTime = Math.max(1, Math.min(FRAMES_PER_TICK, FRAMES_PER_TICK + OFFSET_FRAMES - (world.tickFrames + 1)));
    let dt = 1 / frameTime;
    for(let cart of Object.values(world.carts))
    {
        let [jx, jy] = getJunctionCoordsFromIndex(world, cart.currentJunction);
        let kx = jx;
        let ky = jy;
        if (cart.currentOutlet !== -1)
        {
            if (frameTime > FRAMES_PER_HALF_TICK && cart.passingJunction !== -1)
            {
                let [nx, ny] = getJunctionCoordsFromIndex(world, cart.passingJunction);
                kx = nx;
                ky = ny;
            }
            else if (cart.currentSlot !== -1)
            {
                let [nx, ny] = getJunctionCoordsFromIndex(world, cart.currentOutlet);
                let lane = getJunctionLaneByIndex(world, cart.currentJunction, cart.currentOutlet);
                let ratio = (cart.currentSlot + LANE_SLOT_OFFSET) / lane.length;
                kx = jx + (nx - jx) * ratio;
                ky = jy + (ny - jy) * ratio;
            }
        }
        let dx = kx - cart.x;
        let dy = ky - cart.y;
        let distSqu = dx * dx + dy * dy;
        let dist = Math.sqrt(distSqu);
        let epsilon = 1 / cellSize;
        cart.speed = lerp(cart.speed, dist * dt, 0.1);
        if (dist > epsilon)
        {
            let dr = Math.atan2(dy, dx);
            if (cart.speed > 0)
            {
                cart.x += Math.cos(dr) * cart.speed;
                cart.y += Math.sin(dr) * cart.speed;
                cart.radians = lookAt2(cart.radians, dr, 0.2);
            }
        }
        ctx.strokeStyle = 'gold';
        ctx.beginPath();
        ctx.arc(cart.x * cellSize + HALF_JUNC_SIZE, cart.y * cellSize + HALF_JUNC_SIZE, cartRadius, cart.radians, cart.radians + Math.PI);
        ctx.stroke();
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