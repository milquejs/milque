import { lerp, lookAt2, uuid } from '@milque/util';
import { updateNavigation } from './Navigator.js';
import { getJunctionByIndex, getJunctionCoordsFromIndex, getJunctionIndexFromCoords, getJunctionLaneByIndex, isJunctionOutletForJunction, isNullJunction, LANE_SLOT_OFFSET } from './Junction.js';
import { Lane } from '../cellworld/Lane.js';

/**
 * @typedef {import('./LaneWorld.js').LaneWorld} LaneWorld
 */

export const NULL_JUNCTION_INDEX = -1;
export const NULL_SLOT_INDEX = -1;

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

        let map = world.map;
        this.home = getJunctionIndexFromCoords(map, juncX, juncY);
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
    let map = world.map;
    let juncIndex = getJunctionIndexFromCoords(map, juncX, juncY);
    if (tryAcquireParkingInJunction(world, cartId, juncIndex))
    {
        forceCartOnJunction(world, cartId, juncIndex);
    }
    else
    {
        throw new Error('Unable to park cart on junction.');
    }
}

/**
 * @param {LaneWorld} world 
 * @param {*} cartId 
 * @param {*} outletIndex 
 * @param {*} steps 
 * @returns 
 */
export function moveCartTowards(world, cartId, outletIndex, steps)
{
    let cart = getCartById(world, cartId);
    let map = world.juncMap;
    let junc = getJunctionByIndex(map, cart.currentJunction);
    if (!junc.outlets.includes(outletIndex))
    {
        throw new Error(`Missing outlet '${getJunctionCoordsFromIndex(map, outletIndex)}' at junction '${getJunctionCoordsFromIndex(map, cart.currentJunction)}' to move cart towards.`);
    }
    let lane = junc.lanes[outletIndex];
    if (isNullJunction(map, cart.currentOutlet))
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
            if (isNullJunction(map, aheadNextJunc))
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
    let map = world.juncMap;
    let junc = getJunctionByIndex(map, juncIndex);
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
    let map = world.juncMap;
    let lane = getJunctionLaneByIndex(map, inletIndex, outletIndex);
    if (!lane) throw new Error(`Cannot find lane for given inlet '${getJunctionCoordsFromIndex(map, inletIndex)}' and outlet '${getJunctionCoordsFromIndex(map, outletIndex)}'.`);
    let slot = getFurthestAvailableSlotInLane(map, lane, 0);
    return slot >= 0;
}

function tryAcquirePassThroughJunction(world, cartId, juncIndex)
{
    if (juncIndex < 0) throw new Error('Junction index must be non-negative.');
    let map = world.juncMap;
    let junc = getJunctionByIndex(map, juncIndex);
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

function getFurthestAvailableSlotInLane(map, lane, initialSlot)
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
    let map = world.juncMap;
    if (!isNullJunction(map, cart.currentJunction))
    {
        // Remove from previous junction.
        let junc = getJunctionByIndex(map, cart.currentJunction);
        if (!isNullJunction(map, cart.currentOutlet))
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
    let map = world.juncMap;
    let junc = getJunctionByIndex(map, cart.currentJunction);
    let lane = junc.lanes[outlet];
    if (!isNullJunction(map, cart.currentOutlet))
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
    if (isNullJunction(map, outlet) || !isJunctionOutletForJunction(map, outlet, cart.currentJunction))
    {
        throw new Error(`Cannot put cart on non-existant lane with inlet '${getJunctionCoordsFromIndex(map, cart.currentJunction)}' and outlet '${getJunctionCoordsFromIndex(map, outlet)}'.`);
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
    let map = world.juncMap;
    const worldTicks = ++world.worldTicks;
    // Update carts
    for(let cart of Object.values(world.carts))
    {
        if (cart.lastUpdatedTicks < worldTicks)
        {
            let targetOutlet = cart.currentOutlet;
            cart.lastUpdatedTicks = worldTicks;
            // Carts should always be on a junction.
            if (isNullJunction(map, cart.currentJunction))
            {
                throw new Error('Cart is not on a junction!');
            }
            // Passing junctions only last for 1 tick.
            if (!isNullJunction(map, cart.passingJunction))
            {
                let map = world.juncMap;
                let junc = getJunctionByIndex(map, cart.passingJunction);
                junc.passing = null;
                cart.passingJunction = NULL_JUNCTION_INDEX;
            }
            // If not moving on a lane, try starting to.
            if (isNullJunction(map, cart.currentOutlet))
            {
                targetOutlet = updateNavigation(world, cart.id);
                if (isNullJunction(map, targetOutlet))
                {
                    continue;
                }
            }
            // Validate cart junction and outlet are correct before moving.
            if (!isJunctionOutletForJunction(map, targetOutlet, cart.currentJunction))
            {
                throw new Error(`Next junction outlet '${getJunctionCoordsFromIndex(map, targetOutlet)}' is not for junction '${getJunctionCoordsFromIndex(map, cart.currentJunction)}'.`);
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
 * @param {CanvasRenderingContext2D} ctx
 * @param {LaneWorld} world
 */
export function drawCarts(ctx, world, cellSize = 128, junctionSize = 32, cartRadius = 10)
{
    const HALF_JUNC_SIZE = junctionSize / 2;
    const FRAMES_PER_TICK = 15;
    const FRAMES_PER_HALF_TICK = FRAMES_PER_TICK / 2;
    const OFFSET_FRAMES = 5;
    let frameTime = Math.max(1, Math.min(FRAMES_PER_TICK, FRAMES_PER_TICK + OFFSET_FRAMES - (world.tickFrames + 1)));
    let dt = 1 / frameTime;
    let map = world.juncMap;
    for(let cart of Object.values(world.carts))
    {
        let [jx, jy] = getJunctionCoordsFromIndex(map, cart.currentJunction);
        let kx = jx;
        let ky = jy;
        if (!isNullJunction(map, cart.currentOutlet))
        {
            if (frameTime > FRAMES_PER_HALF_TICK && !isNullJunction(map, cart.passingJunction))
            {
                let [nx, ny] = getJunctionCoordsFromIndex(map, cart.passingJunction);
                kx = nx;
                ky = ny;
            }
            else if (cart.currentSlot >= 0)
            {
                let [nx, ny] = getJunctionCoordsFromIndex(map, cart.currentOutlet);
                let lane = getJunctionLaneByIndex(map, cart.currentJunction, cart.currentOutlet);
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
        if (!isNullJunction(map, cart.parkingJunction))
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
 