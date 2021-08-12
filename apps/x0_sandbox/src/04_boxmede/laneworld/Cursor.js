import { bresenhamLine } from '@milque/util';
import { CELL_SIZE, getJunctionCoordsFromCell, putTwoWayRoad } from './CellWorld.js';
import { removeJunction, getJunctionByIndex, getJunctionIndexFromCoords } from './Junction.js';

export const CURSOR_STATUS = {
    NONE: 0,
    ACTIVATING: 1,
    DEACTIVATING: 2,
};

export class Cursor
{
    constructor()
    {
        this.screenX = 0;
        this.screenY = 0;
        this.cellX = 0;
        this.cellY = 0;
        this.dragCellX = 0;
        this.dragCellY = 0;

        this.status = CURSOR_STATUS.NONE;
    }
}

export const CURSOR_ROAD_DRAG_MARGIN = 1.2;

export function drawCursor(game, ctx, cursor)
{
    let screenX = game.inputs.getAxisValue('cursorX') * game.display.width;
    let screenY = game.inputs.getAxisValue('cursorY') * game.display.height;
    cursor.screenX = screenX;
    cursor.screenY = screenY;
    let screenCellX = screenX / CELL_SIZE;
    let screenCellY = screenY / CELL_SIZE;
    cursor.cellX = Math.floor(screenCellX);
    cursor.cellY = Math.floor(screenCellY);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(cursor.cellX * CELL_SIZE, cursor.cellY * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

/**
 * @param {DisplayPort} display 
 * @param {InputContext} input 
 * @param {Cursor} cursor 
 * @param {World} worldMap 
 */
export function updateCursor(display, input, cursor, cellWorld)
{
    const laneWorld = cellWorld.laneWorld;
    const worldMapWidth = laneWorld.width * 2;
    const worldMapHeight = laneWorld.height * 2;
    let cx = input.getAxisValue('cursorX') * display.canvas.width;
    let cy = input.getAxisValue('cursorY') * display.canvas.height;
    cursor.screenX = cx;
    cursor.screenY = cy;
    let txf = cx / CELL_SIZE;
    let tx = Math.trunc(txf);
    let tyf = cy / CELL_SIZE;
    let ty = Math.trunc(tyf);
    cursor.cellX = Math.max(0, Math.min(tx, worldMapWidth - 1));
    cursor.cellY = Math.max(0, Math.min(ty, worldMapHeight - 1));
    
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
            if (dist > CURSOR_ROAD_DRAG_MARGIN)
            {
                prevCellX = cursor.dragCellX;
                prevCellY = cursor.dragCellY;
                nextCellX = cursor.cellX;
                nextCellY = cursor.cellY;
                bresenhamLine(prevCellX, prevCellY, nextCellX, nextCellY, (x, y) => {
                    putTwoWayRoad(cellWorld, prevCellX, prevCellY, x, y);
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
            if (x !== cursor.dragCellX || y !== cursor.dragCellY)
            {
                let [juncX, juncY] = getJunctionCoordsFromCell(cellWorld, x, y);
                let juncIndex = getJunctionIndexFromCoords(laneWorld, juncX, juncY);
                let junc = getJunctionByIndex(laneWorld, juncIndex);
                if (junc)
                {
                    removeJunction(laneWorld, juncIndex);
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
 