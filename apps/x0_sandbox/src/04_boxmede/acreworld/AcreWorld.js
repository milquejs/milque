import { uuid } from '@milque/util';
import { CartManager, drawCarts } from '../cartworld/Cart.js';
import { Navigator } from '../cartworld/Navigator.js';
import { getDirectionalVectorFromEncoding, isDirectionalEncoding, randomSingleDirectionalEncoding } from '../util/Directional.js';
import { connectJunctions, drawJunctions, drawLanes, drawOutlets, getJunctionCoordsFromIndex, getJunctionIndexFromCoords, getJunctionIndexFromJunction, isJunctionConnectedTo, isJunctionWithinBounds, JunctionMap, putJunction, removeJunction } from '../laneworld/Junction.js';
import { drawGrid } from '../render2d.js';
import { Directable, tryFindValidChildDirectionForDirectable } from './Directable.js';
import { Persistence } from './Persistence.js';
import { CURSOR_ACTION, makeRoad } from './RoadMaker.js';

/**
 * @typedef {import('../../game/Game.js').Game} Game
 */

export const CELL_SIZE = 64;
export const DRAG_MARGIN = 0.9;

export class AcreWorld
{
    constructor(width, height)
    {
        this.cursor = {
            screenX: 0,
            screenY: 0,
            dragCellX: 0,
            dragCellY: 0,
            status: 0,
        };

        this.junctionMap = new JunctionMap(width, height);
        this.cartManager = new CartManager(this.junctionMap);
        this.navigator = new Navigator(this.junctionMap);
        this.persistence = new Persistence(this.junctionMap);
        this.directable = new Directable(this.junctionMap);

        this.solids = new Array(width * height).fill(0);

        this.housing = {};
        this.factory = {};
    }
}

/**
 * @param {AcreWorld} world 
 * @param {number} juncX 
 * @param {number} juncY 
 */
export function placeHousing(world, juncX, juncY, outletDirection)
{
    const map = world.junctionMap;
    let [dx, dy] = getDirectionalVectorFromEncoding(outletDirection);
    let outletX = juncX + dx;
    let outletY = juncY + dy;
    if (!isJunctionWithinBounds(map, outletX, outletY))
    {
        throw new Error('Cannot place outlet outside of boundary.');
    }
    let juncIndex = getJunctionIndexFromCoords(map, juncX, juncY);
    let offsetIndex = getJunctionIndexFromCoords(map, outletX, outletY);
    putJunction(map, juncX, juncY, 2);
    if (!map.hasJunction(offsetIndex))
    {
        putJunction(world.junctionMap, outletX, outletY, 0);
    }
    world.directable.markDirectableJunction(juncIndex, offsetIndex);
    world.persistence.markPersistentJunction(juncIndex, offsetIndex);
    connectJunctions(map, juncIndex, offsetIndex);
    connectJunctions(map, offsetIndex, juncIndex);

    let id = uuid();
    let cartA = world.cartManager.createCart(juncIndex);
    let cartB = world.cartManager.createCart(juncIndex);
    world.housing[id] = {
        coordX: juncX,
        coordY: juncY,
        junction: juncIndex,
        carts: [
            cartA.id,
            cartB.id,
        ]
    };
}

export function tryPlaceHousing(world, juncX, juncY)
{
    const map = world.junctionMap;
    let juncIndex = getJunctionIndexFromCoords(map, juncX, juncY);
    if (!map.hasJunction(juncIndex))
    {
        let direction = tryFindValidChildDirectionForDirectable(map, juncIndex, randomSingleDirectionalEncoding(), (juncIndex) => {
            return !world.directable.isDirectableJunction(juncIndex) && !isSolid(world, map, juncIndex);
        });
        if (isDirectionalEncoding(direction))
        {
            placeHousing(world, juncX, juncY, direction);
        }
    }
}

export function placeRoad(world, fromX, fromY, toX, toY)
{
    const map = world.junctionMap;
    let fromIndex = getJunctionIndexFromCoords(map, fromX, fromY);
    let toIndex = getJunctionIndexFromCoords(map, toX, toY);
    if (!isJunctionConnectedTo(map, fromIndex, toIndex))
    {
        connectJunctions(map, fromIndex, toIndex);
    }
    if (!isJunctionConnectedTo(map, toIndex, fromIndex))
    {
        connectJunctions(map, toIndex, fromIndex);
    }
}

/**
 * @param {AcreWorld} world 
 * @param {juncX} juncX 
 * @param {juncY} juncY 
 */
export function placeFactory(world, juncX, juncY)
{
    const map = world.junctionMap;
    if (!isJunctionWithinBounds(map, juncX, juncY)
        || !isJunctionWithinBounds(map, juncX + 3, juncY + 3))
    {
        throw new Error('Cannot place factory out of bounds.');
    }

    for(let i = 0; i < 2; ++i)
    {
        for(let j = 0; j < 3; ++j)
        {
            let juncIndex = (juncX + i + 1) + (juncY + j) * map.width;
            setSolid(world, map, juncIndex);
        }
    }
    let juncA = putJunction(map, juncX, juncY + 2, 0);
    let indexA = getJunctionIndexFromJunction(map, juncA);
    let juncB = putJunction(map, juncX + 1, juncY + 2, 4);
    let indexB = getJunctionIndexFromJunction(map, juncB);
    world.persistence.markPersistentJunction(indexA, indexB);
    connectJunctions(map, indexA, indexB);
    connectJunctions(map, indexB, indexA);
    let id = uuid();
    world.factory[id] = {
        coordX: juncX,
        coordY: juncY,
        entries: [
            indexA,
        ],
        parking: [
            indexB,
        ]
    };
}

/**
 * @param {AcreWorld} acreWorld 
 * @param {number} coordX 
 * @param {number} coordY 
 */
export function getJunctionByCoords(acreWorld, coordX, coordY)
{
    let juncIndex = coordX + coordY * acreWorld.width;
    return acreWorld.junctions[juncIndex];
}

export function getJunctionCoordsFromCell(acreWorld, cellX, cellY)
{
    return [
        cellX,
        cellY,
    ];
}

export function createWorld()
{
    let world = new AcreWorld(12, 8);

    tryPlaceHousing(world, 1, 1);
    tryPlaceHousing(world, 1, 2);
    tryPlaceHousing(world, 2, 2);
    tryPlaceHousing(world, 1, 3);

    placeFactory(world, 4, 2);
    return world;
}

/**
 * @param {Game} game 
 * @param {AcreWorld} world 
 */
export function updateWorld(game, world)
{
    const cursor = world.cursor;
    const cartManager = world.cartManager;
    const junctionMap = world.junctionMap;

    let screenX = game.inputs.getAxisValue('cursorX') * game.display.width;
    let screenY = game.inputs.getAxisValue('cursorY') * game.display.height;
    cursor.screenX = screenX;
    cursor.screenY = screenY;

    let action = game.inputs.isButtonDown('activate') ? 1 : game.inputs.isButtonDown('deactivate') ? 2 : 0;
    if (action > 0)
    {
        makeRoad(screenX, screenY, action, cursor,
            (fromX, fromY, toX, toY) => {
                if (!isJunctionWithinBounds(junctionMap, fromX, fromY)) return;
                if (!isJunctionWithinBounds(junctionMap, toX, toY)) return;
                let [fromJuncX, fromJuncY] = getJunctionCoordsFromCell(world, fromX, fromY);
                let fromJuncIndex = getJunctionIndexFromCoords(junctionMap, fromJuncX, fromJuncY);
                let [toJuncX, toJuncY] = getJunctionCoordsFromCell(world, toX, toY);
                let toJuncIndex = getJunctionIndexFromCoords(junctionMap, toJuncX, toJuncY);
                if (fromJuncIndex === toJuncIndex) return;
                if (tryPutJunction(world, junctionMap, fromJuncX, fromJuncY) && tryPutJunction(world, junctionMap, toJuncX, toJuncY))
                {
                    tryConnectJunctions(world, junctionMap, fromJuncIndex, toJuncIndex);
                }
            }, (cellX, cellY) => {
                let [juncX, juncY] = getJunctionCoordsFromCell(world, cellX, cellY);
                if (!isJunctionWithinBounds(junctionMap, juncX, juncY)) return;
                let juncIndex = getJunctionIndexFromCoords(junctionMap, juncX, juncY);
                if (junctionMap.hasJunction(juncIndex))
                {
                    if (world.persistence.isPersistentJunction(juncIndex))
                    {
                        world.persistence.retainOnlyPersistentJunctionConnections(juncIndex);
                    }
                    else
                    {
                        removeJunction(junctionMap, juncIndex);
                    }
                }
            }, CELL_SIZE, DRAG_MARGIN);
    }
    else
    {
        cursor.status = 0;
    }

    cartManager.update(world);
}

function tryPutJunction(world, map, juncX, juncY)
{
    let index = getJunctionIndexFromCoords(map, juncX, juncY);
    if (isSolid(world, map, index)) return false;
    if (!map.hasJunction(index))
    {
        putJunction(map, juncX, juncY, 0);
    }
    return true;
}

function tryConnectJunctions(world, map, fromJuncIndex, toJuncIndex)
{
    if (fromJuncIndex === toJuncIndex) return false;
    let fromDirectable = world.directable.isDirectableJunction(fromJuncIndex);
    let toDirectable = world.directable.isDirectableJunction(toJuncIndex);
    if (fromDirectable)
    {
        return tryDirectJunction(world, map, fromJuncIndex, toJuncIndex);
    }
    else if (toDirectable)
    {
        return tryDirectJunction(world, map, toJuncIndex, fromJuncIndex);
    }
    
    if (!isJunctionConnectedTo(map, fromJuncIndex, toJuncIndex))
    {
        connectJunctions(map, fromJuncIndex, toJuncIndex);
    }
    if (!isJunctionConnectedTo(map, toJuncIndex, fromJuncIndex))
    {
        connectJunctions(map, toJuncIndex, fromJuncIndex);
    }
    return true;
}

/**
 * 
 * @param {AcreWorld} world 
 * @param {*} map 
 * @param {*} directableIndex 
 * @param {*} directedIndex 
 */
function tryDirectJunction(world, map, directableIndex, directedIndex)
{
    let prevDirectedIndex = world.directable.getDirectableJunctionChild(directableIndex);
    if (directedIndex === prevDirectedIndex) return true;
    if (world.directable.isDirectableJunction(directedIndex)) return false;
    if (!world.directable.isDirectableJunction(directableIndex)) return false;
    if (isSolid(world, map, directedIndex)) return false;
    if (!map.hasJunction(directedIndex))
    {
        let [juncX, juncY] = getJunctionCoordsFromIndex(map, directedIndex);
        putJunction(map, juncX, juncY, 0);
    }
    world.directable.redirectDirectableJunction(directableIndex, prevDirectedIndex, directedIndex);
    world.persistence.unmarkPersistentJunction(directableIndex, prevDirectedIndex);
    world.persistence.markPersistentJunction(directableIndex, directedIndex);
    return true;
}

function isSolid(world, map, juncIndex)
{
    return world.solids[juncIndex] > 0;
}

function setSolid(world, map, juncIndex)
{
    world.solids[juncIndex] = 1;
}

/**
 * @param {Game} game 
 * @param {CanvasRenderingContext2D} ctx
 * @param {AcreWorld} world 
 */
export function drawWorld(game, ctx, world)
{
    const map = world.junctionMap;
    const cartManager = world.cartManager;
    if (world.cursor.status !== CURSOR_ACTION.NONE)
    {
        const mapWidth = map.width;
        const mapHeight = map.height;
        ctx.lineWidth = 1;
        drawGrid(ctx, mapWidth, mapHeight, CELL_SIZE);
    }
    drawOutlets(ctx, map, CELL_SIZE);
    // drawJunctions(ctx, map, CELL_SIZE);
    // drawLanes(ctx, map, CELL_SIZE);
    // drawSolids(ctx, world, map, CELL_SIZE);
    drawCarts(ctx, cartManager, map, CELL_SIZE);
    drawHousings(ctx, world, CELL_SIZE);
    drawFactories(ctx, world, CELL_SIZE);
    if (world.cursor.status !== CURSOR_ACTION.NONE)
    {
        ctx.lineWidth = 2;
        drawCursor(ctx, world.cursor.screenX, world.cursor.screenY, CELL_SIZE, '#333333');
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} screenX
 * @param {number} screenY
 * @param {number} cellSize
 */
function drawCursor(ctx, screenX, screenY, cellSize, color = '#FFFFFF')
{
    let x = Math.floor(screenX / cellSize) * cellSize;
    let y = Math.floor(screenY / cellSize) * cellSize;
    ctx.strokeStyle = color;
    ctx.strokeRect(x, y, cellSize, cellSize);
}

function drawSolids(ctx, world, map, cellSize, color = '#663366')
{
    for(let y = 0; y < map.height; ++y)
    {
        for(let x = 0; x < map.width; ++x)
        {
            let i = x + y * map.width;
            if (isSolid(world, map, i))
            {
                ctx.fillStyle = color;
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

function drawHousings(ctx, world, cellSize)
{
    for(let housing of Object.values(world.housing))
    {
        drawHousing(ctx, housing.coordX, housing.coordY, cellSize);
    }
}

function drawHousing(ctx, cellX, cellY, cellSize)
{
    let size = cellSize * 0.8;
    let margin = (cellSize * 0.2) / 2;
    let x = cellX * cellSize + margin;
    let y = cellY * cellSize + margin;
    ctx.fillStyle = 'lime';
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = 'green';
    ctx.fillRect(x, y + (size / 2), size, size / 2);
}

function drawFactories(ctx, world, cellSize)
{
    for(let factory of Object.values(world.factory))
    {
        let margin = cellSize * 0.1;
        let x = factory.coordX * cellSize + margin;
        let y = factory.coordY * cellSize + margin;
        ctx.fillStyle = '#666666';
        ctx.fillRect(x + cellSize, y, cellSize * 2 - margin * 2, cellSize * 3 - margin * 2);

        let padding = cellSize * 0.1;
        ctx.fillStyle = 'red';
        let xx = x + cellSize + padding;
        let yy = y + padding;
        let ww = cellSize * 2 - margin * 2 - padding * 2;
        let hh = cellSize * 2 - margin * 2 - padding * 2;
        ctx.fillRect(xx, yy, ww, hh);
        ctx.fillStyle = 'maroon';
        ctx.fillRect(xx, yy + hh / 2, ww, hh / 2);
    }
}
