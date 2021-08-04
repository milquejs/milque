import { lerp, lookAt2, uuid } from '@milque/util';
import { updateNavigation } from './Navigator.js';

/**
 * @typedef {import('./LaneWorld.js').LaneWorld} LaneWorld
 * @typedef {[number, number]} JunctionCoords
 * @typedef {number} JunctionIndex
 */

export const NULL_JUNCTION_INDEX = -1;
export const NULL_SLOT_INDEX = -1;

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
        this.blocking = length; // TODO: Not yet implemented. Should allow faster blocking checks.
    }
}

export class Cart
{
    constructor(world, id, juncX, juncY)
    {
        this.id = id;
        this.lastUpdatedTicks = -1;
        this.currentJunction = NULL_JUNCTION_INDEX;
        this.currentOutlet = NULL_JUNCTION_INDEX;
        this.currentSlot = NULL_SLOT_INDEX;
        this.maxLaneSpeed = 1;

        this.passingJunction = NULL_JUNCTION_INDEX;
        this.parkingJunction = NULL_JUNCTION_INDEX;

        this.x = juncX;
        this.y = juncY;
        this.radians = 0;
        this.speed = 0;

        this.home = getJunctionIndexFromCoords(world, juncX, juncY);
        this.path = [];
        this.pathIndex = -1;
        this.state = 0;
        this.lastStateChangedTicks = -1;
    }

    /** @override */
    toString()
    {
        return `[Cart ${this.id} : ${this.status}]`;
    }
}

export function createCart(world, juncX, juncY)
{
    let cartId = uuid();
    let cart = new Cart(world, cartId, juncX, juncY);
    world.carts[cartId] = cart;
    let juncIndex = getJunctionIndexFromCoords(world, juncX, juncY);
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
    if (!junc.outlets.includes(outletIndex))
    {
        throw new Error(`Missing outlet '${getJunctionCoordsFromIndex(world, outletIndex)}' at junction '${getJunctionCoordsFromIndex(world, cart.currentJunction)}' to move cart towards.`);
    }
    let lane = junc.lanes[outletIndex];
    if (isNullJunction(world, cart.currentOutlet))
    {
        // Not on the way yet. Try to merge into a lane.
        let furthest = getFurthestAvailableSlotInLane(world, lane, 0);
        if (furthest > 0)
        {
            // Move the cart (it takes 1 step to move out of parking).
            let nextSlot = Math.min(furthest, steps - 1);
            forceCartOnLane(world, cartId, outletIndex, nextSlot);
            return;
        }
        else
        {
            // Blocked at destination but unable to get into it.
            // Cannot move in as it is blocked.
            return;
        }
    }
    else
    {
        // Already on the way. Try to move forward.
        let prevSlot = cart.currentSlot;
        let nextSlot = prevSlot + steps;
        let furthest = getFurthestAvailableSlotInLane(world, lane, prevSlot + 1);
        // There's no blockers and total movement will exit the lane
        if (furthest >= lane.length && nextSlot >= lane.length)
        {
            let aheadNextJunc = lookAheadNavigation(world, cartId, outletIndex);
            if (isNullJunction(world, aheadNextJunc))
            {
                // Navigation is stopping at this junction. Slow down.
                if (tryAcquireParkingInJunction(world, cartId, outletIndex))
                {
                    // Parking. Any remaining movement is ignored.
                    forceCartOnJunction(world, cartId, outletIndex);
                    return;
                }
                else
                {
                    // This only happens when a cart is going to a non-parkable junction
                    forceCartOnJunction(world, cartId, outletIndex);
                    return;
                }
            }
            else if (canJunctionLaneAcceptCart(world, outletIndex, aheadNextJunc) && tryAcquirePassThroughJunction(world, cartId, outletIndex))
            {
                // Navigation has more junctions to visit and the next junction can accept this cart without blockers
                cart.passingSlot = prevSlot;
                forceCartOnJunction(world, cartId, outletIndex);
                forceCartOnLane(world, cartId, aheadNextJunc, 0);
                // ...if there's movement left, continue down the lane?
                let aheadNextSteps = nextSlot - lane.length;
                if (aheadNextSteps > 0)
                {
                    moveCartTowards(world, cartId, aheadNextJunc, aheadNextSteps);
                }
                return;
            }
            else
            {
                // Move forward as far as possible before the blocker.
                nextSlot = Math.min(lane.length - 1, furthest, nextSlot);
                forceCartOnLane(world, cartId, outletIndex, nextSlot);
                return;
            }
        }
        else
        {
            // Move forward as far as possible before the blocker.
            nextSlot = Math.min(lane.length - 1, furthest, nextSlot);
            forceCartOnLane(world, cartId, outletIndex, nextSlot);
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
        let cart = getCartById(world, cartId);
        cart.parkingJunction = juncIndex;
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
    if (!lane) throw new Error(`Cannot find lane for given inlet '${getJunctionCoordsFromIndex(world, inletIndex)}' and outlet '${getJunctionCoordsFromIndex(world, outletIndex)}'.`);
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

function lookAheadNavigation(world, cartId, outletIndex)
{
    let cart = getCartById(world, cartId);
    if (cart.pathIndex >= 0)
    {
        let i = cart.path.indexOf(outletIndex);
        if (i < 0)
        {
            throw new Error('Missing outlet in path.');
        }
        else if (i + 1 < cart.path.length)
        {
            return cart.path[i + 1];
        }
    }
    return NULL_JUNCTION_INDEX;
}

export function randomOutletJunctionFromJunction(world, juncIndex)
{
    let outlets = getJunctionByIndex(world, juncIndex).outlets;
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
    if (!isNullJunction(world, cart.currentJunction))
    {
        // Remove from previous junction.
        let junc = world.juncs[cart.currentJunction];
        if (!isNullJunction(world, cart.currentOutlet))
        {
            // Remove from previous lane.
            let lane = junc.lanes[cart.currentOutlet];
            if (cart.currentSlot < 0 || cart.currentSlot >= lane.length)
            {
                throw new Error('Cannot remove cart not in a valid slot.');
            }
            lane.slots[cart.currentSlot] = null;
        }
        else if (cart.parkingJunction === cart.currentJunction)
        {
            // No longer parked there.
            cart.parkingJunction = NULL_JUNCTION_INDEX;
            junc.parking -= 1;
            if (junc.parking < 0)
            {
                throw new Error('Found junction parking under 0.');
            }
        }
    }
    cart.currentJunction = juncIndex;
    cart.currentOutlet = NULL_JUNCTION_INDEX;
    cart.currentSlot = NULL_SLOT_INDEX;
}

/**
 * @param {LaneWorld} world 
 * @param {string} cartId 
 * @param {JunctionIndex} outlet 
 * @param {number} slot 
 */
export function forceCartOnLane(world, cartId, outlet, slot)
{
    let cart = getCartById(world, cartId);
    let junc = getJunctionByIndex(world, cart.currentJunction);
    let lane = junc.lanes[outlet];
    if (!isNullJunction(world, cart.currentOutlet))
    {
        if (cart.currentSlot >= 0)
        {
            let prevSlot = cart.currentSlot;
            cart.currentOutlet = NULL_JUNCTION_INDEX;
            cart.currentSlot = NULL_SLOT_INDEX;
            lane.slots[prevSlot] = undefined;
        }
        else
        {
            throw new Error('Found cart with non-null outlet on null slot.');
        }
    }
    else if (cart.parkingJunction === cart.currentJunction)
    {
        // No longer parked. We are moving out!
        cart.parkingJunction = NULL_JUNCTION_INDEX;
        junc.parking -= 1;
        if (junc.parking < 0)
        {
            throw new Error('Found junction parking under 0.');
        }
    }
    if (isNullJunction(world, outlet) || !isJunctionOutletForJunction(world, outlet, cart.currentJunction))
    {
        throw new Error(`Cannot put cart on non-existant lane with inlet '${getJunctionCoordsFromIndex(world, cart.currentJunction)}' and outlet '${getJunctionCoordsFromIndex(world, outlet)}'.`);
    }
    if (slot < 0 || slot >= lane.length)
    {
        throw new Error(`Cannot put cart on slot index ${slot} out of bounds for lane - must be within [0, ${lane.length}).`);
    }
    cart.currentOutlet = outlet;
    cart.currentSlot = slot;
    lane.slots[slot] = cartId;
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
            let targetOutlet = cart.currentOutlet;
            cart.lastUpdatedTicks = worldTicks;
            // Carts should always be on a junction.
            if (isNullJunction(world, cart.currentJunction))
            {
                throw new Error('Cart is not on a junction!');
            }
            // Passing junctions only last for 1 tick.
            if (!isNullJunction(world, cart.passingJunction))
            {
                let junc = getJunctionByIndex(world, cart.passingJunction);
                junc.passing = null;
                cart.passingJunction = NULL_JUNCTION_INDEX;
            }
            // If not moving on a lane, try starting to.
            if (isNullJunction(world, cart.currentOutlet))
            {
                targetOutlet = updateNavigation(world, cart.id);
                if (isNullJunction(world, targetOutlet))
                {
                    continue;
                }
            }
            // Validate cart junction and outlet are correct before moving.
            if (!isJunctionOutletForJunction(world, targetOutlet, cart.currentJunction))
            {
                throw new Error(`Next junction outlet '${getJunctionCoordsFromIndex(world, targetOutlet)}' is not for junction '${getJunctionCoordsFromIndex(world, cart.currentJunction)}'.`);
            }
            moveCartTowards(world, cart.id, targetOutlet, cart.maxLaneSpeed);
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
 * @param {JunctionIndex} outletIndex 
 * @param {JunctionIndex} juncIndex 
 * @returns {boolean}
 */
export function isJunctionOutletForJunction(world, outletIndex, juncIndex)
{
    let junc = world.juncs[juncIndex];
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

/**
 * @param {LaneWorld} world 
 * @param {JunctionIndex} juncIndex 
 * @returns {boolean}
 */
export function isNullJunction(world, juncIndex)
{
    if (typeof world !== 'object') throw new Error('Missing world.');
    return typeof juncIndex !== 'number'
        || Number.isNaN(juncIndex)
        || juncIndex < 0
        || juncIndex >= world.juncs.length;
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
        if (!isNullJunction(world, cart.currentOutlet))
        {
            if (frameTime > FRAMES_PER_HALF_TICK && !isNullJunction(world, cart.passingJunction))
            {
                let [nx, ny] = getJunctionCoordsFromIndex(world, cart.passingJunction);
                kx = nx;
                ky = ny;
            }
            else if (cart.currentSlot >= 0)
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
        if (!isNullJunction(world, cart.parkingJunction))
        {
            ctx.strokeStyle = 'gray';
        }
        else
        {
            ctx.strokeStyle = 'gold';
        }
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
