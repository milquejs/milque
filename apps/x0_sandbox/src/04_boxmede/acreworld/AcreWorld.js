import { DIRECTIONAL_ENCODING_BITS, getDirectionalVectorFromEncoding, nextDirectionalEncoding, randomSingleDirectionalEncoding } from '../cellworld/Directional.js';
import { CartManager, createCart, drawCarts, updateTraffic } from '../laneworld/Cart.js';
import { connectJunctions, disconnectJunctions, drawJunctions, drawLanes, drawOutlets, getJunctionCoordsFromIndex, getJunctionIndexFromCoords, isJunctionConnectedTo, isJunctionWithinBounds, JunctionMap, putJunction, removeJunction } from '../laneworld/Junction.js';
import { drawGrid } from '../render2d.js';
import { makeRoad } from './RoadMaker.js';

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
        this.cartManager = new CartManager();

        this.directable = new Array(width * height).fill(-1);
        this.directed = new Array(width * height).fill(-1);
        this.statics = new Array(width * height).fill(0);
        this.solids = new Array(width * height).fill(0);
    }
}

/**
 * @param {AcreWorld} world 
 * @param {number} juncX 
 * @param {number} juncY 
 */
export function placeHousing(world, juncX, juncY)
{
    putDirectableJunction(world, world.junctionMap, juncX, juncY, 2);
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
    if (!isJunctionWithinBounds(map, juncX - 1, juncY)
        || !isJunctionWithinBounds(map, juncX + 3, juncY + 3))
    {
        throw new Error('Cannot place factory out of bounds.');
    }

    for(let i = 0; i < 2; ++i)
    {
        for(let j = 0; j < 3; ++j)
        {
            let juncIndex = (juncX + i) + (juncY + j) * map.width;
            setSolid(world, map, juncIndex);
        }
    }
    putStaticJunction(world, map, juncX - 1, juncY + 2);
    putStaticJunction(world, map, juncX, juncY + 2);
    placeRoad(world, juncX - 1, juncY + 2, juncX, juncY + 2);
    putStaticJunction(world, world.junctionMap, juncX + 2, juncY + 2);
    putStaticJunction(world, world.junctionMap, juncX + 1, juncY + 2);
    placeRoad(world, juncX + 2, juncY + 2, juncX + 1, juncY + 2);
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

export function createWorld(game)
{
    let world = new AcreWorld(8, 6);

    placeHousing(world, 1, 1);
    placeFactory(world, 1, 2);

    createCart(world.cartManager, world.junctionMap, 1, 1);
    createCart(world.cartManager, world.junctionMap, 1, 1);
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
                if (junctionMap.hasJunction(juncIndex) && isDeletableJunction(world, junctionMap, juncIndex))
                {
                    removeJunction(junctionMap, juncIndex);
                }
            }, CELL_SIZE, DRAG_MARGIN);
    }
    else
    {
        cursor.status = 0;
    }

    if (++cartManager.tickFrames > 15)
    {
        cartManager.tickFrames = 0;
        updateTraffic(cartManager, junctionMap);
    }
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
    let fromDirectable = isDirectableJunction(world, map, fromJuncIndex);
    let toDirectable = isDirectableJunction(world, map, toJuncIndex);
    if (fromDirectable || toDirectable)
    {
        if (fromDirectable && !toDirectable)
        {
            tryDirectJunction(world, map, fromJuncIndex, toJuncIndex);
            return true;
        }
        else if (toDirectable && !fromDirectable)
        {
            tryDirectJunction(world, map, toJuncIndex, fromJuncIndex);
            return true;
        }
        return false;
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

function putStaticJunction(world, map, juncX, juncY, parkingCapacity = 0)
{
    let juncIndex = getJunctionIndexFromCoords(map, juncX, juncY);
    putJunction(map, juncX, juncY, parkingCapacity);
    setStaticJunction(world, map, juncIndex);
}

function putDirectableJunction(world, map, juncX, juncY, parkingCapacity = 0)
{
    if (!isJunctionWithinBounds(map, juncX - 1, juncY - 1) || !isJunctionWithinBounds(map, juncX + 1, juncY + 1))
    {
        throw new Error('Cannot place directable junction at boundry.');
    }
    let directional = randomSingleDirectionalEncoding();
    let directable = getJunctionIndexFromCoords(map, juncX, juncY);
    let directed;
    let dx, dy;
    let flag = false;
    for(let i = 0; i < DIRECTIONAL_ENCODING_BITS; ++i)
    {
        [dx, dy] = getDirectionalVectorFromEncoding(directional);
        directed = getJunctionIndexFromCoords(map, juncX + dx, juncY + dy);
        if (!map.hasJunction(directed) || !isDirectableJunction(world, map, directed))
        {
            flag = true;
            break;
        }
        directional = nextDirectionalEncoding(directional);
    }
    if (!flag)
    {
        throw new Error('Cannot find valid place for directable junction.');
    }

    if (map.hasJunction(directable))
    {
        throw new Error('Cannot put directable junction on existing junction.');
    }

    putJunction(map, juncX, juncY, parkingCapacity);
    if (!map.hasJunction(directed))
    {
        putJunction(map, juncX + dx, juncY + dy, parkingCapacity);
    }
    setDirectedJunction(world, map, directable, directed);
    connectJunctions(map, directable, directed);
    connectJunctions(map, directed, directable);
}

function tryDirectJunction(world, map, directableIndex, directedIndex)
{
    if (!isDirectableJunction(world, map, directableIndex))
    {
        throw new Error('Cannot direct non-directable junction.');
    }
    let prevDirectedIndex = getDirectedJunction(world, map, directableIndex);
    let prevDirected = map.getJunction(prevDirectedIndex);
    disconnectJunctions(map, directableIndex, prevDirectedIndex);
    disconnectJunctions(map, prevDirectedIndex, directableIndex);
    if (prevDirected.isEmpty())
    {
        map.deleteJunction(prevDirectedIndex);
    }
    world.directed[prevDirectedIndex] = -1;

    if (!map.hasJunction(directedIndex))
    {
        let [juncX, juncY] = getJunctionCoordsFromIndex(map, directedIndex);
        putJunction(map, juncX, juncY, 0);
    }
    connectJunctions(map, directableIndex, directedIndex);
    connectJunctions(map, directedIndex, directableIndex);
    setDirectedJunction(world, map, directableIndex, directedIndex);
}

function setDirectedJunction(world, map, directableIndex, directedIndex)
{
    if (!map.hasJunction(directableIndex))
    {
        throw new Error('Cannot make non-existant junction directable.');
    }
    if (!map.hasJunction(directedIndex))
    {
        throw new Error('Cannot make non-existant junction directed.');
    }
    if (isDirectableJunction(world, map, directedIndex))
    {
        throw new Error('Cannot direct directable junction to another directable junction.');
    }
    world.directable[directableIndex] = directedIndex;
    world.directed[directedIndex] = directableIndex;
}

function getDirectedJunction(world, map, directableIndex)
{
    return world.directable[directableIndex];
}

function getDirectableJunction(world, map, directedIndex)
{
    return world.directed[directedIndex];
}

function isDirectableJunction(world, map, juncIndex)
{
    return world.directable[juncIndex] >= 0;
}

function isDirectedJunction(world, map, juncIndex)
{
    return world.directed[juncIndex] >= 0;
}

function isDeletableJunction(world, map, juncIndex)
{
    return !isDirectableJunction(world, map, juncIndex)
        && !isDirectedJunction(world, map, juncIndex)
        && !isStaticJunction(world, map, juncIndex);
}

function isStaticJunction(world, map, juncIndex)
{
    return world.statics[juncIndex] > 0;
}

function setStaticJunction(world, map, juncIndex)
{
    if (!map.hasJunction(juncIndex))
    {
        throw new Error('Cannot make non-existant junction static.');
    }
    world.statics[juncIndex] = 1;
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
    const mapWidth = map.width;
    const mapHeight = map.height;
    ctx.lineWidth = 1;
    drawGrid(ctx, mapWidth, mapHeight, CELL_SIZE);
    drawOutlets(ctx, map, CELL_SIZE);
    drawJunctions(ctx, map, CELL_SIZE);
    drawLanes(ctx, map, CELL_SIZE);
    drawSolids(ctx, world, map, CELL_SIZE);
    drawCarts(ctx, world.cartManager, map, CELL_SIZE);
    ctx.lineWidth = 4;
    drawCursor(ctx, world.cursor.screenX, world.cursor.screenY, CELL_SIZE);
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
