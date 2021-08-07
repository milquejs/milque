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
 * @typedef {import('./Junction.js').Junction} Junction
 * @typedef {import('./Junction.js').Lane} Lane
 * @typedef {import('./Junction.js').Cart} Cart
 */

import { connectJunction, drawJunctions, drawLanes, drawOutlets, getJunctionIndexFromCoords, createCart, putJunction, updateTraffic, drawCarts } from './Junction.js';

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
        this.tickFrames = 0;
    }
}

export class CellMap
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;

        this.cells = new Uint8Array();
        this.metas = new Uint8Array();
    }
}

export function create()
{
    const width = 8;
    const height = 6;
    let world = new LaneWorld(width * 2, height * 2);
    let cellMap = new CellMap(width, height);

    putJunction(world, 1, 1, 4);
    putJunction(world, 1, 2);
    putJunction(world, 1, 3);
    putJunction(world, 1, 4, 16);
    putJunction(world, 2, 3);

    putJunction(world, 2, 2, 16);
    putJunction(world, 3, 3);
    putJunction(world, 3, 2);
    putJunction(world, 4, 4);

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

    connectJunction(world,
        getJunctionIndexFromCoords(world, 1, 1),
        getJunctionIndexFromCoords(world, 1, 2));
    connectJunction(world,
        getJunctionIndexFromCoords(world, 1, 2),
        getJunctionIndexFromCoords(world, 1, 3));
    connectJunction(world,
        getJunctionIndexFromCoords(world, 1, 3),
        getJunctionIndexFromCoords(world, 1, 4));

    connectJunction(world,
        getJunctionIndexFromCoords(world, 1, 4),
        getJunctionIndexFromCoords(world, 2, 3));
    connectJunction(world,
        getJunctionIndexFromCoords(world, 2, 3),
        getJunctionIndexFromCoords(world, 3, 3));
    
    createCart(world, 1, 1);
    createCart(world, 1, 1);
    createCart(world, 1, 1);
    createCart(world, 1, 1);

    createCart(world, 2, 2);
    createCart(world, 2, 2);
    createCart(world, 2, 2);
    createCart(world, 2, 2);

    createCart(world, 2, 2);
    createCart(world, 2, 2);
    createCart(world, 2, 2);
    createCart(world, 2, 2);

    createCart(world, 2, 2);
    createCart(world, 2, 2);
    createCart(world, 2, 2);
    createCart(world, 2, 2);

    createCart(world, 2, 2);
    createCart(world, 2, 2);
    createCart(world, 2, 2);
    createCart(world, 2, 2);
    return {
        laneWorld: world,
        cellMap: cellMap,
    };
}

/**
 * @param {LaneWorld} world 
 */
export function simulate({ laneWorld, cellMap })
{
    if (++laneWorld.tickFrames > 50)
    {
        laneWorld.tickFrames = 0;
    }
    else
    {
        return;
    }

    updateTraffic(laneWorld);
}

const JUNC_SIZE = 32;
const HALF_JUNC_SIZE = JUNC_SIZE / 2;
const LANE_RADIUS = 4;

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {} world 
 */
export function render(ctx, { laneWorld, cellMap })
{
    drawJuncMap(ctx, laneWorld);
    drawCellMap(ctx, cellMap);
    drawOutlets(ctx, laneWorld, JUNC_SIZE, LANE_RADIUS, HALF_JUNC_SIZE);
    drawJunctions(ctx, laneWorld, JUNC_SIZE, LANE_RADIUS, HALF_JUNC_SIZE);
    drawLanes(ctx, laneWorld, JUNC_SIZE, LANE_RADIUS, HALF_JUNC_SIZE);
    drawCarts(ctx, laneWorld, JUNC_SIZE, HALF_JUNC_SIZE);
}

const CELL_SIZE = 64;

function drawJuncMap(ctx, laneWorld)
{
    for(let y = 0; y < laneWorld.height; ++y)
    {
        for(let x = 0; x < laneWorld.width; ++x)
        {
            let xx = x * JUNC_SIZE;
            let yy = y * JUNC_SIZE;
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#222';
            ctx.strokeRect(xx, yy, JUNC_SIZE, JUNC_SIZE);
        }
    }
}

function drawCellMap(ctx, cellMap)
{
    const mapWidth = cellMap.width;
    const mapHeight = cellMap.height;
    for(let y = 0; y < mapHeight; ++y)
    {
        for(let x = 0; x < mapWidth; ++x)
        {
            let xx = x * CELL_SIZE;
            let yy = y * CELL_SIZE;
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#333';
            ctx.strokeRect(xx, yy, CELL_SIZE, CELL_SIZE);
        }
    }
    for(let y = 0; y < mapHeight; ++y)
    {
        for(let x = 0; x < mapWidth; ++x)
        {
            let xx = x * CELL_SIZE;
            let yy = y * CELL_SIZE;
            let i = x + y * mapWidth;
            let id = cellMap.cells[i];
            let metadata = cellMap.metas[i];
            ctx.translate(xx, yy);
            switch(id)
            {
                case ROAD_ID:
                    drawCellRoad(ctx, id, metadata, x, y);
                    break;
                case HOUSING_ID:
                    drawCellHousing(ctx, id, metadata, x, y);
                    break;
                case FACTORY_ROOT_ID:
                    drawCellFactory(ctx, id, metadata, x, y);
                    break;
                case FACTORY_BLOCK_ID:
                    // Do nothing.
                    break;
                case FACTORY_PORT_ID:
                    drawCellFactoryPort(ctx, id, metadata, x, y);
                    break;
                case EMPTY_ID:
                    // Do nothing.
                    break;
                default:
                    ctx.fillStyle = '#FF00FF';
                    ctx.fillRect(0, 0, CELL_SIZE, CELL_SIZE);
                    break;
            }
            ctx.translate(-xx, -yy);
        }
    }
}

const ROAD_ID = 1;

function putRoad(cellMap, fromX, fromY, toX, toY)
{
    let fromI = fromX + fromY * cellMap.width;
    let toI = toX + toY * cellMap.width;
    cellMap.cells[fromI] = ROAD_ID;
    cellMap.cells[toI] = ROAD_ID;
}

function drawCellRoad(ctx, cellId, cellMetadata, cellX, cellY)
{
    
}