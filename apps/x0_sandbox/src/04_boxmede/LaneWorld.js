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
    if (++timer > 50)
    {
        timer = 0;
    }
    else
    {
        return;
    }

    updateTraffic(world);
}

const JUNC_CELL_SIZE = 128;
const JUNC_DRAW_SIZE = 32;
const LANE_RADIUS = 4;

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
