import { bresenhamLine, astarSearch } from '@milque/util';
import { DIRECTION_METADATA, getDirectionBitsFromMetadata, getDirectionMetadataFromBits, getDirectionMetadataFromDelta, randomDirectionMetadata } from './DirectionMetadata.js';

const CELL_WIDTH = 64;
const CELL_HEIGHT = 64;
const HALF_CELL_WIDTH = CELL_WIDTH / 2;
const HALF_CELL_HEIGHT = CELL_HEIGHT / 2;

const HOUSING_WIDTH = 32;
const HOUSING_HEIGHT = 32;
const HALF_HOUSING_WIDTH = HOUSING_WIDTH / 2;
const HALF_HOUSING_HEIGHT = HOUSING_HEIGHT / 2;

const FACTORY_CELL_COUNT_X = 2;
const FACTORY_CELL_COUNT_Y = 3;

const CART_RADIUS = 6;

const EMPTY_ID = 0;
const ROAD_ID = 1;
const HOUSING_ID = 2;
const FACTORY_ROOT_ID = 3;
const FACTORY_PORT_ID = 4;
const FACTORY_BLOCK_ID = 5;

const CURSOR_STATUS = {
    NONE: 0,
    ACTIVATING: 1,
    DEACTIVATING: 2,
};

/**
 * @typedef {import('../game/Game.js').Game} Game
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/input').InputContext} InputContext
 */

/**
 * @param {Game} game
 */
export async function main(game)
{
    let display = game.display;
    let input = game.inputs;
    input.bindAxis('cursorX', 'Mouse', 'PosX');
    input.bindAxis('cursorY', 'Mouse', 'PosY');
    input.bindButton('activate', 'Mouse', 'Button0');
    input.bindButton('deactivate', 'Mouse', 'Button2');
    let ctx = display.getContext('2d');

    let worldMap = createWorldMap();
    let cursor = createCursor();
    putHousing(worldMap, 1, 1);
    putHousing(worldMap, 1, 2);
    putHousing(worldMap, 1, 3);
    putHousing(worldMap, 1, 5);
    putFactory(worldMap, 3, 2);

    createCart(worldMap, 1, 1);
    createCart(worldMap, 1, 1);
    createCart(worldMap, 1, 2);
    createCart(worldMap, 1, 2);
    createCart(worldMap, 1, 3);
    createCart(worldMap, 1, 3);

    game.on('frame', () => {
        updateCursor(display, input, cursor, worldMap);
        for(let cart of worldMap.carts)
        {
            updateCart(worldMap, cart);
        }
        
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        drawWorldMap(ctx, worldMap, cursor);
        drawCursor(ctx, cursor, worldMap);
    });
}

function createCart(worldMap, x, y)
{
    if (!isWithinWorldMap(worldMap, x, y))
    {
        throw new Error('Cannot create cart outside of map.');
    }
    let i = x + y * worldMap.width;
    if (worldMap.cells[i] !== HOUSING_ID)
    {
        throw new Error('Cannot create cart on non-housing cell.');
    }
    let cart = {
        x: x,
        y: y,
        cellX: x,
        cellY: y,
        sourceX: x,
        sourceY: y,
        pathfinder: {
            updateTicks: 0,
            destinationX: x,
            destinationY: y,
            pathIndex: -1,
            path: [],
            returning: false,
        },
    };
    worldMap.carts.push(cart);
    return cart;
}

function updateCart(worldMap, cart)
{
    let pathfinder = cart.pathfinder;
    if (pathfinder.pathIndex < 0)
    {
        if (++pathfinder.updateTicks >= 100)
        {
            pathfinder.updateTicks = 0;
            let x = Math.trunc(Math.random() * worldMap.width);
            let y = Math.trunc(Math.random() * worldMap.height);
            pathfinder.destinationX = x;
            pathfinder.destinationY = y;
            pathfinder.returning = false;
            pathfinder.pathIndex = 0;
            pathfinder.path = astarSearch(cart.cellX, cart.cellY, x, y, (fromX, fromY, toX, toY) => {
                if (isWithinWorldMap(worldMap, toX, toY))
                {
                    let i = toX + toY * worldMap.width;
                    if (worldMap.cells[i] === ROAD_ID)
                    {
                        let desired = getDirectionMetadataFromDelta(fromX - toX, fromY - toY);
                        return worldMap.metas[i].direction & desired;
                    }
                    else if (worldMap.cells[i] === HOUSING_ID)
                    {
                        let desired = getDirectionMetadataFromDelta(fromX - toX, fromY - toY);
                        return worldMap.metas[i].direction & desired;
                    }
                    else
                    {
                        return false;
                    }
                }
                return false;
            });
        }
    }
    else if (pathfinder.pathIndex >= pathfinder.path.length)
    {
        pathfinder.returning = true;
        pathfinder.pathIndex = pathfinder.path.length - 1;
    }
    else
    {
        let [ nextX, nextY ] = pathfinder.path[pathfinder.pathIndex];
        let dx = nextX - cart.x;
        let dy = nextY - cart.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let speed = 0.01;
        if (dist < speed)
        {
            if (pathfinder.returning)
            {
                pathfinder.pathIndex -= 1;
            }
            else
            {
                pathfinder.pathIndex += 1;
            }
        }
        else
        {
            let dr = Math.atan2(dy, dx);
            cart.x += Math.cos(dr) * speed;
            cart.y += Math.sin(dr) * speed;
        }
    }
}

function putHousing(worldMap, x, y)
{
    if (!isWithinWorldMap(worldMap, x, y))
    {
        throw new Error('Cannot put housing outside of map.');
    }
    let i = x + y * worldMap.width;
    worldMap.cells[i] = HOUSING_ID;
    worldMap.metas[i] = {
        direction: randomDirectionMetadata(),
    };
}

function putFactory(worldMap, x, y)
{
    if (!isWithinWorldMap(worldMap, x, y))
    {
        throw new Error('Cannot put factory outside of map.');
    }
    for(let i = 0; i < FACTORY_CELL_COUNT_X; ++i)
    {
        for(let j = 0; j < FACTORY_CELL_COUNT_Y; ++j)
        {
            if (i === 0 && j === 0)
            {
                putFactoryRoot(worldMap, x, y);
            }
            else
            {
                putFactoryBlock(worldMap, x + i, y + j);
            }
        }
    }
    if (Math.random() > 0.5)
    {
        putFactoryPort(worldMap, x - 1, y + FACTORY_CELL_COUNT_Y - 1, x, y + FACTORY_CELL_COUNT_Y - 1);
    }
    else
    {
        putFactoryPort(worldMap, x + FACTORY_CELL_COUNT_X, y + FACTORY_CELL_COUNT_Y - 1, x + FACTORY_CELL_COUNT_X - 1, y + FACTORY_CELL_COUNT_Y - 1);
    }
}

function putFactoryRoot(worldMap, x, y)
{
    if (!isWithinWorldMap(worldMap, x, y))
    {
        throw new Error('Cannot put port outside of map.');
    }
    let i = x + y * worldMap.width;
    worldMap.cells[i] = FACTORY_ROOT_ID;
    worldMap.metas[i] = {};
}

function putFactoryBlock(worldMap, x, y)
{
    if (!isWithinWorldMap(worldMap, x, y))
    {
        throw new Error('Cannot put port outside of map.');
    }
    let i = x + y * worldMap.width;
    worldMap.cells[i] = FACTORY_BLOCK_ID;
    worldMap.metas[i] = {
        rootX: x,
        rootY: y,
    };
}

function putFactoryPort(worldMap, x, y, parentX, parentY)
{
    if (!isWithinWorldMap(worldMap, x, y))
    {
        throw new Error('Cannot put port outside of map.');
    }
    let i = x + y * worldMap.width;
    let direction = getDirectionMetadataFromDelta(parentX - x, parentY - y);
    worldMap.cells[i] = FACTORY_PORT_ID;
    worldMap.metas[i] = {
        parentX,
        parentY,
        parentDirection: direction,
        direction: direction,
    };
}

function createCursor()
{
    return {
        x: 0,
        y: 0,
        cellX: 0,
        cellY: 0,
        dragCellX: 0,
        dragCellY: 0,
        status: CURSOR_STATUS.NONE,
    };
}

/**
 * 
 * @param {DisplayPort} display 
 * @param {InputContext} input 
 * @param {object} cursor 
 * @param {object} worldMap 
 */
function updateCursor(display, input, cursor, worldMap)
{
    let cx = input.getAxisValue('cursorX') * display.canvas.width;
    let cy = input.getAxisValue('cursorY') * display.canvas.height;
    cursor.x = cx;
    cursor.y = cy;
    let txf = (cx - worldMap.offsetX) / CELL_WIDTH;
    let tx = Math.trunc(txf);
    let tyf = (cy - worldMap.offsetY) / CELL_HEIGHT;
    let ty = Math.trunc(tyf);
    cursor.cellX = Math.max(0, Math.min(tx, worldMap.width - 1));
    cursor.cellY = Math.max(0, Math.min(ty, worldMap.height - 1));
    
    let a = input.getButtonValue('activate');
    let b = input.getButtonValue('deactivate');
    if (a)
    {
        if (cursor.status === CURSOR_STATUS.ACTIVATING)
        {
            let prevCellX = cursor.dragCellX + 0.5;
            let prevCellY = cursor.dragCellY + 0.5;
            let nextCellX = txf;
            let nextCellY = tyf;
            let dx = nextCellX - prevCellX;
            let dy = nextCellY - prevCellY;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0.9)
            {
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
        }
        else
        {
            cursor.status = CURSOR_STATUS.ACTIVATING;
            cursor.dragCellX = cursor.cellX;
            cursor.dragCellY = cursor.cellY;
        }
    }
    else if (b)
    {
        if (cursor.status === CURSOR_STATUS.DEACTIVATING)
        {
            cursor.status = CURSOR_STATUS.DEACTIVATING;
            let x = cursor.cellX;
            let y = cursor.cellY;
            let i = x + y * worldMap.width;
            let id = worldMap.cells[i];
            if (x !== cursor.dragCellX || y !== cursor.dragCellY)
            {
                switch(id)
                {
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
        }
        else
        {
            cursor.status = CURSOR_STATUS.DEACTIVATING;
            cursor.dragCellX = -1;
            cursor.dragCellY = -1;
        }
    }
    else
    {
        cursor.status = CURSOR_STATUS.NONE;
    }
}

function drawCursor(ctx, cursor, worldMap)
{
    ctx.fillStyle = 'white';
    ctx.fillRect(Math.trunc(cursor.x) - 2, Math.trunc(cursor.y) - 2, 4, 4);

    const { offsetX, offsetY } = worldMap;
    ctx.translate(offsetX, offsetY);
    if (cursor.status !== CURSOR_STATUS.NONE)
    {
        ctx.lineWidth = 2;
        switch (cursor.status)
        {
            case CURSOR_STATUS.ACTIVATING:
                ctx.strokeStyle = 'white';
                break;
            case CURSOR_STATUS.DEACTIVATING:
                ctx.strokeStyle = 'red';
                break;
        }
        ctx.strokeRect(cursor.cellX * CELL_WIDTH, cursor.cellY * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
    }
    ctx.translate(-offsetX, -offsetY);
}

function putRoad(worldMap, prevX, prevY, nextX, nextY)
{
    if (prevX === nextX && prevY === nextY) return;
    let dx = prevX - nextX;
    let dy = prevY - nextY;
    // TODO: IsConnectable() would be better instead of write then erase.
    if (putRoadImpl(worldMap, prevX, prevY, -dx, -dy))
    {
        if (!putRoadImpl(worldMap, nextX, nextY, dx, dy))
        {
            pruneNeighboringRoads(worldMap, nextX, nextY);
        }
    }
}

function putRoadImpl(worldMap, x, y, dx, dy)
{
    if (!isWithinWorldMap(worldMap, x, y)) return false;
    let i = x + y * worldMap.width;
    let id = worldMap.cells[i];
    switch(id)
    {
        case EMPTY_ID:
            {
                worldMap.cells[i] = ROAD_ID;
                worldMap.metas[i] = {
                    direction: getDirectionMetadataFromDelta(dx, dy)
                };
            }
            return true;
        case ROAD_ID:
            {
                worldMap.metas[i].direction |= getDirectionMetadataFromDelta(dx, dy);
            }
            return true;
        case HOUSING_ID:
            {
                let xx = x + dx;
                let yy = y + dy;
                if (isWithinWorldMap(worldMap, xx, yy))
                {
                    let prevIndex = xx + yy * worldMap.width;
                    let prevDirection = 0;
                    if (worldMap.cells[prevIndex] !== EMPTY_ID)
                    {
                        prevDirection = worldMap.metas[prevIndex].direction;
                    }
                    pruneNeighboringRoads(worldMap, x, y);
                    if (prevDirection)
                    {
                        if (worldMap.cells[prevIndex] === EMPTY_ID)
                        {
                            worldMap.cells[prevIndex] = ROAD_ID;
                            worldMap.metas[prevIndex] = {
                                direction: prevDirection
                            };
                        }
                        else
                        {
                            worldMap.metas[prevIndex].direction = prevDirection;
                        }
                    }
                }
                else
                {
                    pruneNeighboringRoads(worldMap, x, y);
                }
                worldMap.metas[i].direction = getDirectionMetadataFromDelta(dx, dy);
            }
            return true;
        case FACTORY_PORT_ID:
            {
                worldMap.metas[i].direction |= getDirectionMetadataFromDelta(dx, dy);
            }
            return true;
    }
    return false;
}

function eraseRoad(worldMap, x, y)
{
    if (!isWithinWorldMap(worldMap, x, y))
    {
        throw new Error('Trying to erase road outside of world map.');
    }
    let i = x + y * worldMap.width;
    let id = worldMap.cells[i];
    if (id !== ROAD_ID)
    {
        throw new Error(`Trying to erase non-road; expected id ${ROAD_ID} but found id ${id} instead.`);
    }
    forceEmpty(worldMap, i);
    pruneNeighboringRoads(worldMap, x, y);
}

function cleanFactoryPort(worldMap, x, y)
{
    if (!isWithinWorldMap(worldMap, x, y))
    {
        throw new Error('Trying to clean factory port outside of world map.');
    }
    let i = x + y * worldMap.width;
    let id = worldMap.cells[i];
    if (id !== FACTORY_PORT_ID)
    {
        throw new Error(`Trying to clean non-factory port; expected id ${FACTORY_PORT_ID} but found id ${id} instead.`);
    }
    worldMap.metas[i].direction = worldMap.metas[i].parentDirection;
    pruneNeighboringRoads(worldMap, x, y);
}

function forceEmpty(worldMap, index)
{
    worldMap.cells[index] = EMPTY_ID;
    worldMap.metas[index] = null;
}

function pruneNeighboringRoads(worldMap, x, y)
{
    for(let di = -1; di <= 1; ++di)
    {
        for(let dj = -1; dj <=1; ++dj)
        {
            if (di === 0 && dj === 0) continue;
            let xx = x + di;
            let yy = y + dj;
            let dx = x - xx;
            let dy = y - yy;
            if (isWithinWorldMap(worldMap, xx, yy))
            {
                let i = xx + yy * worldMap.width;
                let id = worldMap.cells[i];
                switch(id)
                {
                    case ROAD_ID:
                        {
                            let metadata = worldMap.metas[i];
                            metadata.direction &= ~getDirectionMetadataFromDelta(dx, dy);
                            if (metadata.direction === 0)
                            {
                                forceEmpty(worldMap, i);
                            }
                        }
                        break;
                    case FACTORY_PORT_ID:
                        {
                            let metadata = worldMap.metas[i];
                            metadata.direction &= metadata.parentDirection | ~getDirectionMetadataFromDelta(dx, dy);
                        }
                        break;
                }
            }
        }
    }
}

function createWorldMap()
{
    const MAP_WIDTH = 8;
    const MAP_HEIGHT = 6;
    const MAP_LENGTH = MAP_WIDTH * MAP_HEIGHT;
    return {
        width: MAP_WIDTH,
        height: MAP_HEIGHT,
        length: MAP_LENGTH,
        offsetX: 0,
        offsetY: 0,
        cells: new Uint8Array(MAP_LENGTH),
        metas: new Array(MAP_LENGTH).map(() => ({})),
        carts: [],
    };
}

function drawWorldMap(ctx, worldMap, cursor)
{
    const MAP_WIDTH = worldMap.width;
    const MAP_HEIGHT = worldMap.height;
    const { offsetX, offsetY } = worldMap;
    ctx.translate(offsetX, offsetY);
    ctx.lineWidth = 1;
    if (cursor.status !== CURSOR_STATUS.NONE)
    {
        for(let y = 0; y < MAP_HEIGHT; ++y)
        {
            for(let x = 0; x < MAP_WIDTH; ++x)
            {
                let xx = x * CELL_WIDTH;
                let yy = y * CELL_HEIGHT;
                ctx.strokeStyle = '#333';
                ctx.strokeRect(xx, yy, CELL_WIDTH, CELL_HEIGHT);
            }
        }
    }
    for(let y = 0; y < MAP_HEIGHT; ++y)
    {
        for(let x = 0; x < MAP_WIDTH; ++x)
        {
            let xx = x * CELL_WIDTH;
            let yy = y * CELL_HEIGHT;
            let i = x + y * worldMap.width;
            let id = worldMap.cells[i];
            let metadata = worldMap.metas[i];
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
                    ctx.fillRect(0, 0, CELL_WIDTH, CELL_HEIGHT);
                    break;
            }
            ctx.translate(-xx, -yy);
        }
    }
    for(let cart of worldMap.carts)
    {
        drawCart(ctx, cart);
    }
    ctx.translate(-offsetX, -offsetY);
}

function isWithinWorldMap(worldMap, x, y)
{
    return x >= 0 && y >= 0 && x < worldMap.width && y < worldMap.height;
}

function drawCart(ctx, cart)
{
    let { x, y } = cart;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x * CELL_WIDTH + HALF_CELL_WIDTH, y * CELL_HEIGHT + HALF_CELL_HEIGHT, CART_RADIUS, 0, Math.PI * 2);
    ctx.fill();
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function drawCellRoad(ctx, id, metadata, x, y)
{
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    let [ ee, ne, nn, nw, ww, sw, ss, se ] = getDirectionBitsFromMetadata(metadata.direction);
    let flag = false;
    if (ee)
    {
        ctx.moveTo(HALF_CELL_WIDTH, HALF_CELL_HEIGHT);
        ctx.lineTo(CELL_WIDTH, HALF_CELL_HEIGHT);
        flag = true;
    }
    if (ne)
    {
        ctx.moveTo(HALF_CELL_WIDTH, HALF_CELL_HEIGHT);
        ctx.lineTo(CELL_WIDTH, 0);
        flag = true;
    }
    if (nn)
    {
        ctx.moveTo(HALF_CELL_WIDTH, HALF_CELL_HEIGHT);
        ctx.lineTo(HALF_CELL_WIDTH, 0);
        flag = true;
    }
    if (nw)
    {
        ctx.moveTo(HALF_CELL_WIDTH, HALF_CELL_HEIGHT);
        ctx.lineTo(0, 0);
        flag = true;
    }
    if (ww)
    {
        ctx.moveTo(HALF_CELL_WIDTH, HALF_CELL_HEIGHT);
        ctx.lineTo(0, HALF_CELL_HEIGHT);
        flag = true;
    }
    if (sw)
    {
        ctx.moveTo(HALF_CELL_WIDTH, HALF_CELL_HEIGHT);
        ctx.lineTo(0, CELL_HEIGHT);
        flag = true;
    }
    if (ss)
    {
        ctx.moveTo(HALF_CELL_WIDTH, HALF_CELL_HEIGHT);
        ctx.lineTo(HALF_CELL_WIDTH, CELL_HEIGHT);
        flag = true;
    }
    if (se)
    {
        ctx.moveTo(HALF_CELL_WIDTH, HALF_CELL_HEIGHT);
        ctx.lineTo(CELL_WIDTH, CELL_HEIGHT);
        flag = true;
    }
    ctx.stroke();
    if (!flag)
    {
        ctx.fillStyle = 'white';
        ctx.fillRect(HALF_CELL_WIDTH - 4, HALF_CELL_HEIGHT - 4, 8, 8);
    }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function drawCellHousing(ctx, id, metadata, x, y)
{
    drawCellRoad(ctx, id, metadata);
    ctx.fillStyle = 'green';
    ctx.fillRect(HALF_CELL_WIDTH - HALF_HOUSING_WIDTH, HALF_CELL_HEIGHT - HALF_HOUSING_HEIGHT, HOUSING_WIDTH, HOUSING_HEIGHT);
    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(HALF_CELL_WIDTH - HALF_HOUSING_WIDTH, HALF_CELL_HEIGHT, HOUSING_WIDTH, HALF_HOUSING_HEIGHT);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function drawCellFactory(ctx, id, metadata, x, y)
{
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, FACTORY_CELL_COUNT_X * CELL_WIDTH, FACTORY_CELL_COUNT_Y * CELL_HEIGHT);

    let margin = 16;
    ctx.fillStyle = 'red';
    ctx.fillRect(margin, margin, FACTORY_CELL_COUNT_X * CELL_WIDTH - margin * 2, (FACTORY_CELL_COUNT_Y - 1) * CELL_HEIGHT - margin * 2);
    ctx.fillStyle = 'maroon';
    ctx.fillRect(margin, margin + CELL_HEIGHT, FACTORY_CELL_COUNT_X * CELL_WIDTH - margin * 2, (FACTORY_CELL_COUNT_Y - 2) * CELL_HEIGHT - margin * 2);
    ctx.fillRect(FACTORY_CELL_COUNT_X / 2 * CELL_WIDTH - 8, FACTORY_CELL_COUNT_Y / 2 * CELL_HEIGHT + 8, 16, 16);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function drawCellFactoryPort(ctx, id, metadata, x, y)
{
    drawCellRoad(ctx, id, metadata);
    let dx = x - metadata.parentX;
    let dy = y - metadata.parentY;
    ctx.fillStyle = 'gray';
    ctx.fillRect(HALF_CELL_WIDTH - HALF_HOUSING_WIDTH - dx * HOUSING_WIDTH, HALF_CELL_HEIGHT - HALF_HOUSING_HEIGHT - dy * HOUSING_HEIGHT, HOUSING_WIDTH, HOUSING_HEIGHT);
} 

/** ===================== TESTING ===================== */

function test()
{
    testCardinal();
    testInterCardinal();
    testPutRoad();
}

function testInterCardinal()
{
    let metadata = getDirectionMetadataFromBits(0, 1, 0, 1, 0, 1, 0, 1);
    let dirs = getDirectionBitsFromMetadata(metadata);
    assert(dirs[0] === 0
        && dirs[1] === 1
        && dirs[2] === 0
        && dirs[3] === 1
        && dirs[4] === 0
        && dirs[5] === 1
        && dirs[6] === 0
        && dirs[7] === 1);
}

function testCardinal()
{
    let metadata = getDirectionMetadataFromBits(1, 0, 1, 0, 1, 0, 1, 0);
    let dirs = getDirectionBitsFromMetadata(metadata);
    assert(dirs[0] === 1
        && dirs[1] === 0
        && dirs[2] === 1
        && dirs[3] === 0
        && dirs[4] === 1
        && dirs[5] === 0
        && dirs[6] === 1
        && dirs[7] === 0);
}

function testPutRoad()
{
    let worldMap, i, j;
    
    worldMap = createWorldMap();
    putRoad(worldMap, 0, 0, 1, 1);
    i = 0;
    j = 1 + worldMap.width;
    assert(worldMap.cells[i] === ROAD_ID);
    assert(worldMap.metas[i].direction === DIRECTION_METADATA.SOUTHEAST);
    assert(worldMap.cells[j] === ROAD_ID);
    assert(worldMap.metas[j].direction === DIRECTION_METADATA.NORTHWEST);

    worldMap = createWorldMap();
    putRoad(worldMap, 1, 1, 0, 0);
    i = 0;
    j = 1 + worldMap.width;
    assert(worldMap.cells[i] === ROAD_ID);
    assert(worldMap.metas[i].direction === DIRECTION_METADATA.SOUTHEAST);
    assert(worldMap.cells[j] === ROAD_ID);
    assert(worldMap.metas[j].direction === DIRECTION_METADATA.NORTHWEST);
}

/** @param {boolean} condition */
function assert(condition)
{
    if (!condition)
    {
        window.alert('Assertion failed!');
        throw new Error('Assertion failed!');
    }
}

test();