/**
 * @typedef {import('../../game/Game.js').Game} Game
 * 
 * @typedef {number} JunctionEncoding
 * @typedef {[number, number]} Coords
 * @typedef {string} CartId
 * 
 * @typedef {import('./Junction.js').Junction} Junction
 * @typedef {import('./Junction.js').JunctionIndex} JunctionIndex
 * @typedef {import('./Junction.js').Lane} Lane
 * @typedef {import('./Junction.js').Cart} Cart
 */

import { drawGrid } from '../render2d.js';
import { CELL_SIZE, CellWorld, putHousing, drawHousings } from './CellWorld.js';
import { Cursor, updateCursor, drawCursor } from './Cursor.js';
import { drawJunctions, drawLanes, drawOutlets, putJunction, updateTraffic, drawCarts } from './Junction.js';

export class LaneWorld
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;
        /** @type {Record<CartId, Cart>} */
        this.carts = {};
        /** @type {Record<JunctionIndex, Junction>} */
        this.juncs = {};

        this.worldTicks = 0;
        this.tickFrames = 0;
    }
}

export function createWorld(game)
{
    const width = 8;
    const height = 6;
    let laneWorld = new LaneWorld(width * 2, height * 2);
    let cellWorld = new CellWorld(laneWorld, width, height);

    putHousing(cellWorld, 1, 1);
    putJunction(laneWorld, 9, 9, 4);

    let cursor = new Cursor();

    return {
        cellWorld,
        laneWorld,
        cursor,
    };
}

/**
 * @param {Game} game
 * @param {LaneWorld} world 
 */
export function updateWorld(game, { cellWorld, laneWorld, cursor })
{
    updateCursor(game.display, game.inputs, cursor, cellWorld);

    if (++laneWorld.tickFrames > 15)
    {
        laneWorld.tickFrames = 0;
        updateTraffic(laneWorld);
    }
}

const JUNC_SIZE = 64;
const HALF_JUNC_SIZE = JUNC_SIZE / 2;
const LANE_RADIUS = 4;

/**
 * @param {CanvasRenderingContext2D} ctx 
 * @param {} world 
 */
export function drawWorld(game, ctx, { cellWorld, laneWorld, cursor })
{
    const width = 8;
    const height = 6;
    const cellSize = CELL_SIZE;
    ctx.lineWidth = 2;
    drawGrid(ctx, width, height, cellSize, '#333');
    ctx.lineWidth = 1;
    drawGrid(ctx, width * 2, height * 2, cellSize / 2, '#222');
    
    drawOutlets(ctx, laneWorld, JUNC_SIZE, LANE_RADIUS, HALF_JUNC_SIZE);
    drawJunctions(ctx, laneWorld, JUNC_SIZE, LANE_RADIUS, HALF_JUNC_SIZE);
    drawLanes(ctx, laneWorld, JUNC_SIZE, LANE_RADIUS, HALF_JUNC_SIZE);
    drawCarts(ctx, laneWorld, JUNC_SIZE, HALF_JUNC_SIZE);
    drawHousings(ctx, cellWorld);

    drawCursor(game, ctx, cursor);
}
