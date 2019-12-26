import * as GameLoop from './util/GameLoop.js';
import * as Display from './util/Display.js';
import * as Util from './lib.js';
import * as Viewport from './util/Viewport.js';

import * as Chunk from './Chunk.js';

const MAX_HEALTH = 3;
const HEALTH_X = 0;
const HEALTH_Y = 0;

let MOUSE_X = 0;
let MOUSE_Y = 0;

let MOUSE_LEFT_STATE = false;
let MOUSE_LEFT_STATE_NEXT = false;

let MOUSE_LEFT_DOWN = false;
let MOUSE_LEFT_DOWN_NEXT = false;

let MOUSE_LEFT_UP = false;
let MOUSE_LEFT_UP_NEXT = false;

let MOUSE_RIGHT_DOWN = false;
let MOUSE_RIGHT_DOWN_NEXT = false;

let MOUSE_RIGHT_UP = false;
let MOUSE_RIGHT_UP_NEXT = false;

let MOUSE_RIGHT_STATE = false;
let MOUSE_RIGHT_STATE_NEXT = false;

document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);
document.addEventListener('contextmenu', onContextMenu);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

let MAIN_VIEW = Viewport.createView(320);

let game = {
    start()
    {
        this.chunk = Chunk.createChunk();

        this.health = MAX_HEALTH;
        this.gameOver = false;
        this.gameWin = false;
        this.gameTime = 0;
    },
    poll()
    {
        MOUSE_LEFT_DOWN = MOUSE_LEFT_DOWN_NEXT;
        MOUSE_LEFT_DOWN_NEXT = false;

        MOUSE_LEFT_UP = MOUSE_LEFT_UP_NEXT;
        MOUSE_LEFT_UP_NEXT = false;

        MOUSE_LEFT_STATE_NEXT = MOUSE_LEFT_DOWN ? true : MOUSE_LEFT_UP ? false : MOUSE_LEFT_STATE;
        MOUSE_LEFT_STATE = MOUSE_LEFT_STATE_NEXT;

        MOUSE_RIGHT_DOWN = MOUSE_RIGHT_DOWN_NEXT;
        MOUSE_RIGHT_DOWN_NEXT = false;

        MOUSE_RIGHT_UP = MOUSE_RIGHT_UP_NEXT;
        MOUSE_RIGHT_UP_NEXT = false;

        MOUSE_RIGHT_STATE_NEXT = MOUSE_RIGHT_DOWN ? true : MOUSE_RIGHT_UP ? false : MOUSE_RIGHT_STATE;
        MOUSE_RIGHT_STATE = MOUSE_RIGHT_STATE_NEXT;
    },
    update(dt)
    {
        this.poll();
        this.render(MAIN_VIEW);

        // Do stuff...
        if (this.gameOver || this.gameWin)
        {
            // Do nothing...
            if (MOUSE_LEFT_DOWN || MOUSE_RIGHT_DOWN)
            {
                restart(this);
            }
        }
        else
        {
            this.gameTime += dt;

            if (MOUSE_LEFT_DOWN)
            {
                let mouseTileX = Util.clampRange(Math.floor((MOUSE_X - Chunk.CHUNK_OFFSET_X) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_WIDTH - 1);
                let mouseTileY = Util.clampRange(Math.floor((MOUSE_Y - Chunk.CHUNK_OFFSET_Y) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_HEIGHT - 1);
                let result = Chunk.digTiles(this.chunk, mouseTileX, mouseTileY);

                if (!result)
                {
                    dealDamage(this, 1);
                }

                if (checkWinCondition(this.chunk))
                {
                    gameWin(this);
                }
            }

            if (MOUSE_RIGHT_DOWN)
            {
                let mouseTileX = Util.clampRange(Math.floor((MOUSE_X - Chunk.CHUNK_OFFSET_X) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_WIDTH - 1);
                let mouseTileY = Util.clampRange(Math.floor((MOUSE_Y - Chunk.CHUNK_OFFSET_Y) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_HEIGHT - 1);
                Chunk.markTile(this.chunk, mouseTileX, mouseTileY);
            }
        }
    },
    render(view)
    {
        let ctx = view.context;
        Util.clearScreen(ctx, view.width, view.height);

        Chunk.renderChunk(view, this.chunk);

        let mouseTileX = Util.clampRange(Math.floor((MOUSE_X - Chunk.CHUNK_OFFSET_X) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_WIDTH - 1);
        let mouseTileY = Util.clampRange(Math.floor((MOUSE_Y - Chunk.CHUNK_OFFSET_Y) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_HEIGHT - 1);
        
        Util.drawBox(ctx,
            Chunk.CHUNK_OFFSET_X + Chunk.TILE_OFFSET_X + mouseTileX * Chunk.TILE_SIZE,
            Chunk.CHUNK_OFFSET_Y + Chunk.TILE_OFFSET_Y + mouseTileY * Chunk.TILE_SIZE,
            0, Chunk.TILE_SIZE - 1, Chunk.TILE_SIZE - 1, 'rgba(0, 0, 0, 0.2)');
        
        // Draw shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, view.width, Chunk.CHUNK_OFFSET_Y);
        ctx.fillRect(0, view.height - Chunk.CHUNK_OFFSET_Y, view.width, Chunk.CHUNK_OFFSET_Y);
        ctx.fillRect(0, Chunk.CHUNK_OFFSET_Y, Chunk.CHUNK_OFFSET_X, view.height - Chunk.CHUNK_OFFSET_Y * 2);
        ctx.fillRect(view.width - Chunk.CHUNK_OFFSET_X, Chunk.CHUNK_OFFSET_Y, Chunk.CHUNK_OFFSET_X, view.height - Chunk.CHUNK_OFFSET_Y * 2);
        
        // Draw health
        for(let i = 0; i < MAX_HEALTH; ++i)
        {
            let color = i < this.health ? 'salmon' : 'darkgray';
            Util.drawBox(ctx,
                HEALTH_X + Chunk.TILE_SIZE / 2 + i * Chunk.TILE_SIZE,
                HEALTH_Y + Chunk.TILE_SIZE / 2,
                0,
                Chunk.TILE_SIZE - 3,
                Chunk.TILE_SIZE - 3,
                color);
        }

        if (this.gameOver)
        {
            Util.drawBox(ctx, view.width / 2, view.height / 2, 0, view.width * 0.7, 8, 'black');
            Util.drawText(ctx, 'Game Over', view.width / 2 + 1, view.height / 2 + 1, 0, 32, 'black');
            Util.drawText(ctx, 'Game Over', view.width / 2 - 1, view.height / 2 - 1, 0, 32, 'white');
            
            Util.drawText(ctx, 'Click to continue', view.width / 2 + 1, view.height / 2 + 24 + 1, 0, 16, 'black');
            Util.drawText(ctx, 'Click to continue', view.width / 2 - 1, view.height / 2 + 24 - 1, 0, 16, 'white');
        }
        else if (this.gameWin)
        {
            Util.drawBox(ctx, view.width / 2, view.height / 2, 0, view.width * 0.7, 8, 'black');
            Util.drawText(ctx, 'Success!', view.width / 2 + 1, view.height / 2 + 1, 0, 32, 'black');
            Util.drawText(ctx, 'Success!', view.width / 2 - 1, view.height / 2 - 1, 0, 32, 'gold');
            
            Util.drawText(ctx, 'Click to continue', view.width / 2 + 1, view.height / 2 + 24 + 1, 0, 16, 'black');
            Util.drawText(ctx, 'Click to continue', view.width / 2 - 1, view.height / 2 + 24 - 1, 0, 16, 'white');
        }

        Util.drawText(ctx, `Time: ${Math.floor(this.gameTime / 1000)}`, view.width / 2, view.height - Chunk.TILE_SIZE, 0, 16, 'white');

        Display.drawBufferToScreen(view.context);
    }
}

function onMouseDown(e)
{
    e.preventDefault();
    e.stopPropagation();
    if (e.button == 0)
    {
        MOUSE_LEFT_DOWN_NEXT = true;
    }
    else
    {
        MOUSE_RIGHT_DOWN_NEXT = true;
    }
}

function onMouseUp(e)
{
    e.preventDefault();
    e.stopPropagation();
    if (e.button == 0)
    {
        MOUSE_LEFT_UP_NEXT = true;
    }
    else
    {
        MOUSE_RIGHT_UP_NEXT = true;
    }
}

function onMouseMove(e)
{
    const widthRatio = MAIN_VIEW.width / Display.getClientWidth();
    const heightRatio = MAIN_VIEW.height / Display.getClientHeight();

    MOUSE_X = (e.pageX - Display.getClientOffsetX()) * widthRatio;
    MOUSE_Y = (e.pageY - Display.getClientOffsetY()) * heightRatio;
}

function onContextMenu(e)
{
    e.preventDefault();
    e.stopPropagation();
}

function onKeyDown(e)
{
    e.preventDefault();
    e.stopPropagation();

    if (e.key === ' ') MOUSE_RIGHT_DOWN_NEXT = true;
}

function onKeyUp(e)
{
    e.preventDefault();
    e.stopPropagation();

    if (e.key === ' ') MOUSE_RIGHT_UP_NEXT = true;
    if (e.key === 'r') restart(game);
}

function dealDamage(scene, damage)
{
    scene.health -= damage;
    if (scene.health <= 0)
    {
        gameOver(scene);
    }
}

function gameOver(scene)
{
    scene.gameOver = true;
}

function restart(scene)
{
    Chunk.setupMap(scene.chunk);
    scene.gameOver = false;
    scene.gameWin = false;
    scene.gameTime = 0;
    scene.health = MAX_HEALTH;
}

function gameWin(scene)
{
    scene.gameWin = true;
}

function checkWinCondition(chunk)
{
    for(let i = 0; i < chunk.tiles.length; ++i)
    {
        if (chunk.solids[i] > 0 && chunk.tiles[i] <= 0)
        {
            return false;
        }
    }
    
    return true;
}

GameLoop.start(game);