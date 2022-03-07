import { bresenhamLine, uuid } from '@milque/util';
import { Cursor, CURSOR_STATUS } from './Cursor.js';
import {
  DIRECTIONAL_ENCODING,
  DIRECTIONAL_ENCODING_BITS,
  getDirectionalVectorFromEncoding,
  getDirectionalBitArrayFromEncoding,
  getDirectionalEncodingFromBitArray,
  getDirectionalEncodingFromVector,
  randomSingleDirectionalEncoding,
  getOppositeDirectionIndex,
} from '../util/Directional.js';
import { World } from './World.js';
import { Lane, updateLanes } from './Lane.js';
import { assert } from '../util/assert.js';

const MAX_LANE_DISTANCE = 4;

const CELL_WIDTH = 64;
const CELL_HEIGHT = 64;
const HALF_CELL_WIDTH = CELL_WIDTH / 2;
const HALF_CELL_HEIGHT = CELL_HEIGHT / 2;

const CURSOR_ROAD_DRAG_MARGIN = 1.2;

const HOUSING_WIDTH = CELL_WIDTH / 2;
const HOUSING_HEIGHT = CELL_HEIGHT / 2;
const HALF_HOUSING_WIDTH = HOUSING_WIDTH / 2;
const HALF_HOUSING_HEIGHT = HOUSING_HEIGHT / 2;

const FACTORY_CELL_COUNT_X = 2;
const FACTORY_CELL_COUNT_Y = 3;

const CART_RADIUS = 5;

const ROAD_RADIUS = 2;

const EMPTY_ID = 0;
const ROAD_ID = 1;
const HOUSING_ID = 2;
const FACTORY_ROOT_ID = 3;
const FACTORY_PORT_ID = 4;
const FACTORY_BLOCK_ID = 5;

const LANE_UPDATE_TIME = 10;
const DRAW_UPDATE_TIME = LANE_UPDATE_TIME * 2;

/**
 * @typedef {import('../game/Game.js').Game} Game
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/input').InputContext} InputContext
 */

/**
 * @param {Game} game
 */
export async function main(game) {
  const display = game.display;
  const input = game.inputs;
  input.bindAxis('cursorX', 'Mouse', 'PosX');
  input.bindAxis('cursorY', 'Mouse', 'PosY');
  input.bindButton('activate', 'Mouse', 'Button0');
  input.bindButton('deactivate', 'Mouse', 'Button2');
  const ctx = display.getContext('2d');

  const worldMap = new World(8, 6);
  const cursor = new Cursor();
  putHousing(worldMap, 1, 1);
  putHousing(worldMap, 1, 2);
  putHousing(worldMap, 1, 3);
  putHousing(worldMap, 1, 5);
  putFactory(worldMap, 3, 2);

  putCellOneWayLane(worldMap, 0, 0, DIRECTIONAL_ENCODING.EAST);
  putCellOneWayLane(worldMap, 1, 0, DIRECTIONAL_ENCODING.EAST);
  //putCellTwoWayLanes(worldMap, 0, 0, DIRECTIONAL_ENCODING.EAST);

  let timer = 0;
  game.on('frame', () => {
    updateCursor(display, input, cursor, worldMap);

    if (++timer >= LANE_UPDATE_TIME) {
      updateLanes(worldMap);
      timer = 0;
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    drawWorldMap(ctx, worldMap, cursor);
    drawCursor(ctx, cursor, worldMap);
  });
}

/* ========================================== ------- ========================================== */
/* ========================================== CURSOR  ========================================== */
/* ========================================== ------- ========================================== */

/**
 * @param {DisplayPort} display
 * @param {InputContext} input
 * @param {Cursor} cursor
 * @param {World} worldMap
 */
function updateCursor(display, input, cursor, worldMap) {
  let cx = input.getAxisValue('cursorX') * display.canvas.width;
  let cy = input.getAxisValue('cursorY') * display.canvas.height;
  cursor.screenX = cx;
  cursor.screenY = cy;
  let txf = (cx - worldMap.offsetX) / CELL_WIDTH;
  let tx = Math.trunc(txf);
  let tyf = (cy - worldMap.offsetY) / CELL_HEIGHT;
  let ty = Math.trunc(tyf);
  cursor.cellX = Math.max(0, Math.min(tx, worldMap.width - 1));
  cursor.cellY = Math.max(0, Math.min(ty, worldMap.height - 1));

  let a = input.getButtonValue('activate');
  let b = input.getButtonValue('deactivate');
  if (a) {
    if (cursor.status === CURSOR_STATUS.ACTIVATING) {
      let prevCellX = cursor.dragCellX + 0.5;
      let prevCellY = cursor.dragCellY + 0.5;
      let nextCellX = txf;
      let nextCellY = tyf;
      let dx = nextCellX - prevCellX;
      let dy = nextCellY - prevCellY;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > CURSOR_ROAD_DRAG_MARGIN) {
        prevCellX = cursor.dragCellX;
        prevCellY = cursor.dragCellY;
        nextCellX = cursor.cellX;
        nextCellY = cursor.cellY;
        bresenhamLine(prevCellX, prevCellY, nextCellX, nextCellY, (x, y) => {
          putRoad(worldMap, prevCellX, prevCellY, x, y);
          nextCellX = prevCellX = x;
          nextCellY = prevCellY = y;
        });
        cursor.dragCellX = nextCellX;
        cursor.dragCellY = nextCellY;
      }
    } else {
      cursor.status = CURSOR_STATUS.ACTIVATING;
      cursor.dragCellX = cursor.cellX;
      cursor.dragCellY = cursor.cellY;
    }
  } else if (b) {
    if (cursor.status === CURSOR_STATUS.DEACTIVATING) {
      cursor.status = CURSOR_STATUS.DEACTIVATING;
      let x = cursor.cellX;
      let y = cursor.cellY;
      let id = worldMap.getCellId(x, y);
      if (x !== cursor.dragCellX || y !== cursor.dragCellY) {
        switch (id) {
          case ROAD_ID:
            eraseRoad(worldMap, x, y);
            break;
          case FACTORY_PORT_ID:
            cleanFactoryPort(worldMap, x, y);
            break;
        }
        cursor.dragCellX = x;
        cursor.dragCellY = y;
      }
    } else {
      cursor.status = CURSOR_STATUS.DEACTIVATING;
      cursor.dragCellX = -1;
      cursor.dragCellY = -1;
    }
  } else {
    cursor.status = CURSOR_STATUS.NONE;
  }
}

/* ========================================== ------- ========================================== */
/* ========================================== BUILDER ========================================== */
/* ========================================== ------- ========================================== */

/**
 * @param {World} worldMap
 */
function putHousing(worldMap, cellX, cellY) {
  if (!worldMap.isWithinBounds(cellX, cellY)) {
    throw new Error('Cannot put housing outside of map.');
  }
  let direction = randomSingleDirectionalEncoding();
  worldMap.setCell(cellX, cellY, HOUSING_ID, { direction });
  putCellTwoWayLanes(worldMap, cellX, cellY, direction);
}

/**
 * @param {World} worldMap
 */
function putFactory(worldMap, x, y) {
  if (!worldMap.isWithinBounds(x, y)) {
    throw new Error('Cannot put factory outside of map.');
  }
  for (let i = 0; i < FACTORY_CELL_COUNT_X; ++i) {
    for (let j = 0; j < FACTORY_CELL_COUNT_Y; ++j) {
      if (i === 0 && j === 0) {
        putFactoryRoot(worldMap, x, y);
      } else {
        putFactoryBlock(worldMap, x + i, y + j);
      }
    }
  }
  if (Math.random() > 0.5) {
    putFactoryPort(
      worldMap,
      x - 1,
      y + FACTORY_CELL_COUNT_Y - 1,
      x,
      y + FACTORY_CELL_COUNT_Y - 1
    );
  } else {
    putFactoryPort(
      worldMap,
      x + FACTORY_CELL_COUNT_X,
      y + FACTORY_CELL_COUNT_Y - 1,
      x + FACTORY_CELL_COUNT_X - 1,
      y + FACTORY_CELL_COUNT_Y - 1
    );
  }
}

/**
 * @param {World} worldMap
 */
function putFactoryRoot(worldMap, x, y) {
  if (!worldMap.isWithinBounds(x, y)) {
    throw new Error('Cannot put port outside of map.');
  }
  let i = x + y * worldMap.width;
  let factoryId = uuid();
  worldMap.cells[i] = FACTORY_ROOT_ID;
  worldMap.metas[i] = {
    id: factoryId,
    rootX: x,
    rootY: y,
  };
  worldMap.factories[factoryId] = {
    x,
    y,
  };
}

/**
 * @param {World} worldMap
 */
function putFactoryBlock(worldMap, x, y) {
  if (!worldMap.isWithinBounds(x, y)) {
    throw new Error('Cannot put port outside of map.');
  }
  let i = x + y * worldMap.width;
  worldMap.cells[i] = FACTORY_BLOCK_ID;
  worldMap.metas[i] = {
    rootX: x,
    rootY: y,
  };
}

/**
 * @param {World} worldMap
 */
function putFactoryPort(worldMap, x, y, parentX, parentY) {
  if (!worldMap.isWithinBounds(x, y)) {
    throw new Error('Cannot put port outside of map.');
  }
  let i = x + y * worldMap.width;
  let direction = getDirectionalEncodingFromVector(parentX - x, parentY - y);
  let oppositeDirection = getDirectionalEncodingFromVector(
    x - parentX,
    y - parentY
  );
  worldMap.cells[i] = FACTORY_PORT_ID;
  worldMap.metas[i] = {
    parentX,
    parentY,
    parentDirection: direction,
    direction: direction,
  };
  putCellTwoWayLanes(worldMap, x, y, direction);
  putCellTwoWayLanes(worldMap, parentX, parentY, oppositeDirection);
  let junctionId = getJunctionByCell(worldMap, parentX, parentY);
  let parentIndex = parentX + parentY * worldMap.width;
  let parentMetadata = worldMap.metas[parentIndex];
  let rootIndex = parentMetadata.rootX + parentMetadata.rootY * worldMap.width;
  let rootMetadata = worldMap.metas[rootIndex];
  let factoryId = rootMetadata.id;
  let portId = uuid();
  worldMap.ports[portId] = {
    factoryId,
    x,
    y,
    junctionId,
  };
}

/**
 * @param {World} worldMap
 */
function putRoad(worldMap, prevX, prevY, nextX, nextY) {
  if (prevX === nextX && prevY === nextY) return;
  let dx = prevX - nextX;
  let dy = prevY - nextY;
  if (isRoadConnectable(worldMap, prevX, prevY, nextX, nextY)) {
    putRoadImpl(worldMap, prevX, prevY, -dx, -dy);
    putRoadImpl(worldMap, nextX, nextY, dx, dy);
  }
}

/**
 * @param {World} worldMap
 * @param {number} prevX
 * @param {number} prevY
 * @param {number} nextX
 * @param {number} nextY
 * @returns {boolean}
 */
function isRoadConnectable(
  worldMap,
  prevCellX,
  prevCellY,
  nextCellX,
  nextCellY
) {
  if (!worldMap.isWithinBounds(prevCellX, prevCellY)) return false;
  if (!worldMap.isWithinBounds(nextCellX, nextCellY)) return false;
  let prevCellId = worldMap.getCellId(prevCellX, prevCellY);
  let nextCellId = worldMap.getCellId(nextCellX, nextCellY);
  if (
    prevCellId !== EMPTY_ID &&
    prevCellId !== ROAD_ID &&
    prevCellId !== HOUSING_ID &&
    prevCellId !== FACTORY_PORT_ID
  )
    return false;
  if (
    nextCellId !== EMPTY_ID &&
    nextCellId !== ROAD_ID &&
    nextCellId !== HOUSING_ID &&
    nextCellId !== FACTORY_PORT_ID
  )
    return false;
  return true;
}

/**
 * Assumes coordinates are within bounds and isRoadConnectable returns true.
 *
 * @param {World} worldMap
 */
function putRoadImpl(worldMap, x, y, dx, dy) {
  let i = x + y * worldMap.width;
  let id = worldMap.cells[i];
  switch (id) {
    case EMPTY_ID:
      {
        let direction = getDirectionalEncodingFromVector(dx, dy);
        worldMap.setCell(x, y, ROAD_ID, { direction });
        putCellTwoWayLanes(worldMap, x, y, direction);
      }
      return true;
    case ROAD_ID:
      {
        worldMap.metas[i].direction |= getDirectionalEncodingFromVector(dx, dy);
        putCellTwoWayLanes(worldMap, x, y, worldMap.metas[i].direction);
      }
      return true;
    case HOUSING_ID:
      {
        let xx = x + dx;
        let yy = y + dy;
        if (worldMap.isWithinBounds(xx, yy)) {
          let prevIndex = xx + yy * worldMap.width;
          let prevDirection = 0;
          if (worldMap.cells[prevIndex] !== EMPTY_ID) {
            prevDirection = worldMap.metas[prevIndex].direction;
          }
          pruneNeighboringRoads(worldMap, x, y);
          if (prevDirection) {
            if (worldMap.cells[prevIndex] === EMPTY_ID) {
              worldMap.setCell(xx, yy, ROAD_ID, { direction: prevDirection });
            } else {
              worldMap.metas[prevIndex].direction = prevDirection;
            }
          }
          putCellTwoWayLanes(worldMap, xx, yy, prevDirection);
        } else {
          pruneNeighboringRoads(worldMap, x, y);
        }
        worldMap.metas[i].direction = getDirectionalEncodingFromVector(dx, dy);
        putCellTwoWayLanes(worldMap, x, y, worldMap.metas[i].direction);
      }
      return true;
    case FACTORY_PORT_ID:
      {
        worldMap.metas[i].direction |= getDirectionalEncodingFromVector(dx, dy);
        putCellTwoWayLanes(worldMap, x, y, worldMap.metas[i].direction);
      }
      return true;
  }
  return false;
}

/**
 * @param {World} world
 * @param {number} cellX
 * @param {number} cellY
 * @param {number} directions
 */
function putCellOneWayLane(world, cellX, cellY, directions) {
  let cellIndex = cellX + cellY * world.width;
  let existingLanes = world.cellLanes[cellIndex] || [];
  let newLanes = [];
  world.cellLanes[cellIndex] = newLanes;
  {
    if (directions === 0) {
      // Deleting all the lanes.
    } else {
      // Making some lanes.
      let junction = putLaneImpl(
        world,
        cellX,
        cellY,
        'junction',
        existingLanes,
        newLanes
      );
      for (let i = 0; i < DIRECTIONAL_ENCODING_BITS; ++i) {
        let subdirs = directions & (1 << i);
        if (subdirs !== 0) {
          // Attach the branch to the junction.
          let outBranch = putLaneImpl(
            world,
            cellX,
            cellY,
            `out${i}`,
            existingLanes,
            newLanes
          );
          junction.addOutlet(outBranch.id);

          // Does this lead anywhere?
          let [dx, dy] = getDirectionalVectorFromEncoding(subdirs);
          let j = getOppositeDirectionIndex(i);
          const otherInBranchId = `lane-${cellX + dx}-${cellY + dy}-in${j}`;
          if (otherInBranchId in world.lanes) {
            outBranch.addOutlet(otherInBranchId);
          }
        }
      }
    }
  }
  eraseCellLanes(world, cellX, cellY, existingLanes);
  return newLanes;
}

/**
 * @param {World} world
 * @param {number} cellX
 * @param {number} cellY
 * @param {number} directions
 */
function putCellTwoWayLanes(world, cellX, cellY, directions) {
  let cellIndex = cellX + cellY * world.width;
  let existingLanes = world.cellLanes[cellIndex] || [];
  let newLanes = [];
  world.cellLanes[cellIndex] = newLanes;
  {
    if (directions === 0) {
      // Deleting all the lanes.
    } else {
      // Making some lanes.
      let junction = putLaneImpl(
        world,
        cellX,
        cellY,
        'junction',
        existingLanes,
        newLanes
      );
      for (let i = 0; i < DIRECTIONAL_ENCODING_BITS; ++i) {
        let subdirs = directions & (1 << i);
        if (subdirs !== 0) {
          // Attach the branch to the junction.
          let inBranch = putLaneImpl(
            world,
            cellX,
            cellY,
            `in${i}`,
            existingLanes,
            newLanes
          );
          let outBranch = putLaneImpl(
            world,
            cellX,
            cellY,
            `out${i}`,
            existingLanes,
            newLanes
          );
          junction.addOutlet(outBranch.id);
          inBranch.addOutlet(junction.id);

          // Does this lead anywhere?
          let [dx, dy] = getDirectionalVectorFromEncoding(subdirs);
          let j = getOppositeDirectionIndex(i);
          const otherInBranchId = `lane-${cellX + dx}-${cellY + dy}-in${j}`;
          const otherOutBranchId = `lane-${cellX + dx}-${cellY + dy}-out${j}`;
          if (otherInBranchId in world.lanes) {
            outBranch.addOutlet(otherInBranchId);
          }
          if (otherOutBranchId in world.lanes) {
            let otherBranach = world.lanes[otherOutBranchId];
            otherBranach.addOutlet(inBranch.id);
          }
        }
      }
    }
  }
  eraseCellLanes(world, cellX, cellY, existingLanes);
  return newLanes;
}

/**
 * @param {World} world
 * @param {number} cellX
 * @param {number} cellY
 * @param {string} laneType
 * @param {Array<string>} existingCellLanes
 * @param {Array<string>} newCellLanes
 * @returns {Lane}
 */
function putLaneImpl(
  world,
  cellX,
  cellY,
  laneType,
  existingCellLanes,
  newCellLanes
) {
  const laneId = `lane-${cellX}-${cellY}-${laneType}`;
  let lane;
  let i = existingCellLanes.indexOf(laneId);
  if (i >= 0) {
    lane = world.lanes[laneId];
    lane.outlets.length = 0;
    existingCellLanes.splice(i, 1);
  } else {
    lane = new Lane(laneId, cellX, cellY, MAX_LANE_DISTANCE);
    world.lanes[laneId] = lane;
  }
  newCellLanes.push(laneId);
  return lane;
}

function eraseCellLanes(world, cellX, cellY, targetLanesInCell) {
  if (targetLanesInCell.length <= 0) return;

  // Delete unused lanes by getting all possible feeders and remove them from their outputs.
  // Post-condition: All target lanes are removed from possible outlets.
  for (let i = -1; i <= 1; ++i) {
    for (let j = -1; j <= 1; ++j) {
      if (i === 0 && j === 0) continue;
      let lanes = getLanesByCell(world, cellX + i, cellY + j);
      for (let outletId of lanes) {
        let outlets = world.lanes[outletId].outlets;
        for (let targetLaneId of targetLanesInCell) {
          let k = outlets.indexOf(targetLaneId);
          if (k >= 0) {
            outlets.splice(k, 1);
          }
        }
      }
    }
  }
  // Delete unused lanes by removing from world.
  // Post-condition: All target lanes are removed from possible inlets.
  let lanes = getLanesByCell(world, cellX, cellY);
  for (let targetLaneId of targetLanesInCell) {
    let i = lanes.indexOf(targetLaneId);
    if (i >= 0) {
      lanes.splice(i, 1);
    }
    let targetLane = world.lanes[targetLaneId];
    targetLane.outlets.length = 0;
    delete world.lanes[targetLaneId];
  }
}

function getLanesByCell(world, cellX, cellY) {
  let cellIndex = cellX + cellY * world.width;
  return world.cellLanes[cellIndex] || [];
}

function getJunctionByCell(world, cellX, cellY) {
  const junctionId = `lane-${cellX}-${cellY}-junction`;
  if (junctionId in world.lanes) {
    return junctionId;
  } else {
    return null;
  }
}

/**
 * @param {World} worldMap
 */
function eraseRoad(worldMap, cellX, cellY) {
  if (!worldMap.isWithinBounds(cellX, cellY)) {
    throw new Error('Trying to erase road outside of world map.');
  }
  if (worldMap.getCellId(cellX, cellY) !== ROAD_ID) {
    throw new Error('Trying to erase non-road.');
  }
  worldMap.setCell(cellX, cellY, EMPTY_ID, null);
  pruneNeighboringRoads(worldMap, cellX, cellY);
  putCellTwoWayLanes(worldMap, cellX, cellY, 0);
}

/**
 * @param {World} worldMap
 */
function cleanFactoryPort(worldMap, x, y) {
  if (!worldMap.isWithinBounds(x, y)) {
    throw new Error('Trying to clean factory port outside of world map.');
  }
  let i = x + y * worldMap.width;
  let id = worldMap.cells[i];
  if (id !== FACTORY_PORT_ID) {
    throw new Error(
      `Trying to clean non-factory port; expected id ${FACTORY_PORT_ID} but found id ${id} instead.`
    );
  }
  worldMap.metas[i].direction = worldMap.metas[i].parentDirection;
  pruneNeighboringRoads(worldMap, x, y);
  putCellTwoWayLanes(worldMap, x, y, worldMap.metas[i].direction);
}

/**
 * @param {World} worldMap
 */
function pruneNeighboringRoads(worldMap, x, y) {
  for (let di = -1; di <= 1; ++di) {
    for (let dj = -1; dj <= 1; ++dj) {
      if (di === 0 && dj === 0) continue;
      let xx = x + di;
      let yy = y + dj;
      let dx = x - xx;
      let dy = y - yy;
      if (worldMap.isWithinBounds(xx, yy)) {
        let i = xx + yy * worldMap.width;
        let id = worldMap.cells[i];
        switch (id) {
          case ROAD_ID:
            {
              let metadata = worldMap.metas[i];
              metadata.direction &= ~getDirectionalEncodingFromVector(dx, dy);
              if (metadata.direction === 0) {
                worldMap.setCell(xx, yy, EMPTY_ID, null);
              }
              putCellTwoWayLanes(worldMap, xx, yy, metadata.direction);
            }
            break;
          case FACTORY_PORT_ID:
            {
              let metadata = worldMap.metas[i];
              metadata.direction &=
                metadata.parentDirection |
                ~getDirectionalEncodingFromVector(dx, dy);
              putCellTwoWayLanes(worldMap, xx, yy, metadata.direction);
            }
            break;
        }
      }
    }
  }
}

/* ========================================== ------- ========================================== */
/* ========================================== DRAWING ========================================== */
/* ========================================== ------- ========================================== */

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Cursor} cursor
 * @param {World} worldMap
 */
function drawCursor(ctx, cursor, worldMap) {
  ctx.fillStyle = 'white';
  ctx.fillRect(
    Math.trunc(cursor.screenX) - 2,
    Math.trunc(cursor.screenY) - 2,
    4,
    4
  );

  const { offsetX, offsetY } = worldMap;
  ctx.translate(offsetX, offsetY);
  if (cursor.status !== CURSOR_STATUS.NONE) {
    ctx.lineWidth = 2;
    switch (cursor.status) {
      case CURSOR_STATUS.ACTIVATING:
        {
          let x = cursor.cellX * CELL_WIDTH + HALF_CELL_WIDTH;
          let y = cursor.cellY * CELL_HEIGHT + HALF_CELL_HEIGHT;
          let tox = cursor.dragCellX * CELL_WIDTH + HALF_CELL_WIDTH;
          let toy = cursor.dragCellY * CELL_HEIGHT + HALF_CELL_HEIGHT;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.lineWidth = ROAD_RADIUS * 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(tox, toy);
          ctx.stroke();
        }
        break;
      case CURSOR_STATUS.DEACTIVATING:
        {
          ctx.strokeStyle = 'red';
          ctx.strokeRect(
            cursor.cellX * CELL_WIDTH,
            cursor.cellY * CELL_HEIGHT,
            CELL_WIDTH,
            CELL_HEIGHT
          );
        }
        break;
    }
  }
  ctx.translate(-offsetX, -offsetY);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {World} worldMap
 * @param {Cursor} cursor
 */
function drawWorldMap(ctx, worldMap, cursor) {
  const MAP_WIDTH = worldMap.width;
  const MAP_HEIGHT = worldMap.height;
  const { offsetX, offsetY } = worldMap;
  ctx.translate(offsetX, offsetY);
  ctx.lineWidth = 1;
  if (cursor.status !== CURSOR_STATUS.NONE) {
    for (let y = 0; y < MAP_HEIGHT; ++y) {
      for (let x = 0; x < MAP_WIDTH; ++x) {
        let xx = x * CELL_WIDTH;
        let yy = y * CELL_HEIGHT;
        ctx.strokeStyle = '#333';
        ctx.strokeRect(xx, yy, CELL_WIDTH, CELL_HEIGHT);
      }
    }
  }
  for (let y = 0; y < MAP_HEIGHT; ++y) {
    for (let x = 0; x < MAP_WIDTH; ++x) {
      let xx = x * CELL_WIDTH;
      let yy = y * CELL_HEIGHT;
      let i = x + y * worldMap.width;
      let id = worldMap.cells[i];
      let metadata = worldMap.metas[i];
      ctx.translate(xx, yy);
      switch (id) {
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
          ctx.fillRect(0, 0, CELL_WIDTH, CELL_HEIGHT);
          break;
      }
      ctx.translate(-xx, -yy);
    }
  }
  for (let lane of Object.values(worldMap.lanes)) {
    drawLane(ctx, lane);
  }
  for (let cart of Object.values(worldMap.carts)) {
    drawCart(ctx, cart, worldMap);
  }
  ctx.translate(-offsetX, -offsetY);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Cart} cart
 * @param {World} worldMap
 */
function drawCart(ctx, cart, worldMap) {
  const { x, y, cellX, cellY } = cart;
  let dx = (cellX - x) / DRAW_UPDATE_TIME;
  let dy = (cellY - y) / DRAW_UPDATE_TIME;
  let xx = x + dx;
  let yy = y + dy;
  cart.x = xx;
  cart.y = yy;
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(
    xx * CELL_WIDTH + HALF_CELL_WIDTH,
    yy * CELL_HEIGHT + HALF_CELL_HEIGHT,
    CART_RADIUS,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

const OUT_OFFSET = 4;
/**
 * @param {CanvasRenderingContext2D} ctx
 */
function drawLane(ctx, lane) {
  let { id, cellX, cellY } = lane;
  let i = id.lastIndexOf('-');
  let dir = id.substring(i + 1);
  switch (dir) {
    case 'in0':
      drawLaneSegment(ctx, cellX, cellY, DIRECTIONAL_ENCODING.EAST);
      break;
    case 'in1':
      drawLaneSegment(ctx, cellX, cellY, DIRECTIONAL_ENCODING.NORTHEAST);
      break;
    case 'in2':
      drawLaneSegment(ctx, cellX, cellY, DIRECTIONAL_ENCODING.NORTH);
      break;
    case 'in3':
      drawLaneSegment(ctx, cellX, cellY, DIRECTIONAL_ENCODING.NORTHWEST);
      break;
    case 'in4':
      drawLaneSegment(ctx, cellX, cellY, DIRECTIONAL_ENCODING.WEST);
      break;
    case 'in5':
      drawLaneSegment(ctx, cellX, cellY, DIRECTIONAL_ENCODING.SOUTHWEST);
      break;
    case 'in6':
      drawLaneSegment(ctx, cellX, cellY, DIRECTIONAL_ENCODING.SOUTH);
      break;
    case 'in7':
      drawLaneSegment(ctx, cellX, cellY, DIRECTIONAL_ENCODING.SOUTHEAST);
      break;
    case 'out0':
      drawLaneSegment(ctx, cellX, cellY, DIRECTIONAL_ENCODING.EAST, OUT_OFFSET);
      break;
    case 'out1':
      drawLaneSegment(
        ctx,
        cellX,
        cellY,
        DIRECTIONAL_ENCODING.NORTHEAST,
        OUT_OFFSET
      );
      break;
    case 'out2':
      drawLaneSegment(
        ctx,
        cellX,
        cellY,
        DIRECTIONAL_ENCODING.NORTH,
        OUT_OFFSET
      );
      break;
    case 'out3':
      drawLaneSegment(
        ctx,
        cellX,
        cellY,
        DIRECTIONAL_ENCODING.NORTHWEST,
        OUT_OFFSET
      );
      break;
    case 'out4':
      drawLaneSegment(ctx, cellX, cellY, DIRECTIONAL_ENCODING.WEST, OUT_OFFSET);
      break;
    case 'out5':
      drawLaneSegment(
        ctx,
        cellX,
        cellY,
        DIRECTIONAL_ENCODING.SOUTHWEST,
        OUT_OFFSET
      );
      break;
    case 'out6':
      drawLaneSegment(
        ctx,
        cellX,
        cellY,
        DIRECTIONAL_ENCODING.SOUTH,
        OUT_OFFSET
      );
      break;
    case 'out7':
      drawLaneSegment(
        ctx,
        cellX,
        cellY,
        DIRECTIONAL_ENCODING.SOUTHEAST,
        OUT_OFFSET
      );
      break;
    case 'junction':
      {
        ctx.fillStyle = 'red';
        ctx.fillRect(
          cellX * CELL_WIDTH + HALF_CELL_WIDTH - ROAD_RADIUS * 2,
          cellY * CELL_HEIGHT + HALF_CELL_HEIGHT - ROAD_RADIUS * 2,
          ROAD_RADIUS * 4,
          ROAD_RADIUS * 4
        );
      }
      break;
    default:
      ctx.fillStyle = 'blue';
      ctx.beginPath();
      ctx.arc(
        cellX * CELL_WIDTH + HALF_CELL_WIDTH,
        cellY * CELL_HEIGHT + HALF_CELL_HEIGHT,
        CART_RADIUS,
        0,
        Math.PI * 2
      );
      ctx.fill();
      break;
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function drawLaneSegment(ctx, cellX, cellY, directionalMetadata, offset = 0) {
  if (offset) {
    ctx.strokeStyle = 'gold';
  } else {
    ctx.strokeStyle = 'blue';
  }
  ctx.lineWidth = ROAD_RADIUS * 2;
  ctx.lineCap = 'square';
  let [dx, dy] = getDirectionalVectorFromEncoding(directionalMetadata);
  let ortho = Math.atan2(dy, dx) - Math.PI / 2;
  let odx = Math.cos(ortho - Math.PI / 4);
  let ody = Math.sin(ortho - Math.PI / 4);
  let sdx = Math.cos(ortho - (3 * Math.PI) / 4);
  let sdy = Math.sin(ortho - (3 * Math.PI) / 4);
  ctx.beginPath();
  let x = cellX * CELL_WIDTH + HALF_CELL_WIDTH - offset;
  let y = cellY * CELL_HEIGHT + HALF_CELL_HEIGHT - offset;
  ctx.moveTo(x, y);
  let endX = x + dx * HALF_CELL_WIDTH;
  let endY = y + dy * HALF_CELL_HEIGHT;
  ctx.lineTo(endX, endY);
  ctx.lineTo(endX + odx * 10, endY + ody * 10);
  ctx.moveTo(endX, endY);
  ctx.lineTo(endX + sdx * 10, endY + sdy * 10);
  ctx.stroke();
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function drawCellRoad(ctx, id, metadata, x, y) {
  const halfw = HALF_CELL_WIDTH;
  const halfh = HALF_CELL_HEIGHT;
  const fullw = halfw * 2;
  const fullh = halfh * 2;
  const cx = halfw;
  const cy = halfh;
  const [ee, ne, nn, nw, ww, sw, ss, se] = getDirectionalBitArrayFromEncoding(
    metadata.direction
  );
  let flag = false;
  ctx.strokeStyle = 'white';
  ctx.lineCap = 'round';
  ctx.lineWidth = ROAD_RADIUS * 2;
  ctx.beginPath();
  if (ee) {
    ctx.moveTo(cx, cy);
    ctx.lineTo(fullw, halfh);
    flag = true;
  }
  if (ne) {
    ctx.moveTo(cx, cy);
    ctx.lineTo(fullw, 0);
    flag = true;
  }
  if (nn) {
    ctx.moveTo(cx, cy);
    ctx.lineTo(halfw, 0);
    flag = true;
  }
  if (nw) {
    ctx.moveTo(cx, cy);
    ctx.lineTo(0, 0);
    flag = true;
  }
  if (ww) {
    ctx.moveTo(cx, cy);
    ctx.lineTo(0, halfh);
    flag = true;
  }
  if (sw) {
    ctx.moveTo(cx, cy);
    ctx.lineTo(0, fullh);
    flag = true;
  }
  if (ss) {
    ctx.moveTo(cx, cy);
    ctx.lineTo(halfw, fullh);
    flag = true;
  }
  if (se) {
    ctx.moveTo(cx, cy);
    ctx.lineTo(fullw, fullh);
    flag = true;
  }
  ctx.stroke();
  if (!flag) {
    ctx.fillStyle = 'white';
    ctx.fillRect(halfw - 4, halfh - 4, 8, 8);
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function drawCellHousing(ctx, id, metadata, x, y) {
  drawCellRoad(ctx, id, metadata);
  ctx.fillStyle = 'green';
  ctx.fillRect(
    HALF_CELL_WIDTH - HALF_HOUSING_WIDTH,
    HALF_CELL_HEIGHT - HALF_HOUSING_HEIGHT,
    HOUSING_WIDTH,
    HOUSING_HEIGHT
  );
  ctx.fillStyle = 'darkgreen';
  ctx.fillRect(
    HALF_CELL_WIDTH - HALF_HOUSING_WIDTH,
    HALF_CELL_HEIGHT,
    HOUSING_WIDTH,
    HALF_HOUSING_HEIGHT
  );
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function drawCellFactory(ctx, id, metadata, x, y) {
  ctx.fillStyle = 'gray';
  ctx.fillRect(
    0,
    0,
    FACTORY_CELL_COUNT_X * CELL_WIDTH,
    FACTORY_CELL_COUNT_Y * CELL_HEIGHT
  );

  const margin = 16;
  ctx.fillStyle = 'red';
  ctx.fillRect(
    margin,
    margin,
    FACTORY_CELL_COUNT_X * CELL_WIDTH - margin * 2,
    (FACTORY_CELL_COUNT_Y - 1) * CELL_HEIGHT - margin * 2
  );
  ctx.fillStyle = 'maroon';
  ctx.fillRect(
    margin,
    margin + CELL_HEIGHT,
    FACTORY_CELL_COUNT_X * CELL_WIDTH - margin * 2,
    (FACTORY_CELL_COUNT_Y - 2) * CELL_HEIGHT - margin * 2
  );
  ctx.fillRect(
    (FACTORY_CELL_COUNT_X / 2) * CELL_WIDTH - 8,
    (FACTORY_CELL_COUNT_Y / 2) * CELL_HEIGHT + 8,
    16,
    16
  );
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function drawCellFactoryPort(ctx, id, metadata, x, y) {
  drawCellRoad(ctx, id, metadata);
  let dx = x - metadata.parentX;
  let dy = y - metadata.parentY;
  ctx.fillStyle = 'gray';
  ctx.fillRect(
    HALF_CELL_WIDTH - HALF_HOUSING_WIDTH - dx * HOUSING_WIDTH,
    HALF_CELL_HEIGHT - HALF_HOUSING_HEIGHT - dy * HOUSING_HEIGHT,
    HOUSING_WIDTH,
    HOUSING_HEIGHT
  );
}

/* ========================================== ------- ========================================== */
/* ========================================== TESTING ========================================== */
/* ========================================== ------- ========================================== */

function test() {
  testCardinal();
  testInterCardinal();
  testPutRoad();
}

function testInterCardinal() {
  let metadata = getDirectionalEncodingFromBitArray(0, 1, 0, 1, 0, 1, 0, 1);
  let dirs = getDirectionalBitArrayFromEncoding(metadata);
  assert(
    dirs[0] === 0 &&
      dirs[1] === 1 &&
      dirs[2] === 0 &&
      dirs[3] === 1 &&
      dirs[4] === 0 &&
      dirs[5] === 1 &&
      dirs[6] === 0 &&
      dirs[7] === 1
  );
}

function testCardinal() {
  let metadata = getDirectionalEncodingFromBitArray(1, 0, 1, 0, 1, 0, 1, 0);
  let dirs = getDirectionalBitArrayFromEncoding(metadata);
  assert(
    dirs[0] === 1 &&
      dirs[1] === 0 &&
      dirs[2] === 1 &&
      dirs[3] === 0 &&
      dirs[4] === 1 &&
      dirs[5] === 0 &&
      dirs[6] === 1 &&
      dirs[7] === 0
  );
}

function testPutRoad() {
  let worldMap, i, j;

  worldMap = new World(8, 6);
  putRoad(worldMap, 0, 0, 1, 1);
  i = 0;
  j = 1 + worldMap.width;
  assert(worldMap.cells[i] === ROAD_ID);
  assert(worldMap.metas[i].direction === DIRECTIONAL_ENCODING.SOUTHEAST);
  assert(worldMap.cells[j] === ROAD_ID);
  assert(worldMap.metas[j].direction === DIRECTIONAL_ENCODING.NORTHWEST);

  worldMap = new World(8, 6);
  putRoad(worldMap, 1, 1, 0, 0);
  i = 0;
  j = 1 + worldMap.width;
  assert(worldMap.cells[i] === ROAD_ID);
  assert(worldMap.metas[i].direction === DIRECTIONAL_ENCODING.SOUTHEAST);
  assert(worldMap.cells[j] === ROAD_ID);
  assert(worldMap.metas[j].direction === DIRECTIONAL_ENCODING.NORTHWEST);
}

test();
