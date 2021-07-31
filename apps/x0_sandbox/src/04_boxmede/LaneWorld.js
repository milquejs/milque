/**
 * @typedef World
 * @property {object} carts
 * @property {object} lanes
 * @property {Array<Junction>} juncs
 * @property {number} width
 * @property {number} height
 * 
 * @typedef {number} JunctionEncoding
 * @typedef {[number, number]} Coords
 * @typedef {string} CartId
 * 
 * @typedef Junction
 * @property {Array<JunctionEncoding>} inlets
 * @property {Array<JunctionEncoding>} outlets
 * @property {Record<JunctionEncoding, Lane>} lanes
 * 
 * @typedef Lane
 * @property {JunctionEncoding} inlet
 * @property {JunctionEncoding} outlet
 * @property {Array<CartId>} slots
 * @property {number} length
 * @property {number} nextBlocking
 * 
 * @typedef {object} Cart
 */

import { uuid } from '@milque/util';
import { astarSearch } from './util/astar.js';

class LaneWorld
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
        /** @type {Record<CartId, Cart>} */
        this.carts = {};
        this.lanes = {};
        /** @type {Array<Junction>} */
        this.juncs = new Array(width * height);

        this.worldTicks = 0;
    }

    /**
     * @param {number} juncX 
     * @param {number} juncY 
     * @returns {boolean}
     */
    isJunctionWithinBounds(juncX, juncY)
    {
        return juncX >= 0 && juncY >= 0 && juncX < this.width && juncY < this.height;
    }

    /** @returns {Junction} */
    getJunctionByCoords(juncX, juncY)
    {
        return this.juncs[juncX + juncY * this.width];
    }

    /** @returns {Junction} */
    getJunctionByEncoding(juncId)
    {
        let [x, y] = getJunctionCoordsFromEncoding(juncId);
        return this.juncs[x + y * this.width];
    }
}

/**
 * @returns {LaneWorld}
 */
export function create()
{
    let world = new LaneWorld(8, 6);

    createJunction(world, 1, 1);
    createJunction(world, 2, 2);
    createJunction(world, 3, 3);
    createJunction(world, 3, 2);
    connectJunction(world, 1, 1, 2, 2);
    connectJunction(world, 2, 2, 3, 3);
    connectJunction(world, 3, 3, 3, 2);
    connectJunction(world, 3, 2, 2, 2);
    connectJunction(world, 2, 2, 1, 1);

    let cart = createCart(world, 1, 1);
    putCartOnLane(world, cart.id, 1, 1, 2, 2);
    return world;
}

const JUNCTION_LANE_LENGTH = 4;
const CART_SPEED = 4;

/**
 * 
 * @param {LaneWorld} world 
 * @param {CartId} cartId 
 * @param {JunctionEncoding} inletId 
 * @param {JunctionEncoding} outletId 
 */
function putCartOnLane(world, cartId, inletX, inletY, outletX, outletY, slotIndex = 0)
{
    let cart = getCart(world, cartId);
    if (cart.currentLaneId)
    {
        let prevLane = getLaneByIds(world, cart.currentJunctionId, cart.currentLaneId);
        prevLane.slots[cart.currentLaneSlot] = null;
        cart.currentLaneSlot = 0;
        cart.currentJunctionId = null;
        cart.currentLaneId = null;
    }
    let lane = getLaneByCoords(world, inletX, inletY, outletX, outletY);
    lane.slots[slotIndex] = cartId;
    cart.currentJunctionId = lane.inlet;
    cart.currentLaneId = lane.outlet;
    cart.currentLaneSlot = slotIndex;
}

/**
 * @param {LaneWorld} world 
 * @param {number} inletX 
 * @param {number} inletY 
 * @param {number} outletX 
 * @param {number} outletY 
 * @returns {Lane}
 */
function getLaneByCoords(world, inletX, inletY, outletX, outletY)
{
    let junc = world.getJunctionByCoords(inletX, inletY);
    let outlet = getJunctionEncoding(outletX, outletY);
    return junc.lanes[outlet];
}

/** @returns {Lane} */
function getLaneByIds(world, inletId, outletId)
{
    let [x, y] = getJunctionCoordsFromEncoding(inletId);
    let junc = world.getJunctionByCoords(x, y);
    return junc.lanes[outletId];
}

function getCart(world, cartId)
{
    return world.carts[cartId];
}

let timer = 0;
/**
 * @param {LaneWorld} world 
 */
export function simulate(world)
{
    if (++timer > 20)
    {
        timer = 0;
    }
    else
    {
        return;
    }
    world.worldTicks += 1;

    for(let y = 0; y < world.height; ++y)
    {
        for(let x = 0; x < world.width; ++x)
        {
            let junc = world.juncs[x + y * world.width];
            if (junc)
            {
                for(let lane of Object.values(junc.lanes))
                {
                    const { slots, length } = lane;
                    for(let i = 0; i < slots.length; ++i)
                    {
                        let cartId = slots[i];
                        let cart = world.carts[cartId];
                        if (cart)
                        {
                            if (cart.lastUpdatedTicks >= world.worldTicks) continue;

                            let index = cart.currentLaneSlot;
                            cart.lastUpdatedTicks = world.worldTicks;
                            if (cart.currentLaneSlot + 1 < length)
                            {
                                // Move forward.
                                let [ix, iy] = getJunctionCoordsFromEncoding(lane.inlet);
                                let [ox, oy] = getJunctionCoordsFromEncoding(lane.outlet);
                                putCartOnLane(world, cartId, ix, iy, ox, oy, index + 1);
                            }
                            else
                            {
                                // Go to a new lane.
                                let [juncX, juncY] = getJunctionCoordsFromEncoding(lane.outlet);
                                let junc = world.juncs[juncX + juncY * world.width];
                                let next = junc.outlets[Math.floor(Math.random() * junc.outlets.length)];
                                let [nextX, nextY] = getJunctionCoordsFromEncoding(next);
                                putCartOnLane(world, cartId, juncX, juncY, nextX, nextY);
                            }
                        }
                    }
                }
            }
        }
    }
}

const JUNC_CELL_SIZE = 128;
const JUNC_DRAW_SIZE = 32;
const LANE_ARROW_LENGTH = 16;
const LANE_RADIUS = 4;

const PATH_RADIUS = 2;

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {LaneWorld} world 
 */
export function render(ctx, world)
{
    for(let y = 0; y < world.height; ++y)
    {
        for(let x = 0; x < world.width; ++x)
        {
            let junc = world.juncs[x + y * world.width];
            if (junc)
            {
                let xx = x * JUNC_CELL_SIZE;
                let yy = y * JUNC_CELL_SIZE;
                ctx.lineWidth = LANE_RADIUS * 2;
                ctx.strokeStyle = 'teal';
                ctx.strokeRect(xx, yy, JUNC_DRAW_SIZE, JUNC_DRAW_SIZE);
            }
        }
    }

    for(let y = 0; y < world.height; ++y)
    {
        for(let x = 0; x < world.width; ++x)
        {
            let junc = world.juncs[x + y * world.width];
            if (junc)
            {
                let beginX = x * JUNC_CELL_SIZE + JUNC_DRAW_SIZE / 2;
                let beginY = y * JUNC_CELL_SIZE + JUNC_DRAW_SIZE / 2;
                for(let outlet of junc.outlets)
                {
                    let [outX, outY] = getJunctionCoordsFromEncoding(outlet);
                    ctx.lineWidth = LANE_RADIUS * 2;
                    ctx.strokeStyle = 'gray';
                    ctx.beginPath();
                    ctx.moveTo(beginX, beginY);
                    let endX = outX * JUNC_CELL_SIZE + JUNC_DRAW_SIZE / 2;
                    let endY = outY * JUNC_CELL_SIZE + JUNC_DRAW_SIZE / 2;
                    ctx.lineTo(endX, endY);
                    ctx.moveTo(endX, endY);
                    let dx = outX - x;
                    let dy = outY - y;
                    let radians = Math.atan2(dy, dx) - Math.PI;
                    let arrowX = Math.cos(radians + Math.PI / 8) * LANE_ARROW_LENGTH;
                    let arrowY = Math.sin(radians + Math.PI / 8) * LANE_ARROW_LENGTH;
                    ctx.lineTo(endX + arrowX, endY + arrowY);
                    ctx.stroke();
                }
            }
        }
    }

    for(let y = 0; y < world.height; ++y)
    {
        for(let x = 0; x < world.width; ++x)
        {
            let junc = world.juncs[x + y * world.width];
            if (junc)
            {
                let beginX = x * JUNC_CELL_SIZE + JUNC_DRAW_SIZE / 2;
                let beginY = y * JUNC_CELL_SIZE + JUNC_DRAW_SIZE / 2;
                for(let outlet of junc.outlets)
                {
                    let [outX, outY] = getJunctionCoordsFromEncoding(outlet);
                    let endX = outX * JUNC_CELL_SIZE + JUNC_DRAW_SIZE / 2;
                    let endY = outY * JUNC_CELL_SIZE + JUNC_DRAW_SIZE / 2;
                    if (junc.passing)
                    {
                        ctx.strokeStyle = 'red';
                    }
                    else
                    {
                        ctx.strokeStyle = 'lime';
                    }
                    ctx.beginPath();
                    ctx.arc(beginX, beginY, LANE_RADIUS, 0, Math.PI * 2);
                    ctx.stroke();

                    let dx = endX - beginX;
                    let dy = endY - beginY;
                    let dr = Math.atan2(dy, dx);
                    let lane = junc.lanes[outlet];
                    const laneLength = lane.length;
                    for(let i = 0; i < laneLength; ++i)
                    {
                        let ratio = (i + 0.25) / laneLength;
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
                        ctx.arc(tx, ty, LANE_RADIUS, dr, dr + Math.PI);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    if (world._path && world._path.length > 0)
    {
        let [prevX, prevY] = getJunctionCoordsFromEncoding(world._path[0]);
        for(let i = 1; i < world._path.length; ++i)
        {
            let [nextX, nextY] = getJunctionCoordsFromEncoding(world._path[i]);
            let fx = prevX * JUNC_CELL_SIZE + JUNC_DRAW_SIZE / 2;
            let fy = prevY * JUNC_CELL_SIZE + JUNC_DRAW_SIZE / 2;
            let tx = nextX * JUNC_CELL_SIZE + JUNC_DRAW_SIZE / 2;
            let ty = nextY * JUNC_CELL_SIZE + JUNC_DRAW_SIZE / 2;
            let dx = nextX - prevX;
            let dy = nextY - prevY;
            ctx.lineWidth = PATH_RADIUS * 2;
            ctx.strokeStyle = 'gold';
            ctx.beginPath();
            ctx.moveTo(fx, fy);
            ctx.lineTo(tx, ty);
            ctx.moveTo(tx, ty);
            let radians = Math.atan2(dy, dx) - Math.PI;
            let arrowX = Math.cos(radians + Math.PI / 8) * LANE_ARROW_LENGTH;
            let arrowY = Math.sin(radians + Math.PI / 8) * LANE_ARROW_LENGTH;
            ctx.lineTo(tx + arrowX, ty + arrowY);
            ctx.stroke();
            prevX = nextX;
            prevY = nextY;
        }
    }

    for(let cart of Object.values(world.carts))
    {
        let dx = cart.nextX - cart.x;
        let dy = cart.nextY - cart.y;
        cart.x += dx * 0.1;
        cart.y += dy * 0.1;
        let x = cart.x * JUNC_CELL_SIZE + JUNC_DRAW_SIZE / 2;
        let y = cart.y * JUNC_CELL_SIZE + JUNC_DRAW_SIZE / 2;
        ctx.strokeStyle = 'gold';
        ctx.lineWidth = LANE_RADIUS * 2;
        ctx.beginPath();
        ctx.arc(x, y, JUNC_DRAW_SIZE, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function createCart(world, juncX, juncY)
{
    const id = uuid();
    let cart = {
        id,
        speed: 4,
        x: juncX,
        y: juncY,
        homeX: juncX,
        homeY: juncY,
        nextX: juncX,
        nextY: juncY,
        lastUpdatedTicks: 0,
        currentLaneSlot: 0,
        currentJunctionId: null,
        currentLaneId: null,
        targetJunctionId: null,
    };
    world.carts[id] = cart;
    return cart;
}

/**
 * @param {LaneWorld} world 
 * @param {number} juncX 
 * @param {number} juncY 
 * @returns {Junction}
 */
function createJunction(world, juncX, juncY)
{
    let junc = {
        outlets: [],
        inlets: [], // Should be read-only
        lanes: {},
        passing: null,
    };
    world.juncs[juncX + juncY * world.width] = junc;
    return junc;
}

/**
 * @param {LaneWorld} world
 * @param {JunctionEncoding} fromJuncId
 * @param {JunctionEncoding} toJuncId
 * @param {number} length 
 * @returns {Lane}
 */
function createLane(world, fromJuncId, toJuncId, length)
{
    return {
        inlet: fromJuncId,
        outlet: toJuncId,
        slots: new Array(length),
        length: length,
        nextBlocking: length,
    };
}

/**
 * @param {LaneWorld} world 
 * @param {number} fromJuncX 
 * @param {number} fromJuncY 
 * @param {number} toJuncX 
 * @param {number} toJuncY 
 */
function connectJunction(world, fromJuncX, fromJuncY, toJuncX, toJuncY)
{
    let from = world.getJunctionByCoords(fromJuncX, fromJuncY);
    if (!from) throw new Error('Cannot connect from a non-existant junction.');
    let to = world.getJunctionByCoords(toJuncX, toJuncY);
    if (!to) throw new Error('Cannot connect to a non-existant junction.');

    const fromId = getJunctionEncoding(fromJuncX, fromJuncY);    
    const toId = getJunctionEncoding(toJuncX, toJuncY);

    if (from.outlets.includes(toId)) throw new Error('Cannot connect junctions that are already connected!');
    from.outlets.push(toId);
    from.lanes[toId] = createLane(world, fromId, toId, JUNCTION_LANE_LENGTH);

    if (to.inlets.includes(fromId)) throw new Error('Cannot connect junctions that are already connected!');
    to.inlets.push(fromId);
}

/**
 * @param {LaneWorld} world 
 * @param {number} fromJuncX 
 * @param {number} fromJuncY 
 * @param {number} toJuncX 
 * @param {number} toJuncY 
 */
function disconnectJunction(world, fromJuncX, fromJuncY, toJuncX, toJuncY)
{
    let from = world.getJunctionByCoords(fromJuncX, fromJuncY);
    if (!from) throw new Error('Cannot disconnect from a non-existant junction.');
    let to = world.getJunctionByCoords(toJuncX, toJuncY);
    if (!to) throw new Error('Cannot disconnect to a non-existant junction.');

    const toId = getJunctionEncoding(toJuncX, toJuncY);
    let toIndex = from.outlets.indexOf(toId);
    if (toIndex < 0) throw new Error('Cannot disconnect junctions that are not connected!');
    from.outlets.splice(toIndex, 1);
    let lane = from.lanes[toId];
    if (lane.nextBlocking < lane.length)
    {
        throw new Error('Cannot disconnect junctions with a non-vacated lane.');
    }

    const fromId = getJunctionEncoding(fromJuncX, fromJuncY);
    let fromIndex = to.inlets.indexOf(fromId);
    if (fromIndex < 0) throw new Error('Cannot disconnect junctions that are not connected!');
    to.inlets.splice(fromIndex, 1);
}

/**
 * @param {LaneWorld} world 
 * @param {number} fromJuncX 
 * @param {number} fromJuncY 
 * @param {number} toJuncX 
 * @param {number} toJuncY 
 */
function isJunctionConnectedTo(world, fromJuncX, fromJuncY, toJuncX, toJuncY)
{
    const toId = getJunctionEncoding(toJuncX, toJuncY);
    let junc = world.getJunctionByCoords(fromJuncX, fromJuncY);
    // If outlet exist, can assume inlet exists as well.
    return junc.outlets.includes(toId);
}

/**
 * @param {LaneWorld} world 
 * @param {number} juncX
 * @param {number} juncY
 */
function deleteJunction(world, juncX, juncY)
{
    let from = world.getJunctionByCoords(juncX, juncY);
    if (!from) throw new Error('Cannot delete a non-existant junction.');
    for(let inletId of from.inlets)
    {
        let [fromX, fromY] = getJunctionCoordsFromEncoding(inletId);
        disconnectJunction(world, fromX, fromY, juncX, juncY);
    }
    for(let outletId of from.outlets)
    {
        let [toX, toY] = getJunctionCoordsFromEncoding(outletId);
        disconnectJunction(world, juncX, juncY, toX, toY);
    }
    world.juncs[juncX + juncY * world.width] = null;
}

/**
 * @param {number} juncX 
 * @param {number} juncY 
 * @returns {JunctionEncoding}
 */
function getJunctionEncoding(juncX, juncY)
{
    if (juncX < 0 || juncY < 0) throw new Error('Cannot have negative junction coordinates!');
    if (juncX > 0xFFFF || juncY > 0xFFFF) throw new Error('Cannot encode junction coordinates greater than or equal to 4294967296!');
    return juncX << 16 | juncY;
}

/**
 * @param {JunctionEncoding} encoding
 * @returns {Coords}
 */
function getJunctionCoordsFromEncoding(encoding)
{
    return [
        (encoding >> 16) & 0xFFFF,
        encoding & 0xFFFF,
    ];
}

function updateTraffic()
{
    let blockingDistance = length;
    for(let i = length - 1; i >= 0; --i)
    {
        let cartId = slots[i];
        if (cartId)
        {
            let cart = world.carts[cartId];



            /*
            const cartSpeed = CART_SPEED;
            // Spend only 1 tick in passing.
            if (junc.passing === cartId)
            {
                junc.passing = null;
            }
            let remainingDistance = (i + cartSpeed) - blockingDistance;
            if (remainingDistance >= 0)
            {
                if (isLaneBlocked)
                {
                    // Stopping early in this lane.
                    isLaneBlocked = true;
                    blockingDistance = blockingDistance - 1;
                    slots[i] = null;
                    slots[blockingDistance] = cartId;
                    cart.currentLaneSlot = blockingDistance;
                }
                else
                {
                    // Try exiting to the next lane.
                    const outletId = lane.outlet;
                    let [x, y] = getJunctionCoordsFromEncoding(outletId);
                    let outlet = world.getJunctionByCoords(x, y);
                    if (outlet.passing !== null)
                    {
                        // Outlet already in use. Stopping early.
                        isLaneBlocked = true;
                        blockingDistance = blockingDistance - 1;
                        slots[i] = null;
                        slots[blockingDistance] = cartId;
                        cart.currentLaneSlot = blockingDistance;
                    }
                    else
                    {
                        // Outlet is available. Try to claim it and move in!
                        if (cart.targetJunctionId)
                        {
                            // Pick the next lane to continue onto.
                            let nextLane = outlet.lanes[cart.targetJunctionId];
                            if (!nextLane)
                            {
                                throw new Error('Cannot find expected lane at junction - the target does not have a valid path.');
                            }
                            if (lane.nextBlocking > 0)
                            {
                                // Not blocked (yet). Proceed!
                                slots[i] = null;
                                outlet.passing = cartId;
                                if (lane.nextBlocking > remainingDistance)
                                {
                                    if (lane.length <= remainingDistance)
                                    {
                                        throw new Error('Lane is too short! A cart is speeding out of it immediately!');
                                    }
                                    // Go the distance!
                                    cart.currentLaneSlot = remainingDistance;
                                    cart.currentJunctionId = outletId;
                                    cart.targetJunctionId = null;
                                    cart.nextX = x;
                                    cart.nextY = y;
                                    lane.slots[remainingDistance] = cartId;
                                }
                                else
                                {
                                    // Go up to the blocker.
                                    let i = lane.nextBlocking - 1;
                                    cart.currentLaneSlot = i;
                                    cart.currentJunctionId = outletId;
                                    cart.targetJunctionId = null;
                                    cart.nextX = x;
                                    cart.nextY = y;
                                    lane.slots[i] = cartId;
                                }
                            }
                            else
                            {
                                // Blocked. Stopping early.
                                isLaneBlocked = true;
                                blockingDistance = blockingDistance - 1;
                                slots[i] = null;
                                slots[blockingDistance] = cartId;
                                cart.currentLaneSlot = blockingDistance;
                            }
                        }
                        else
                        {
                            // No more instructions. Just stay here and block everybody :(
                            isLaneBlocked = true;
                            blockingDistance = blockingDistance - 1;
                            slots[i] = null;
                            slots[blockingDistance] = cartId;
                            cart.currentLaneSlot = blockingDistance;
                        }
                    }
                }
            }
            else
            {
                // Move forward in this lane.
                isLaneBlocked = true;
                blockingDistance = i + cartSpeed;
                slots[i] = null;
                slots[blockingDistance] = cartId;
                cart.currentLaneSlot = blockingDistance;
            }
            */
        }
    }
    lane.nextBlocking = blockingDistance;
}