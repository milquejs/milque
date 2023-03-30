import { Random } from '@milque/random';
import { INPUTS } from '../../cosmos/inputs.js';
import { ComponentClass, ComponentQuery, EntityTemplate } from '../../core/EntityManager.js';
import { getTile, setTile } from '../../core/ChunkMap.js';
import { addListener } from '../../core/Listenable.js';
import { ALL } from '../Tetrominoes.js';
import { TILE_RADIUS, TILE_SIZE } from './ChunkSystem.js';
import { getBlockById } from '../Block.js';
import * as Blocks from '../Blocks.js';

export const CursorData = new ComponentClass('Cursor', () => ({
    x: 0,
    y: 0,
    side: 0,
    shapeIndex: 0,
    rotationIndex: 0,
    gravityX: 0,
    gravityY: 0,
    blockIndex: 1,
    cachedShapeIndex: 0,
    cachedBlockIndex: 1,
}));
export const CursorQuery = new ComponentQuery(CursorData);
export const CursorTemplate = new EntityTemplate([CursorData]);

export function CursorSystem(m) {
    let timer = 0;

    addListener(m, 'init', () => {
        CursorTemplate.instantiate(m);

        let cursor = CursorQuery.find(m);
        let map = m.chunks;
        resetCursor(m, map, cursor);
        resetCursorShapeRandomly(m, cursor);
    });

    addListener(m, 'update', (dt) => {
        let cursor = CursorQuery.find(m);
        let map = m.chunks;
        let dx = 0;
        let dy = 0;
        if (INPUTS.MoveLeft.pressed) {
            dx = -1;
        } else if (INPUTS.MoveRight.pressed) {
            dx = 1;
        } else if (INPUTS.MoveUp.pressed) {
            dy = -1;
        } else if (INPUTS.MoveDown.pressed) {
            dy = 1;
        } else if (INPUTS.AltAction.pressed) {
            if (cursor.cachedBlockIndex !== 0) {
                // Swap it!
                let nextBlockIndex = cursor.cachedBlockIndex;
                let nextShapeIndex = cursor.cachedShapeIndex;
                cursor.cachedBlockIndex = cursor.blockIndex;
                cursor.cachedShapeIndex = cursor.shapeIndex;
                resetCursorSide(m, cursor, cursor.side);
                resetCursorShape(m, cursor, nextShapeIndex, 0, nextBlockIndex);
            } else {
                // Store it!
                cursor.cachedBlockIndex = cursor.blockIndex;
                cursor.cachedShapeIndex = cursor.shapeIndex;
                resetCursorSide(m, cursor, cursor.side);
                resetCursorShapeRandomly(m, cursor);
            }
        }
        // Opposite direction of gravity
        let rotate = Math.sign(dx) === -Math.sign(cursor.gravityX) && Math.sign(dy) === -Math.sign(cursor.gravityY);

        if (rotate) {
            let prev = cursor.rotationIndex;
            dx = 0;
            dy = 0;
            cursor.rotationIndex += 1;
            if (!checkCursor(map, cursor)) {
                cursor.rotationIndex = prev;
                timer = 300;
            } else {
                timer -= 100;
            }
        }
        if (dx != 0 || dy != 0) {
            timer = 0;
        }

        let slideTime = 300;
        if (cursor.gravityX > 0 && INPUTS.MoveRight.current.down) {
            if (timer < slideTime) {
                dx = 1;
                timer = slideTime;
            }
        } else if (cursor.gravityX < 0 && INPUTS.MoveLeft.current.down) {
            if (timer < slideTime) {
                dx = -1;
                timer = slideTime;
            }
        } else if (cursor.gravityY > 0 && INPUTS.MoveDown.current.down) {
            if (timer < slideTime) {
                dy = 1;
                timer = slideTime;
            }
        } else if (cursor.gravityY < 0 && INPUTS.MoveUp.current.down) {
            if (timer < slideTime) {
                dy = -1;
                timer = slideTime;
            }
        }

        // Gravity
        timer += dt;
        if (timer >= 400) {
            dx = cursor.gravityX;
            dy = cursor.gravityY;
            timer = 0;
        }

        let result = tryMoveCursor(m, map, cursor, dx, dy);
        if (!result) {
            if (Math.sign(dx) === Math.sign(cursor.gravityX) && Math.sign(dy) === Math.sign(cursor.gravityY)) {
                placeCursor(m, map, cursor);
                resetCursor(m, map, cursor);
                resetCursorShapeRandomly(m, cursor);
            }
        } else {
            let MAX_DIST = 20;
            if (cursor.x < -MAX_DIST) {
                cursor.x = MAX_DIST;
            } else if (cursor.x > MAX_DIST) {
                cursor.x = -MAX_DIST;
            }
            if (cursor.y > MAX_DIST) {
                cursor.y = -MAX_DIST;
            } else if (cursor.y < -MAX_DIST) {
                cursor.y = MAX_DIST;
            }
        }
    });

    addListener(m, 'render', (ctx) => {
        let cursor = CursorQuery.find(m);
        drawCursor(ctx, cursor);
    });
}

function resetCursor(m, map, cursor) {
    let side = Random.next() < 0.3
        ? Random.rangeInt(0, 4)
        : cursor.side;
    resetCursorSide(m, cursor, side);
}

function resetCursorSide(m, cursor, side) {
    cursor.side = side;
    switch (side) {
        case 0:
            cursor.x = -20;
            cursor.gravityX = 1;
            cursor.gravityY = 0;
            break;
        case 1:
            cursor.x = 20;
            cursor.gravityX = -1;
            cursor.gravityY = 0;
            break;
        case 2:
            cursor.y = -20;
            cursor.gravityX = 0;
            cursor.gravityY = 1;
            break;
        case 3:
            cursor.y = 20;
            cursor.gravityX = 0;
            cursor.gravityY = -1;
            break;
    }
}

function resetCursorShape(m, cursor, shape, rotation, blockId) {
    cursor.shapeIndex = shape;
    cursor.rotationIndex = rotation;
    cursor.blockIndex = blockId;
}

function resetCursorShapeRandomly(m, cursor) {
    let shapeIndex = Random.rangeInt(0, ALL.length);
    resetCursorShape(m, cursor,
        shapeIndex,
        Random.rangeInt(0, ALL[shapeIndex].length),
        Random.choose([
            Blocks.Gold,
            Blocks.Stone,
        ]).blockId);
}

function tryMoveCursor(m, map, cursor, dx, dy) {
    let prevX = cursor.x;
    let prevY = cursor.y;
    let nextX = cursor.x + dx;
    let nextY = cursor.y + dy;
    cursor.x = nextX;
    cursor.y = nextY;
    if (!checkCursor(map, cursor)) {
        cursor.x = prevX;
        cursor.y = prevY;
        return false;
    }
    cursor.x = nextX;
    cursor.y = nextY;
    return true;
}

function checkCursor(map, { x, y, shapeIndex, rotationIndex }) {
    let v = [0, 0];
    for (let [dx, dy] of cells(v, shapeIndex, rotationIndex)) {
        let tileId = getTile(map, x + dx, y + dy, 0);
        if (tileId) {
            return false;
        }
    }
    return true;
}

function placeCursor(m, map, cursor) {
    let v = [0, 0];
    for (let [dx, dy] of cells(v, cursor.shapeIndex, cursor.rotationIndex)) {
        let i = cursor.x + dx;
        let j = cursor.y + dy;
        m.boundary.left = Math.min(m.boundary.left, i);
        m.boundary.right = Math.max(m.boundary.right, i);
        m.boundary.top = Math.min(m.boundary.top, i);
        m.boundary.bottom = Math.max(m.boundary.bottom, i);
        setTile(map, i, j, 0, cursor.blockIndex);
    }
}

function drawCursor(ctx, cursor) {
    let v = [0, 0];
    let x = cursor.x;
    let y = cursor.y;
    let gx = cursor.gravityX;
    let gy = cursor.gravityY;
    let borderSize = 2;
    for (let [dx, dy] of cells(v, cursor.shapeIndex, cursor.rotationIndex)) {
        let block = getBlockById(cursor.blockIndex);
        block.renderer(ctx, x + dx, y + dy, block.blockId);
        if (gx < 0) {
            ctx.setColor(0xFF00FF);
            ctx.drawBox(
                (x + dx - 0.5) * TILE_SIZE,
                (y + dy) * TILE_SIZE,
                borderSize,
                TILE_RADIUS);
        } else if (gx > 0) {
            ctx.setColor(0xFF00FF);
            ctx.drawBox(
                (x + dx + 0.5) * TILE_SIZE,
                (y + dy) * TILE_SIZE,
                borderSize,
                TILE_RADIUS);
        } else if (gy < 0) {
            ctx.setColor(0xFF00FF);
            ctx.drawBox(
                (x + dx) * TILE_SIZE,
                (y + dy - 0.5) * TILE_SIZE,
                TILE_RADIUS,
                borderSize);
        } else if (gy > 0) {
            ctx.setColor(0xFF00FF);
            ctx.drawBox(
                (x + dx) * TILE_SIZE,
                (y + dy + 0.5) * TILE_SIZE,
                TILE_RADIUS,
                borderSize);
        }
    }
}

function* cells(out, shapeIndex, rotationIndex) {
    let shapes = ALL[shapeIndex % ALL.length];
    let shape = shapes[rotationIndex % shapes.length];
    for (let j = 0; j < shape.h; ++j) {
        for (let i = 0; i < shape.w; ++i) {
            if (!shape.m[i + j * shape.w]) {
                continue;
            }
            out[0] = i;
            out[1] = j;
            yield out;
        }
    }
}
