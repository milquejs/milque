import { isDirectionalEncoding, randomSingleDirectionalEncoding } from '../util/Directional.js';
import { connectJunctions, drawJunctions, drawLanes, drawOutlets, getJunctionCoordsFromIndex, getJunctionIndexFromCoords, isJunctionConnectedTo, isJunctionWithinBounds, isNullJunction, JunctionMap, putJunction, randomOutletJunctionFromJunction } from '../laneworld/Junction.js';
import { drawGrid } from '../render2d.js';
import { Directable, tryFindValidChildDirectionForDirectable } from './Directable.js';
import { Persistence } from './Persistence.js';
import { CURSOR_ACTION, tryRoadInteraction } from './RoadMaker.js';
import { drawAgents, NULL_JUNCTION_INDEX, PARKING_JUNCTION_INTENT, PASSING_JUNCTION_INTENT, TrafficSimulator } from '../cartworld/TrafficSimulator.js';
import { PathFinder } from '../cartworld/PathFinder.js';
import { CartManager, drawCarts } from '../cartworld/CartManager.js';
import { findValidDestination, getPathToJunction } from '../cartworld/Navigator.js';
import { Demolition, drawDemolition } from './Demolition.js';
import { drawFactories, drawHousings, placeFactory, placeHousing } from './Housing.js';
import { drawSolids, Solids } from './Solids.js';

/**
 * @typedef {import('../../game/Game.js').Game} Game
 */

export const CELL_SIZE = 32;
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

        this.debugMode = false;
        this.framesToTick = 0;

        const map = new JunctionMap(width, height);
        this.junctionMap = map;
        this.trafficSimulator = new TrafficSimulator(map, (agents) => planTraffic(this, agents));
        this.pathFinder = new PathFinder(map);
        this.cartManager = new CartManager(map, this.trafficSimulator);
        this.persistence = new Persistence(map);
        this.directable = new Directable(map);
        this.demolition = new Demolition(map, this.pathFinder, this.persistence);
        this.solids = new Solids(map);

        this.housing = {};
        this.factory = {};
    }
}

export function createWorld()
{
    let world = new AcreWorld(24, 16);
    let map = world.junctionMap;

    for(let i = 0; i < 20; ++i)
    {
        let [x, y] = randomJunctionCoords(map, 0, 0, 1, 1);
        tryPlaceHousing(world, x, y);
    }

    for(let i = 0; i < 4; ++i)
    {
        let [x, y] = randomJunctionCoords(map, 0, 0, 1, 1);
        tryPlaceFactory(world, x, y);
    }
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
                            let cart = world.cartManager.getCartByAgentId(agent.id);
                            destination = findValidDestination(world, map, cart);
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

export function tryPlaceHousing(world, juncX, juncY)
{
    const map = world.junctionMap;
    let juncIndex = getJunctionIndexFromCoords(map, juncX, juncY);
    if (!map.hasJunction(juncIndex))
    {
        let direction = tryFindValidChildDirectionForDirectable(map, juncIndex, randomSingleDirectionalEncoding(), (juncIndex) => {
            return !world.directable.isDirectableJunction(juncIndex) && !world.solids.isSolidJunction(world, map, juncIndex);
        });
        if (isDirectionalEncoding(direction))
        {
            placeHousing(world, juncX, juncY, direction);
            return true;
        }
    }
    return false;
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

export function tryPlaceFactory(world, juncX, juncY)
{
    const map = world.junctionMap;
    if (!isJunctionWithinBounds(map, juncX, juncY)) return false;
    if (!isJunctionWithinBounds(map, juncX + 3, juncY + 3)) return false;
    for(let i = 0; i < 3; ++i)
    {
        for(let j = 0; j < 3; ++j)
        {
            let k = (juncX + i) + (juncY + j) * map.width;
            if (map.hasJunction(k))
            {
                return false;
            }
        }
    }
    placeFactory(world, juncX, juncY);
    return true;
}

export function getJunctionCoordsFromCell(acreWorld, cellX, cellY)
{
    return [
        cellX,
        cellY,
    ];
}

export function randomJunctionCoords(map, offsetX = 0, offsetY = 0, marginX = 0, marginY = 0)
{
    let w = map.width - offsetX - marginX * 2;
    let h = map.height - offsetY - marginY * 2;
    let x = Math.floor(Math.random() * w) + offsetX + marginX;
    let y = Math.floor(Math.random() * h) + offsetY + marginY;
    return [x, y];
}

function tryPutJunction(world, map, juncX, juncY)
{
    let index = getJunctionIndexFromCoords(map, juncX, juncY);
    if (world.directable.isDirectableJunction(index)) return true;
    if (world.solids.isSolidJunction(index)) return false;
    if (!map.hasJunction(index))
    {
        putJunction(map, juncX, juncY, 0);
    }
    return true;
}

/**
 * 
 * @param {AcreWorld} world 
 * @param {JunctionMap} map 
 * @param {JunctionIndex} fromJuncIndex 
 * @param {JunctionIndex} toJuncIndex 
 * @returns 
 */
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
    world.demolition.unmarkLaneForDemolition(fromJuncIndex, toJuncIndex);
    world.demolition.unmarkLaneForDemolition(toJuncIndex, fromJuncIndex);
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
    if (world.solids.isSolidJunction(directedIndex)) return false;
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
    drawSolids(ctx, world, map, CELL_SIZE);
    drawOutlets(ctx, map, CELL_SIZE);
    drawDemolition(ctx, map, world.demolition, CELL_SIZE);
    drawCarts(ctx, cartManager, world.framesToTick, FRAMES_PER_TICK, CELL_SIZE);
    drawHousings(ctx, world, CELL_SIZE);
    drawFactories(ctx, world, CELL_SIZE);
    if (world.debugMode)
    {
        drawJunctions(ctx, map, CELL_SIZE);
        drawLanes(ctx, map, CELL_SIZE);
        drawAgents(ctx, map, world.trafficSimulator, CELL_SIZE);
    }
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
