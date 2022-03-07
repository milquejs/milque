import { randomSingleDirectionalEncoding } from '../util/Directional.js';
import {
  connectJunctions,
  drawJunctions,
  drawLanes,
  drawOutlets,
  getJunctionCoordsFromIndex,
  getJunctionIndexFromCoords,
  isJunctionConnectedTo,
  isJunctionWithinBounds,
  isNullJunction,
  JunctionMap,
  putJunction,
  randomOutletJunctionFromJunction,
} from '../junction/Junction.js';
import { drawGrid } from '../render2d.js';
import {
  Directable,
  tryFindValidChildDirectionForDirectable,
} from './Directable.js';
import { Persistence } from './Persistence.js';
import { CURSOR_ACTION, tryRoadInteraction } from './RoadMaker.js';
import {
  drawAgents,
  NULL_JUNCTION_INDEX,
  PARKING_JUNCTION_INTENT,
  PASSING_JUNCTION_INTENT,
  TrafficSimulator,
} from '../cartworld/TrafficSimulator.js';
import { PathFinder } from '../cartworld/PathFinder.js';
import {
  CartManager,
  drawCarts,
  FRAMES_PER_TICK,
} from '../cartworld/CartManager.js';
import {
  findValidDestination,
  getPathToJunction,
} from '../cartworld/Navigator.js';
import { Demolition, drawDemolition } from './Demolition.js';
import {
  canPlaceHousing,
  drawFactories,
  drawHousings,
  isHousingAtJunction,
  placeFactory,
  placeHousing,
} from './Housing.js';
import { drawSolids, Solids } from './Solids.js';
import { ScoreKeeper } from './ScoreKeeper.js';
import { CARGO_KEYS, getCargoMainColor } from './Cargo.js';

export const CELL_SIZE = 32;
export const DRAG_MARGIN = 0.9;

export class AcreWorld {
  constructor(width, height) {
    this.cursor = {
      screenX: 0,
      screenY: 0,
      dragCellX: 0,
      dragCellY: 0,
      status: 0,
    };

    this.debugMode = false;
    this.framesToTick = 0;

    this.spawnTicks = 0;
    this.spawnCargoLevel = 0;
    this.spawnFactoryChance = 0;

    const map = new JunctionMap(width, height);
    this.junctionMap = map;
    this.trafficSimulator = new TrafficSimulator(map, (agents) =>
      planTraffic(this, agents)
    );
    this.pathFinder = new PathFinder(map);
    this.cartManager = new CartManager(map, this.trafficSimulator);
    this.persistence = new Persistence(map);
    this.directable = new Directable(map);
    this.demolition = new Demolition(map, this.pathFinder, this.persistence);
    this.solids = new Solids(map);

    this.scoreKeeper = new ScoreKeeper();

    this.housing = {};
    this.factory = {};
  }
}

export function createWorld() {
  let world = new AcreWorld(24, 16);
  const map = world.junctionMap;
  let x, y, result;
  let cargo = CARGO_KEYS[world.spawnCargoLevel];
  do {
    [x, y] = randomJunctionCoords(map, 0, 0, 1, 1);
    result = !tryPlaceFactory(world, x, y, cargo);
  } while (result);
  do {
    [x, y] = randomJunctionCoords(map, 0, 0, 1, 1);
    result = !tryPlaceHousing(world, x, y, cargo);
  } while (result);
  world.spawnTicks = 1000;
  return world;
}

/**
 * @param {AcreWorld} world
 */
export function updateWorld(display, inputs, world) {
  const cursor = world.cursor;
  const map = world.junctionMap;

  let screenX = inputs.getAxisValue('cursorX') * display.width;
  let screenY = inputs.getAxisValue('cursorY') * display.height;
  cursor.screenX = screenX;
  cursor.screenY = screenY;

  let action = inputs.isButtonDown('activate')
    ? CURSOR_ACTION.ACTIVATING
    : inputs.isButtonDown('deactivate')
    ? CURSOR_ACTION.DEACTIVATING
    : CURSOR_ACTION.NONE;
  tryRoadInteraction(
    screenX,
    screenY,
    action,
    cursor,
    (fromX, fromY, toX, toY) => {
      if (!isJunctionWithinBounds(map, fromX, fromY)) return;
      if (!isJunctionWithinBounds(map, toX, toY)) return;
      let [fromJuncX, fromJuncY] = getJunctionCoordsFromCell(
        world,
        fromX,
        fromY
      );
      let fromJuncIndex = getJunctionIndexFromCoords(map, fromJuncX, fromJuncY);
      let [toJuncX, toJuncY] = getJunctionCoordsFromCell(world, toX, toY);
      let toJuncIndex = getJunctionIndexFromCoords(map, toJuncX, toJuncY);
      if (fromJuncIndex === toJuncIndex) return;
      if (
        tryPutJunction(world, map, fromJuncX, fromJuncY) &&
        tryPutJunction(world, map, toJuncX, toJuncY)
      ) {
        tryConnectJunctions(world, map, fromJuncIndex, toJuncIndex);
      }
    },
    (cellX, cellY) => {
      let [juncX, juncY] = getJunctionCoordsFromCell(world, cellX, cellY);
      if (!isJunctionWithinBounds(map, juncX, juncY)) return;
      let juncIndex = getJunctionIndexFromCoords(map, juncX, juncY);
      if (map.hasJunction(juncIndex)) {
        world.demolition.markForDemolition(juncIndex);
      }
    },
    CELL_SIZE,
    DRAG_MARGIN
  );

  if (++world.framesToTick >= FRAMES_PER_TICK) {
    world.framesToTick = 0;
    planTraffic(
      world,
      world.trafficSimulator.getAgents().filter((agent) => agent.target === -1)
    );
    world.trafficSimulator.tick();
  }

  world.demolition.update();

  if (--world.spawnTicks <= 0) {
    world.spawnTicks = 100 + Math.floor(1000 * Math.random());
    doSpawnTick(world);
  }
}

/**
 *
 * @param {AcreWorld} world
 */
function doSpawnTick(world) {
  let spawnableLastCargo = CARGO_KEYS[world.spawnCargoLevel];
  let spawnableCargo;
  if (
    world.scoreKeeper.getCargoCount(spawnableLastCargo) > 0 &&
    Math.random() < 0.3
  ) {
    // Try next level.
    let index = Math.min(CARGO_KEYS.length - 1, world.spawnCargoLevel + 1);
    world.spawnCargoLevel = index;
    spawnableCargo = CARGO_KEYS[index];
    world.spawnFactoryChance = 0.5;
    world.spawnTicks = 100;
  } else {
    spawnableCargo =
      CARGO_KEYS[
        Math.min(
          world.spawnCargoLevel,
          Math.floor(Math.random() * CARGO_KEYS.length)
        )
      ];
  }

  let result;
  if (Math.random() < world.spawnFactoryChance) {
    result = trySpawnFactory(world, spawnableCargo);
    if (result) {
      world.spawnFactoryChance = 0;
    }
  } else {
    result = trySpawnHousing(world, spawnableCargo);
    if (result) {
      world.spawnFactoryChance += 0.05;
    }
  }
}

function trySpawnHousing(world, cargo) {
  const map = world.junctionMap;
  let x, y;
  let result;
  let attempts = 0;
  do {
    [x, y] = randomJunctionCoords(map, 0, 0, 1, 1);
    result = tryPlaceHousing(world, x, y, cargo);
    ++attempts;
  } while (!result && attempts < 10);
  return result;
}

function trySpawnFactory(world, cargo) {
  const map = world.junctionMap;
  let x, y;
  let result;
  let attempts = 0;
  do {
    [x, y] = randomJunctionCoords(map, 0, 0, 1, 1);
    result = tryPlaceFactory(world, x, y, cargo);
    ++attempts;
  } while (!result && attempts < 10);
  return result;
}

/**
 * @param {AcreWorld} world
 * @param {Array<TrafficAgent>} agents
 */
function planTraffic(world, agents) {
  const map = world.junctionMap;
  for (let agent of agents) {
    switch ('path') {
      case 'random':
        {
          let target =
            typeof agent.savedTarget !== 'undefined'
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
          if (!agent.pathId) {
            let destination;
            if (agent.junction === agent.home) {
              let cart = world.cartManager.getCartByAgentId(agent.id);
              destination = findValidDestination(world, map, cart);
            } else {
              let pathId = agent.homePathId;
              let path = world.pathFinder.getPathById(pathId);
              agent.homePathId = null;
              agent.pathId = pathId;
              if (path === 2) {
                // One step path.
                agent.setTarget(
                  path[1],
                  NULL_JUNCTION_INDEX,
                  PARKING_JUNCTION_INTENT
                );
              } else {
                // Path with multiple steps.
                agent.setTarget(path[1], path[2], PASSING_JUNCTION_INTENT);
              }
              break;
            }
            if (!isNullJunction(map, destination)) {
              let pathId = getPathToJunction(
                world,
                world.pathFinder,
                agent.junction,
                destination
              );
              let path = world.pathFinder.getPathById(pathId);
              if (!path || path.length < 2) {
                // No path.
                break;
              }
              let homePathId = getPathToJunction(
                world,
                world.pathFinder,
                destination,
                agent.home
              );
              let homePath = world.pathFinder.getPathById(homePathId);
              if (!homePath || homePath.length < 2) {
                // No return path.
                break;
              }
              agent.pathId = pathId;
              agent.homePathId = homePathId;
              if (path === 2) {
                // One step path.
                agent.setTarget(
                  path[1],
                  NULL_JUNCTION_INDEX,
                  PARKING_JUNCTION_INTENT
                );
              } else {
                // Path with multiple steps.
                agent.setTarget(path[1], path[2], PASSING_JUNCTION_INTENT);
              }
            }
          } else {
            // Already on a path.
            let pathId = agent.pathId;
            let path = world.pathFinder.getPathById(pathId);
            let i = path.indexOf(agent.junction);
            if (i >= 0) {
              if (i < path.length - 2) {
                agent.setTarget(
                  path[i + 1],
                  path[i + 2],
                  PASSING_JUNCTION_INTENT
                );
                world.pathFinder.prunePath(pathId, i);
              } else if (i < path.length - 1) {
                agent.setTarget(
                  path[i + 1],
                  NULL_JUNCTION_INDEX,
                  PARKING_JUNCTION_INTENT
                );
                world.pathFinder.prunePath(pathId, i);
              } else {
                // Got to the end!
                if (agent.junction !== agent.home) {
                  // Got to the factory!
                  let cart = world.cartManager.getCartByAgentId(agent.id);
                  world.scoreKeeper.recordCargo(cart.cargo, 1);
                }
                agent.pathId = null;
                agent.clearTarget();
                world.pathFinder.releasePath(pathId);
              }
            } else {
              // Lost? Stop moving.
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
 * @returns {boolean}
 */
export function tryPlaceHousing(world, juncX, juncY, cargo) {
  const map = world.junctionMap;
  const directable = world.directable;
  const solids = world.solids;
  if (!isJunctionWithinBounds(map, juncX - 1, juncY - 1)) return false;
  if (!isJunctionWithinBounds(map, juncX + 1, juncY + 1)) return false;
  // Cannot have any solids near it (except other housings)
  for (let i = -1; i <= 1; ++i) {
    for (let j = -1; j <= 1; ++j) {
      let jx = juncX + i;
      let jy = juncY + j;
      let ji = getJunctionIndexFromCoords(map, jx, jy);
      if (solids.isSolidJunction(ji) && !isHousingAtJunction(world, jx, jy)) {
        return false;
      }
    }
  }
  let juncIndex = getJunctionIndexFromCoords(map, juncX, juncY);
  let direction = tryFindValidChildDirectionForDirectable(
    map,
    juncIndex,
    randomSingleDirectionalEncoding(),
    (juncIndex) =>
      !directable.isDirectableJunction(juncIndex) &&
      !solids.isSolidJunction(juncIndex)
  );
  if (!canPlaceHousing(world, juncX, juncY, direction)) return false;
  placeHousing(world, juncX, juncY, direction, cargo);
  return true;
}

export function placeRoad(world, fromX, fromY, toX, toY) {
  const map = world.junctionMap;
  let fromIndex = getJunctionIndexFromCoords(map, fromX, fromY);
  let toIndex = getJunctionIndexFromCoords(map, toX, toY);
  if (!isJunctionConnectedTo(map, fromIndex, toIndex)) {
    connectJunctions(map, fromIndex, toIndex);
  }
  if (!isJunctionConnectedTo(map, toIndex, fromIndex)) {
    connectJunctions(map, toIndex, fromIndex);
  }
}

export function tryPlaceFactory(world, juncX, juncY, cargo) {
  const map = world.junctionMap;
  const solids = world.solids;
  if (!isJunctionWithinBounds(map, juncX - 1, juncY - 1)) return false;
  if (!isJunctionWithinBounds(map, juncX + 4, juncY + 5)) return false;
  for (let i = -1; i <= 4; ++i) {
    for (let j = -1; j <= 5; ++j) {
      let k = juncX + i + (juncY + j) * map.width;
      if (solids.isSolidJunction(k)) {
        return false;
      }
    }
  }
  for (let i = 1; i < 3; ++i) {
    for (let j = 0; j < 3; ++j) {
      let k = juncX + i + (juncY + j) * map.width;
      if (map.hasJunction(k)) {
        return false;
      }
    }
  }
  placeFactory(world, juncX, juncY, cargo);
  return true;
}

export function getJunctionCoordsFromCell(acreWorld, cellX, cellY) {
  return [cellX, cellY];
}

export function randomJunctionCoords(
  map,
  offsetX = 0,
  offsetY = 0,
  marginX = 0,
  marginY = 0
) {
  let w = map.width - offsetX - marginX * 2;
  let h = map.height - offsetY - marginY * 2;
  let x = Math.floor(Math.random() * w) + offsetX + marginX;
  let y = Math.floor(Math.random() * h) + offsetY + marginY;
  return [x, y];
}

function tryPutJunction(world, map, juncX, juncY) {
  let index = getJunctionIndexFromCoords(map, juncX, juncY);
  if (world.directable.isDirectableJunction(index)) return true;
  if (world.solids.isSolidJunction(index)) return false;
  if (!map.hasJunction(index)) {
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
function tryConnectJunctions(world, map, fromJuncIndex, toJuncIndex) {
  if (fromJuncIndex === toJuncIndex) return false;
  let fromDirectable = world.directable.isDirectableJunction(fromJuncIndex);
  let toDirectable = world.directable.isDirectableJunction(toJuncIndex);
  if (fromDirectable) {
    return tryDirectJunction(world, map, fromJuncIndex, toJuncIndex);
  } else if (toDirectable) {
    return tryDirectJunction(world, map, toJuncIndex, fromJuncIndex);
  }

  if (!isJunctionConnectedTo(map, fromJuncIndex, toJuncIndex)) {
    connectJunctions(map, fromJuncIndex, toJuncIndex);
  }
  if (!isJunctionConnectedTo(map, toJuncIndex, fromJuncIndex)) {
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
function tryDirectJunction(world, map, directableIndex, directedIndex) {
  let prevDirectedIndex =
    world.directable.getDirectableJunctionChild(directableIndex);
  if (directedIndex === prevDirectedIndex) return true;
  if (world.directable.isDirectableJunction(directedIndex)) return false;
  if (!world.directable.isDirectableJunction(directableIndex)) return false;
  if (world.solids.isSolidJunction(directedIndex)) return false;
  if (!map.hasJunction(directedIndex)) {
    let [juncX, juncY] = getJunctionCoordsFromIndex(map, directedIndex);
    putJunction(map, juncX, juncY, 0);
  }
  world.demolition.markForDemolition(prevDirectedIndex);
  world.directable.redirectDirectableJunction(
    directableIndex,
    prevDirectedIndex,
    directedIndex
  );
  world.persistence.unmarkPersistentJunction(
    directableIndex,
    prevDirectedIndex
  );
  world.persistence.markPersistentJunction(directableIndex, directedIndex);
  return true;
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {AcreWorld} world
 */
export function drawWorld(ctx, world) {
  const map = world.junctionMap;
  const cartManager = world.cartManager;
  if (world.cursor.status !== CURSOR_ACTION.NONE) {
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
  if (world.debugMode) {
    drawJunctions(ctx, map, CELL_SIZE);
    drawLanes(ctx, map, CELL_SIZE);
    drawAgents(ctx, map, world.trafficSimulator, CELL_SIZE);
  }
  if (world.cursor.status !== CURSOR_ACTION.NONE) {
    ctx.lineWidth = 2;
    drawCursor(
      ctx,
      world.cursor.screenX,
      world.cursor.screenY,
      CELL_SIZE,
      '#333333'
    );
  }
  let dom = new DOMMatrix();
  ctx.setTransform(dom);
  drawTimer(ctx, world);
  ctx.setTransform(dom.translate(0, 20));
  drawScore(ctx, world.scoreKeeper);
  ctx.setTransform(dom);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} screenX
 * @param {number} screenY
 * @param {number} cellSize
 */
function drawCursor(ctx, screenX, screenY, cellSize, color = '#FFFFFF') {
  let x = Math.floor(screenX / cellSize) * cellSize;
  let y = Math.floor(screenY / cellSize) * cellSize;
  ctx.strokeStyle = color;
  ctx.strokeRect(x, y, cellSize, cellSize);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {ScoreKeeper} scoreKeeper
 */
function drawScore(ctx, scoreKeeper) {
  ctx.font = '16px monospace';
  ctx.lineWidth = 1;
  ctx.textBaseline = 'top';
  let i = 0;
  for (let cargo of CARGO_KEYS) {
    let count = scoreKeeper.getCargoCount(cargo);
    if (count > 0) {
      let mainColor = getCargoMainColor(cargo);
      ctx.fillStyle = mainColor;
      ctx.fillText(`█ ${count}`, 0, i * 20);
      i += 1;
    }
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {AcreWorld} world
 */
function drawTimer(ctx, world) {
  ctx.font = '16px monospace';
  ctx.lineWidth = 1;
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'white';
  ctx.fillText(`% ${world.spawnTicks}`, 0, 0);
}
