import { lerp, lookAt2, uuid } from '@milque/util';
import { getJunctionByIndex, getJunctionCoordsFromIndex, getJunctionIndexFromCoords, getJunctionLaneByIndex, isJunctionOutletForJunction, isNullJunction, LANE_SLOT_OFFSET } from '../laneworld/Junction.js';

export const NULL_JUNCTION_INDEX = -1;
export const NULL_SLOT_INDEX = -1;
export const FRAMES_PER_TICK = 30;
export const FRAMES_PER_HALF_TICK = FRAMES_PER_TICK / 2;
export const OFFSET_FRAMES = 5;

export class CartManager
{
    constructor(junctionMap)
    {
        this.junctionMap = junctionMap;
        this.carts = {};

        this.worldTicks = 0;
        this.tickFrames = 0;
    }

    createCart(homeIndex)
    {
        let [x, y] = getJunctionCoordsFromIndex(this.junctionMap, homeIndex);
        let cartId = uuid();
        let cart = new Cart(cartId, x + 0.5, y + 0.5, 0, homeIndex);
        this.carts[cartId] = cart;
        if (tryAcquireParkingInJunction(this, this.junctionMap, cartId, homeIndex))
        {
            forceCartOnJunction(this, this.junctionMap, cartId, homeIndex);
        }
        else
        {
            throw new Error('Unable to park cart on junction.');
        }
        return cart;
    }

    update(world)
    {
        if (++this.tickFrames > FRAMES_PER_TICK)
        {
            this.tickFrames = 0;
            updateTraffic(world, this, this.junctionMap, world.navigator);
        }
    }
}

export class Cart
{
    constructor(id, coordX, coordY, radians, homeIndex)
    {
        this.id = id;
        this.lastUpdatedTicks = -1;
        this.currentJunction = NULL_JUNCTION_INDEX;
        this.currentOutlet = NULL_JUNCTION_INDEX;
        this.currentSlot = NULL_SLOT_INDEX;
        this.maxLaneSpeed = 2;

        this.passingJunction = NULL_JUNCTION_INDEX;
        this.parkingJunction = NULL_JUNCTION_INDEX;

        this.prevX = coordX;
        this.prevY = coordY;
        this.x = coordX;
        this.y = coordY;
        this.radians = radians;
        this.speed = 0;

        this.homeIndex = homeIndex;
        this.path = [];
        this.pathId = null;
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

function forwardCart(cartManager, junctionMap, cartId, steps)
{
    let cart = getCartById(cartManager, cartId);
    let juncIndex = cart.currentJunction;
    let nextIndex = getNextJunction(cart);
    let lane = getJunctionLaneByIndex(junctionMap, juncIndex, nextIndex);
    if (isNullJunction(junctionMap, cart.currentOutlet))
    {
        // Not on the way yet. Try to merge into a lane.
        let furthest = getFurthestAvailableSlotInLane(junctionMap, lane, 0);
        if (furthest > 0)
        {
            // Move the cart (it takes 1 step to move out of parking).
            let nextSlot = Math.min(furthest, steps - 1);
            forceCartOnLane(cartManager, junctionMap, cartId, nextIndex, nextSlot);
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
        let furthest = getFurthestAvailableSlotInLane(junctionMap, lane, prevSlot + 1);
        // There's no blockers and total movement will exit the lane
        if (furthest >= lane.length && nextSlot >= lane.length)
        {
            let aheadNextJunc = lookAheadNavigation(cartManager, cartId, nextIndex);
            if (isNullJunction(junctionMap, aheadNextJunc))
            {
                // Navigation is stopping at this junction. Slow down.
                if (tryAcquireParkingInJunction(cartManager, junctionMap, cartId, nextIndex))
                {
                    // Parking. Any remaining movement is ignored.
                    forceCartOnJunction(cartManager, junctionMap, cartId, nextIndex);
                    return;
                }
                else
                {
                    // This only happens when a cart is going to a non-parkable junction
                    forceCartOnJunction(cartManager, junctionMap, cartId, nextIndex);
                    return;
                }
            }
            else if (canJunctionLaneAcceptCart(junctionMap, nextIndex, aheadNextJunc) && tryAcquirePassThroughJunction(cartManager, junctionMap, cartId, nextIndex))
            {
                // Navigation has more junctions to visit and the next junction can accept this cart without blockers
                cart.passingSlot = prevSlot;
                forceCartOnJunction(cartManager, junctionMap, cartId, nextIndex);
                forceCartOnLane(cartManager, junctionMap, cartId, aheadNextJunc, 0);
                // ...if there's movement left, continue down the lane?
                let aheadNextSteps = nextSlot - lane.length;
                if (aheadNextSteps > 0)
                {
                    moveCartTowards(cartManager, junctionMap, cartId, aheadNextJunc, aheadNextSteps);
                }
                return;
            }
            else
            {
                // Move forward as far as possible before the blocker.
                nextSlot = Math.min(lane.length - 1, furthest, nextSlot);
                forceCartOnLane(cartManager, junctionMap, cartId, nextIndex, nextSlot);
                return;
            }
        }
        else
        {
            // Move forward as far as possible before the blocker.
            nextSlot = Math.min(lane.length - 1, furthest, nextSlot);
            forceCartOnLane(cartManager, junctionMap, cartId, nextIndex, nextSlot);
            return;
        }
    }
}

function getNextJunction(cart)
{
    let nextIndex = cart.pathIndex + 1;
    if (nextIndex <= 0 || nextIndex >= cart.path.length)
    {
        return -1;
    }
    else
    {
        return cart.path[nextIndex];
    }
}

/**
 * @param {CartManager} cartManager 
 * @param {JunctionMap} junctionMap
 * @param {*} cartId 
 * @param {*} outletIndex 
 * @param {*} steps 
 * @returns 
 */
export function moveCartTowards(cartManager, junctionMap, cartId, outletIndex, steps)
{
    let cart = getCartById(cartManager, cartId);
    let junc = getJunctionByIndex(junctionMap, cart.currentJunction);
    if (!junc.outlets.includes(outletIndex))
    {
        throw new Error(`Missing outlet '${getJunctionCoordsFromIndex(junctionMap, outletIndex)}' at junction '${getJunctionCoordsFromIndex(junctionMap, cart.currentJunction)}' to move cart towards.`);
    }
    let lane = junc.lanes[outletIndex];
    if (isNullJunction(junctionMap, cart.currentOutlet))
    {
        // Not on the way yet. Try to merge into a lane.
        let furthest = getFurthestAvailableSlotInLane(junctionMap, lane, 0);
        if (furthest > 0)
        {
            // Move the cart (it takes 1 step to move out of parking).
            let nextSlot = Math.min(furthest, steps - 1);
            forceCartOnLane(cartManager, junctionMap, cartId, outletIndex, nextSlot);
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
        let furthest = getFurthestAvailableSlotInLane(junctionMap, lane, prevSlot + 1);
        // There's no blockers and total movement will exit the lane
        if (furthest >= lane.length && nextSlot >= lane.length)
        {
            let aheadNextJunc = lookAheadNavigation(cartManager, cartId, outletIndex);
            if (isNullJunction(junctionMap, aheadNextJunc))
            {
                // Navigation is stopping at this junction. Slow down.
                if (tryAcquireParkingInJunction(cartManager, junctionMap, cartId, outletIndex))
                {
                    // Parking. Any remaining movement is ignored.
                    forceCartOnJunction(cartManager, junctionMap, cartId, outletIndex);
                    return;
                }
                else
                {
                    // This only happens when a cart is going to a non-parkable junction
                    forceCartOnJunction(cartManager, junctionMap, cartId, outletIndex);
                    return;
                }
            }
            else if (canJunctionLaneAcceptCart(junctionMap, outletIndex, aheadNextJunc) && tryAcquirePassThroughJunction(cartManager, junctionMap, cartId, outletIndex))
            {
                // Navigation has more junctions to visit and the next junction can accept this cart without blockers
                cart.passingSlot = prevSlot;
                forceCartOnJunction(cartManager, junctionMap, cartId, outletIndex);
                forceCartOnLane(cartManager, junctionMap, cartId, aheadNextJunc, 0);
                // ...if there's movement left, continue down the lane?
                let aheadNextSteps = nextSlot - lane.length;
                if (aheadNextSteps > 0)
                {
                    moveCartTowards(cartManager, junctionMap, cartId, aheadNextJunc, aheadNextSteps);
                }
                return;
            }
            else
            {
                // Move forward as far as possible before the blocker.
                nextSlot = Math.min(lane.length - 1, furthest, nextSlot);
                forceCartOnLane(cartManager, junctionMap, cartId, outletIndex, nextSlot);
                return;
            }
        }
        else
        {
            // Move forward as far as possible before the blocker.
            nextSlot = Math.min(lane.length - 1, furthest, nextSlot);
            forceCartOnLane(cartManager, junctionMap, cartId, outletIndex, nextSlot);
            return;
        }
    }
}

function tryAcquireParkingInJunction(cartManager, junctionMap, cartId, juncIndex)
{
    if (juncIndex < 0) throw new Error('Junction index must be non-negative.');
    let junc = getJunctionByIndex(junctionMap, juncIndex);
    if (junc.parking < junc.parkingCapacity)
    {
        let cart = getCartById(cartManager, cartId);
        cart.parkingJunction = juncIndex;
        junc.parking += 1;
        return true;
    }
    else
    {
        return false;
    }
}

function canJunctionLaneAcceptCart(junctionMap, inletIndex, outletIndex)
{
    if (inletIndex < 0 || outletIndex < 0) throw new Error('Junction index must be non-negative.');
    let lane = getJunctionLaneByIndex(junctionMap, inletIndex, outletIndex);
    if (!lane) throw new Error(`Cannot find lane for given inlet '${getJunctionCoordsFromIndex(junctionMap, inletIndex)}' and outlet '${getJunctionCoordsFromIndex(junctionMap, outletIndex)}'.`);
    let slot = getFurthestAvailableSlotInLane(junctionMap, lane, 0);
    return slot >= 0;
}

function tryAcquirePassThroughJunction(cartManager, junctionMap, cartId, juncIndex)
{
    if (juncIndex < 0) throw new Error('Junction index must be non-negative.');
    let junc = getJunctionByIndex(junctionMap, juncIndex);
    if (!junc.passing)
    {
        junc.passing = cartId;
        let cart = getCartById(cartManager, cartId);
        cart.passingJunction = juncIndex;
        return true;
    }
    else
    {
        return false;
    }
}

function lookAheadNavigation(cartManager, cartId, outletIndex)
{
    let cart = getCartById(cartManager, cartId);
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

function getFurthestAvailableSlotInLane(junctionMap, lane, initialSlot)
{
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
 * @param {CartManager} cartManager 
 * @param {JunctionMap} junctionMap
 * @param {string} cartId 
 * @param {JunctionIndex} juncIndex 
 */
export function forceCartOnJunction(cartManager, junctionMap, cartId, juncIndex)
{
    if (!junctionMap.hasJunction(juncIndex))
    {
        throw new Error('Invalid junction index.');
    }
    let cart = cartManager.carts[cartId];
    if (!isNullJunction(junctionMap, cart.currentJunction))
    {
        // Remove from previous junction.
        let junc = junctionMap.getJunction(cart.currentJunction);
        if (!isNullJunction(junctionMap, cart.currentOutlet))
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
 * @param {string} cartId 
 * @param {JunctionIndex} outlet 
 * @param {number} slot 
 */
export function forceCartOnLane(cartManager, junctionMap, cartId, outlet, slot)
{
    let cart = getCartById(cartManager, cartId);
    let junc = getJunctionByIndex(junctionMap, cart.currentJunction);
    let lane = junc.lanes[outlet];
    if (!isNullJunction(junctionMap, cart.currentOutlet))
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
    if (isNullJunction(junctionMap, outlet) || !isJunctionOutletForJunction(junctionMap, outlet, cart.currentJunction))
    {
        throw new Error(`Cannot put cart on non-existant lane with inlet '${getJunctionCoordsFromIndex(junctionMap, cart.currentJunction)}' and outlet '${getJunctionCoordsFromIndex(junctionMap, outlet)}'.`);
    }
    if (slot < 0 || slot >= lane.length)
    {
        throw new Error(`Cannot put cart on slot index ${slot} out of bounds for lane - must be within [0, ${lane.length}).`);
    }
    cart.currentOutlet = outlet;
    cart.currentSlot = slot;
    lane.slots[slot] = cartId;
}

function teleportCartToHome(cartManager, map, cart)
{
    forceCartOnJunction(cartManager, map, cart.id, cart.homeIndex);
    let [coordX, coordY] = getJunctionCoordsFromIndex(map, cart.homeIndex);
    cart.x = coordX + 0.5;
    cart.y = coordY + 0.5;
    cart.radians = 0;
}

/**
 * @param {CartManager} cartManager 
 * @param {JunctionMap} junctionMap 
 * @param {Navigator} navigator 
 */
export function updateTraffic(world, cartManager, junctionMap, navigator)
{
    const worldTicks = ++cartManager.worldTicks;
    // Update carts
    for(let cart of Object.values(cartManager.carts))
    {
        if (cart.lastUpdatedTicks < worldTicks)
        {
            let targetOutlet = cart.currentOutlet;
            cart.lastUpdatedTicks = worldTicks;
            // Carts should always be on a junction.
            if (isNullJunction(junctionMap, cart.currentJunction))
            {
                // It's lost.
                // throw new Error('Cart is not on a junction!');
                teleportCartToHome(cartManager, junctionMap, cart);
                continue;
            }
            // Passing junctions only last for 1 tick.
            if (!isNullJunction(junctionMap, cart.passingJunction))
            {
                let junc = getJunctionByIndex(junctionMap, cart.passingJunction);
                junc.passing = null;
                cart.passingJunction = NULL_JUNCTION_INDEX;
            }
            // If not moving on a lane, try starting to.
            if (isNullJunction(junctionMap, cart.currentOutlet))
            {
                targetOutlet = navigator.updateNavigation(world, cartManager, cart.id);
                if (isNullJunction(junctionMap, targetOutlet))
                {
                    // Cannot move. Go home.
                    teleportCartToHome(cartManager, junctionMap, cart);
                    continue;
                }
            }
            // Validate cart junction and outlet are correct before moving.
            if (!isJunctionOutletForJunction(junctionMap, targetOutlet, cart.currentJunction))
            {
                // Cannot move. Go home.
                // throw new Error(`Next junction outlet '${getJunctionCoordsFromIndex(junctionMap, targetOutlet)}' is not for junction '${getJunctionCoordsFromIndex(junctionMap, cart.currentJunction)}'.`);
                teleportCartToHome(cartManager, junctionMap, cart);
                continue;
            }
            moveCartTowards(cartManager, junctionMap, cart.id, targetOutlet, cart.maxLaneSpeed);
        }
    }
}

/**
 * @param {CartId} cartId 
 * @returns {Cart}
 */
export function getCartById(cartManager, cartId)
{
    return cartManager.carts[cartId];
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
export function drawCarts(ctx, cartManager, junctionMap, cellSize)
{
    let frameTime = cartManager.tickFrames / FRAMES_PER_TICK;
    let dt = frameTime;
    for(let cart of Object.values(cartManager.carts))
    {
        if (cart.currentJunction === -1 || cart.currentOutlet === -1)
        {
            drawCart(ctx, cart.x * cellSize, cart.y * cellSize, cart.radians, cellSize);
        }
        else
        {
            if (frameTime <= 0)
            {
                // Capture current state.
                cart.prevX = cart.x;
                cart.prevY = cart.y;
            }
            let [nextX, nextY] = getLanePosition(junctionMap, cart.currentJunction, cart.currentOutlet, 0, cart.currentSlot / 3 + 1 / 6);
            let prevX = cart.prevX;
            let prevY = cart.prevY;
            let currX = lerp(prevX, nextX, dt);
            let currY = lerp(prevY, nextY, dt);
            let dx = nextX - prevX;
            let dy = nextY - prevY;
            let currRadians;
            if (Math.abs(dx) <= Number.EPSILON && Math.abs(dy) <= Number.EPSILON)
            {
                currRadians = cart.radians;
            }
            else
            {
                let nextRadians = Math.atan2(dy, dx);
                let prevRadians = cart.radians;
                currRadians = lookAt2(prevRadians, nextRadians, dt);
            }
            cart.x = currX;
            cart.y = currY;
            cart.radians = currRadians;
            drawCart(ctx, currX * cellSize, currY * cellSize, currRadians, cellSize);
        }
    }
}

export function drawCart(ctx, x, y, rotation, cellSize)
{
    let width = cellSize * 0.2;
    let height = cellSize * 0.3;
    let halfWidth = width / 2;
    let halfHeight = height / 2;
    let padding = 2;
    let hoodSize = height * 0.4;
    let topSize = height * 0.2;
    ctx.translate(x, y);
    ctx.rotate(rotation + Math.PI / 2);
    {
        ctx.fillStyle = 'green';
        ctx.fillRect(-halfWidth, -halfHeight, width, height);
        ctx.fillStyle = 'lime';
        ctx.fillRect(-halfWidth + padding, -halfHeight + hoodSize, width - padding * 2, hoodSize + topSize);
        ctx.fillStyle = 'gold';
        ctx.fillRect(-halfWidth + padding, -halfHeight, padding, padding);
        ctx.fillRect(halfWidth - padding * 2, -halfHeight, padding, padding);
    }
    ctx.rotate(-rotation - Math.PI / 2);
    ctx.translate(-x, -y);
}

const HALF_PI = Math.PI * 0.5;

/**
 * @param {JunctionMap} map 
 * @param {JunctionIndex} inletIndex 
 * @param {JunctionIndex} outletIndex 
 * @param {number} progress 
 */
function getLanePosition(map, inletIndex, outletIndex, laneIndex, progress)
{
    let [inx, iny] = getJunctionCoordsFromIndex(map, inletIndex);
    let [outx, outy] = getJunctionCoordsFromIndex(map, outletIndex);
    let dx = outx - inx;
    let dy = outy - iny;
    let dr = Math.atan2(dy, dx);
    let lx = Math.cos(dr + HALF_PI) * (0.15 + 0.2 * laneIndex);
    let ly = Math.sin(dr + HALF_PI) * (0.15 + 0.2 * laneIndex);
    return [
        (inx + 0.5) + lx + dx * progress,
        (iny + 0.5) + ly + dy * progress,
    ];
}
