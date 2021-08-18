import { uuid } from '@milque/util';
import { getDirectionalVectorFromEncoding, isDirectionalEncoding, randomSingleDirectionalEncoding } from '../util/Directional.js';
import { connectJunctions, drawOutlets, getJunctionCoordsFromIndex, getJunctionIndexFromCoords, getJunctionIndexFromJunction, isJunctionConnectedTo, isJunctionWithinBounds, isNullJunction, JunctionMap, putJunction, randomOutletJunctionFromJunction } from '../laneworld/Junction.js';
import { drawGrid } from '../render2d.js';
import { Directable, tryFindValidChildDirectionForDirectable } from './Directable.js';
import { Persistence } from './Persistence.js';
import { CURSOR_ACTION, tryRoadInteraction } from './RoadMaker.js';
import { NULL_JUNCTION_INDEX, PARKING_JUNCTION_INTENT, PASSING_JUNCTION_INTENT, TrafficSimulator } from '../cartworld/TrafficSimulator.js';
import { PathFinder } from '../cartworld/PathFinder.js';
import { CartManager, drawCarts } from '../cartworld/CartManager.js';
import { findValidDestination, getPathToJunction } from '../cartworld/Navigator.js';
import { Demolition, drawDemolition } from './Demolition.js';

/**
 * @typedef {import('../../game/Game.js').Game} Game
 */

export const CELL_SIZE = 64;
export const DRAG_MARGIN = 0.9;
export const FRAMES_PER_TICK = 30;

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

        this.framesToTick = 0;

        const map = new JunctionMap(width, height);
        this.junctionMap = map;
        this.trafficSimulator = new TrafficSimulator(map, (agents) => planTraffic(this, agents));
        this.pathFinder = new PathFinder(map);
        this.cartManager = new CartManager(map, this.trafficSimulator);
        this.persistence = new Persistence(map);
        this.directable = new Directable(map);
        this.demolition = new Demolition(map, this.pathFinder, this.persistence);

        this.solids = new Array(width * height).fill(0);

        this.housing = {};
        this.factory = {};
    }
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
    const map = world.junctionMap;

    let screenX = game.inputs.getAxisValue('cursorX') * game.display.width;
    let screenY = game.inputs.getAxisValue('cursorY') * game.display.height;
    cursor.screenX = screenX;
    cursor.screenY = screenY;

    let action = game.inputs.isButtonDown('activate')
        ? CURSOR_ACTION.ACTIVATING
        : game.inputs.isButtonDown('deactivate')
            ? CURSOR_ACTION.DEACTIVATING
            : CURSOR_ACTION.NONE;
    tryRoadInteraction(screenX, screenY, action, cursor, (fromX, fromY, toX, toY) => {
        if (!isJunctionWithinBounds(map, fromX, fromY)) return;
        if (!isJunctionWithinBounds(map, toX, toY)) return;
        let [fromJuncX, fromJuncY] = getJunctionCoordsFromCell(world, fromX, fromY);
        let fromJuncIndex = getJunctionIndexFromCoords(map, fromJuncX, fromJuncY);
        let [toJuncX, toJuncY] = getJunctionCoordsFromCell(world, toX, toY);
        let toJuncIndex = getJunctionIndexFromCoords(map, toJuncX, toJuncY);
        if (fromJuncIndex === toJuncIndex) return;
        if (tryPutJunction(world, map, fromJuncX, fromJuncY) && tryPutJunction(world, map, toJuncX, toJuncY))
        {
            tryConnectJunctions(world, map, fromJuncIndex, toJuncIndex);
        }
    }, (cellX, cellY) => {
        let [juncX, juncY] = getJunctionCoordsFromCell(world, cellX, cellY);
        if (!isJunctionWithinBounds(map, juncX, juncY)) return;
        let juncIndex = getJunctionIndexFromCoords(map, juncX, juncY);
        if (map.hasJunction(juncIndex))
        {
            world.demolition.markForDemolition(juncIndex);
        }
    }, CELL_SIZE, DRAG_MARGIN);

    if (++world.framesToTick >= FRAMES_PER_TICK)
    {
        world.framesToTick = 0;
        planTraffic(world, world.trafficSimulator.getAgents().filter(agent => agent.target === -1));
        world.trafficSimulator.tick();
    }

    world.demolition.update();
}

/**
 * @param {AcreWorld} world 
 * @param {Array<TrafficAgent>} agents 
 */
function planTraffic(world, agents)
{
    const map = world.junctionMap;
    for(let agent of agents)
    {
        switch('path')
        {
            case 'random':
                {
                    let target = typeof agent.savedTarget !== 'undefined'
                        ? agent.savedTarget
                        : randomOutletJunctionFromJunction(map, agent.junction);
                    let nextTarget = randomOutletJunctionFromJunction(map, target);
                    agent.savedTarget = nextTarget;
                    let intent = PASSING_JUNCTION_INTENT;
                    agent.setTarget(target, nextTarget, intent);
                }
                break;
            case 'path':
                {
                    if (!agent.pathId)
                    {
                        let destination;
                        if (agent.junction === agent.home)
                        {
                            destination = findValidDestination(world, map);
                        }
                        else
                        {
                            let pathId = agent.homePathId;
                            let path = world.pathFinder.getPathById(pathId);
                            agent.homePathId = null;
                            agent.pathId = pathId;
                            if (path === 2)
                            {
                                // One step path.
                                agent.setTarget(path[1], NULL_JUNCTION_INDEX, PARKING_JUNCTION_INTENT);
                            }
                            else
                            {
                                // Path with multiple steps.
                                agent.setTarget(path[1], path[2], PASSING_JUNCTION_INTENT);
                            }
                            break;
                        }
                        if (!isNullJunction(map, destination))
                        {
                            let pathId = getPathToJunction(world, world.pathFinder, agent.junction, destination);
                            let path = world.pathFinder.getPathById(pathId);
                            if (!path || path.length < 2)
                            {
                                // No path.
                                break;
                            }
                            let homePathId = getPathToJunction(world, world.pathFinder, destination, agent.home);
                            let homePath = world.pathFinder.getPathById(homePathId);
                            if (!homePath || homePath.length < 2)
                            {
                                // No return path.
                                break;
                            }
                            agent.pathId = pathId;
                            agent.homePathId = homePathId;
                            if (path === 2)
                            {
                                // One step path.
                                agent.setTarget(path[1], NULL_JUNCTION_INDEX, PARKING_JUNCTION_INTENT);
                            }
                            else
                            {
                                // Path with multiple steps.
                                agent.setTarget(path[1], path[2], PASSING_JUNCTION_INTENT);
                            }
                        }
                    }
                    else
                    {
                        // Already on a path.
                        let pathId = agent.pathId;
                        let path = world.pathFinder.getPathById(pathId);
                        let i = path.indexOf(agent.junction);
                        if (i >= 0)
                        {
                            if (i < path.length - 2)
                            {
                                agent.setTarget(path[i + 1], path[i + 2], PASSING_JUNCTION_INTENT);
                                world.pathFinder.prunePath(pathId, i);
                            }
                            else if (i < path.length - 1)
                            {
                                agent.setTarget(path[i + 1], NULL_JUNCTION_INDEX, PARKING_JUNCTION_INTENT);
                                world.pathFinder.prunePath(pathId, i);
                            }
                            else
                            {
                                agent.pathId = null;
                                agent.clearTarget();
                                world.pathFinder.releasePath(pathId);
                            }
                        }
                        else
                        {
                            agent.pathId = null;
                            agent.clearTarget();
                            world.pathFinder.releasePath(pathId);
                        }
                    }
                }
                break;
        }
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
    let cartA = world.cartManager.createCart(juncX, juncY, Math.atan2(dy, dx));
    let cartB = world.cartManager.createCart(juncX, juncY, Math.atan2(dy, dx));
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
    world.demolition.markForDemolition(prevDirectedIndex);
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
    drawDemolition(ctx, map, world.demolition, CELL_SIZE);
    // drawJunctions(ctx, map, CELL_SIZE);
    // drawLanes(ctx, map, CELL_SIZE);
    // drawSolids(ctx, world, map, CELL_SIZE);
    drawCarts(ctx, cartManager, world.framesToTick, FRAMES_PER_TICK, CELL_SIZE);
    drawHousings(ctx, world, CELL_SIZE);
    drawFactories(ctx, world, CELL_SIZE);
    // drawAgents(ctx, map, world.trafficSimulator, CELL_SIZE);
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
