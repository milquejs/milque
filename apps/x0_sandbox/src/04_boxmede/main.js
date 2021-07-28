import { bresenhamLine } from '@milque/util';

const CELL_WIDTH = 64;
const CELL_HEIGHT = 64;
const HALF_CELL_WIDTH = CELL_WIDTH / 2;
const HALF_CELL_HEIGHT = CELL_HEIGHT / 2;

const EMPTY_ID = 0;
const ROAD_ID = 1;

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

    game.on('frame', () => {
        updateCursor(display, input, cursor, worldMap);
        
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        drawWorldMap(ctx, worldMap);
        drawCursor(ctx, cursor, worldMap);
    });
}

function createCursor()
{
    return {
        x: 0,
        y: 0,
        cellX: 0,
        cellY: 0,
        activating: false,
        dragCellX: 0,
        dragCellY: 0,
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
        if (cursor.activating)
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
            cursor.activating = true;
            cursor.dragCellX = cursor.cellX;
            cursor.dragCellY = cursor.cellY;
        }
    }
    else
    {
        cursor.activating = false;
        if (b)
        {
            eraseRoad(worldMap, cursor.cellX, cursor.cellY);
        }
    }
}

function drawCursor(ctx, cursor, worldMap)
{
    ctx.fillStyle = 'white';
    ctx.fillRect(Math.trunc(cursor.x) - 2, Math.trunc(cursor.y) - 2, 4, 4);

    const { offsetX, offsetY } = worldMap;
    ctx.translate(offsetX, offsetY);
    if (cursor.activating)
    {
        ctx.fillStyle = 'green';
    }
    else
    {
        ctx.fillStyle = 'white';
    }
    ctx.fillRect(cursor.cellX * CELL_WIDTH, cursor.cellY * CELL_HEIGHT, 8, 8);
    ctx.translate(-offsetX, -offsetY);
}

function putRoad(worldMap, prevX, prevY, nextX, nextY)
{
    if (prevX === nextX && prevY === nextY) return;
    let dx = prevX - nextX;
    let dy = prevY - nextY;
    if (prevX >= 0 && prevY >= 0 && prevX < worldMap.width && prevY < worldMap.height)
    {
        let metadata = getDirectionMetadataFromDelta(-dx, -dy);
        let i = prevX + prevY * worldMap.width;
        worldMap.cells[i] = ROAD_ID;
        worldMap.metas[i] |= metadata;
    }
    if (nextX >= 0 && nextY >= 0 && nextX < worldMap.width && nextY < worldMap.height)
    {
        let metadata = getDirectionMetadataFromDelta(dx, dy);
        let j = nextX + nextY * worldMap.width;
        worldMap.cells[j] = ROAD_ID;
        worldMap.metas[j] |= metadata;
    }
}

function eraseRoad(worldMap, x, y)
{
    let i = x + y * worldMap.width;
    if (worldMap.cells[i] === ROAD_ID)
    {
        worldMap.cells[i] = EMPTY_ID;
        worldMap.metas[i] = 0;
        for(let di = -1; di <= 1; ++di)
        {
            for(let dj = -1; dj <=1; ++dj)
            {
                let xx = x + di;
                let yy = y + dj;
                let dx = x - xx;
                let dy = y - yy;
                i = xx + yy * worldMap.width;
                if (worldMap.cells[i] === ROAD_ID)
                {
                    worldMap.metas[i] &= ~getDirectionMetadataFromDelta(dx, dy);
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
        cells: new Array(MAP_LENGTH),
        metas: new Array(MAP_LENGTH),
    };
}

function drawWorldMap(ctx, worldMap)
{
    const MAP_WIDTH = worldMap.width;
    const MAP_HEIGHT = worldMap.height;
    const { offsetX, offsetY } = worldMap;
    ctx.translate(offsetX, offsetY);
    for(let y = 0; y < MAP_HEIGHT; ++y)
    {
        for(let x = 0; x < MAP_WIDTH; ++x)
        {
            let xx = x * CELL_WIDTH;
            let yy = y * CELL_HEIGHT;
            ctx.strokeStyle = '#333';
            ctx.strokeRect(xx, yy, CELL_WIDTH, CELL_HEIGHT);

            let i = x + y * worldMap.width;
            let id = worldMap.cells[i];
            let metadata = worldMap.metas[i];
            switch(id)
            {
                case ROAD_ID:
                    ctx.translate(xx, yy);
                    {
                        drawCellRoad(ctx, id, metadata);
                    }
                    ctx.translate(-xx, -yy);
                    break;
                case EMPTY_ID:
                    // Do nothing.
                    break;
            }
        }
    }
    ctx.translate(-offsetX, -offsetY);
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 */
function drawCellRoad(ctx, id, metadata)
{
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    let [ ee, ne, nn, nw, ww, sw, ss, se ] = getDirectionBitsFromMetadata(metadata);
    if (ee)
    {
        ctx.moveTo(HALF_CELL_WIDTH, HALF_CELL_HEIGHT);
        ctx.lineTo(CELL_WIDTH, HALF_CELL_HEIGHT);
    }
    if (ne)
    {
        ctx.moveTo(HALF_CELL_WIDTH, HALF_CELL_HEIGHT);
        ctx.lineTo(CELL_WIDTH, 0);
    }
    if (nn)
    {
        ctx.moveTo(HALF_CELL_WIDTH, HALF_CELL_HEIGHT);
        ctx.lineTo(HALF_CELL_WIDTH, 0);
    }
    if (nw)
    {
        ctx.moveTo(HALF_CELL_WIDTH, HALF_CELL_HEIGHT);
        ctx.lineTo(0, 0);
    }
    if (ww)
    {
        ctx.moveTo(HALF_CELL_WIDTH, HALF_CELL_HEIGHT);
        ctx.lineTo(0, HALF_CELL_HEIGHT);
    }
    if (sw)
    {
        ctx.moveTo(HALF_CELL_WIDTH, HALF_CELL_HEIGHT);
        ctx.lineTo(0, CELL_HEIGHT);
    }
    if (ss)
    {
        ctx.moveTo(HALF_CELL_WIDTH, HALF_CELL_HEIGHT);
        ctx.lineTo(HALF_CELL_WIDTH, CELL_HEIGHT);
    }
    if (se)
    {
        ctx.moveTo(HALF_CELL_WIDTH, HALF_CELL_HEIGHT);
        ctx.lineTo(CELL_WIDTH, CELL_HEIGHT);
    }
    ctx.stroke();
}

function getDirectionBitsFromMetadata(metadata)
{
    return [
        (metadata >> 0) & 0x1,
        (metadata >> 1) & 0x1,
        (metadata >> 2) & 0x1,
        (metadata >> 3) & 0x1,
        (metadata >> 4) & 0x1,
        (metadata >> 5) & 0x1,
        (metadata >> 6) & 0x1,
        (metadata >> 7) & 0x1,
    ];
}

function getDirectionMetadataFromBits(ee, ne, nn, nw, ww, sw, ss, se)
{
    return ee << 0
        | ne << 1
        | nn << 2
        | nw << 3
        | ww << 4
        | sw << 5
        | ss << 6
        | se << 7;
}

function getDirectionMetadataFromDelta(dx, dy)
{
    if (dx === 0 && dy === 0) return 0;
    let px = dx > 0;
    let py = dy > 0;
    let nx = dx < 0;
    let ny = dy < 0;
    let zx = !px && !nx;
    let zy = !py && !ny;
    return (px && zy ? 1 : 0) << 0 // East
        | (px && ny ? 1 : 0) << 1 // North East
        | (zx && ny ? 1 : 0) << 2 // North
        | (nx && ny ? 1 : 0) << 3 // North West
        | (nx && zy ? 1 : 0) << 4 // West
        | (nx && py ? 1 : 0) << 5 // Sout West
        | (zx && py ? 1 : 0) << 6 // South
        | (px && py ? 1 : 0) << 7; // South East
}

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

const DIRECTION_METADATA = {
    EAST: 1 << 0,
    NORTHEAST: 1 << 1,
    NORTH: 1 << 2,
    NORTHWEST: 1 << 3,
    WEST: 1 << 4,
    SOUTHWEST: 1 << 5,
    SOUTH: 1 << 6,
    SOUTHEAST: 1 << 7,
};

function testPutRoad()
{
    let worldMap, i, j;
    
    worldMap = createWorldMap();
    putRoad(worldMap, 0, 0, 1, 1);
    i = 0;
    j = 1 + worldMap.width;
    assert(worldMap.cells[i] === ROAD_ID);
    assert(worldMap.metas[i] === DIRECTION_METADATA.SOUTHEAST);
    assert(worldMap.cells[j] === ROAD_ID);
    assert(worldMap.metas[j] === DIRECTION_METADATA.NORTHWEST);

    worldMap = createWorldMap();
    putRoad(worldMap, 1, 1, 0, 0);
    i = 0;
    j = 1 + worldMap.width;
    assert(worldMap.cells[i] === ROAD_ID);
    assert(worldMap.metas[i] === DIRECTION_METADATA.SOUTHEAST);
    assert(worldMap.cells[j] === ROAD_ID);
    assert(worldMap.metas[j] === DIRECTION_METADATA.NORTHWEST);
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