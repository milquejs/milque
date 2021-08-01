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

import { connectJunction, drawJunctions, drawLanes, drawOutlets, getJunctionIndexFromCoords, createCart, putJunction, updateTraffic, drawCarts } from './Junction.js';
import { astarSearch } from './util/astar.js';

export class LaneWorld
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
        /** @type {Record<CartId, Cart>} */
        this.carts = {};
        /** @type {Array<Junction>} */
        this.juncs = new Array(width * height);

        this.worldTicks = 0;
    }
}

/**
 * @returns {LaneWorld}
 */
export function create()
{
    let world = new LaneWorld(8, 6);

    putJunction(world, 1, 1);
    putJunction(world, 2, 2);
    putJunction(world, 3, 3);
    putJunction(world, 3, 2);

    connectJunction(world,
        getJunctionIndexFromCoords(world, 1, 1),
        getJunctionIndexFromCoords(world, 2, 2));
    connectJunction(world,
        getJunctionIndexFromCoords(world, 2, 2),
        getJunctionIndexFromCoords(world, 3, 3));
    connectJunction(world,
        getJunctionIndexFromCoords(world, 3, 3),
        getJunctionIndexFromCoords(world, 3, 2));
    connectJunction(world,
        getJunctionIndexFromCoords(world, 3, 2),
        getJunctionIndexFromCoords(world, 2, 2));
    connectJunction(world,
        getJunctionIndexFromCoords(world, 2, 2),
        getJunctionIndexFromCoords(world, 1, 1));
    
    createCart(world, 1, 1);
    createCart(world, 1, 1);
    createCart(world, 1, 1);
    createCart(world, 1, 1);
    createCart(world, 2, 2);
    //let cart = createCart(world, 1, 1);
    //putCartOnLane(world, cart.id, 1, 1, 2, 2);
    return world;
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

    updateTraffic(world);

    /*
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
    */
}

const JUNC_CELL_SIZE = 128;
const JUNC_DRAW_SIZE = 32;
const LANE_RADIUS = 4;

const PATH_RADIUS = 2;

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {LaneWorld} world 
 */
export function render(ctx, world)
{
    drawOutlets(ctx, world, JUNC_CELL_SIZE, LANE_RADIUS, JUNC_DRAW_SIZE);
    drawJunctions(ctx, world, JUNC_CELL_SIZE, LANE_RADIUS, JUNC_DRAW_SIZE);
    drawLanes(ctx, world, JUNC_CELL_SIZE, LANE_RADIUS, JUNC_DRAW_SIZE);
    drawCarts(ctx, world, JUNC_CELL_SIZE, JUNC_DRAW_SIZE);
    //drawPath(ctx, world._path, JUNC_CELL_SIZE, PATH_RADIUS, JUNC_DRAW_SIZE);
}

/*

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

function updateTraffic()
{
    let blockingDistance = length;
    for(let i = length - 1; i >= 0; --i)
    {
        let cartId = slots[i];
        if (cartId)
        {
            let cart = world.carts[cartId];


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
        }
    }
    lane.nextBlocking = blockingDistance;
}
*/
