import * as GameLoop from './util/GameLoop.js';
import * as Display from './util/Display.js';
import * as Util from './lib.js';
import * as Viewport from './util/Viewport.js';

import * as Chunk from './Chunk.js';

let MOUSE_X = 0;
let MOUSE_Y = 0;
let MOUSE_DOWN = false;
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);

let MAIN_VIEW = Viewport.createView(320);

let game = {
    start()
    {
        this.prevClick = false;
        this.click = false;
        this.chunk = Chunk.createChunk();
    },
    poll()
    {
        this.click = false;

        if (this.nextClick !== MOUSE_DOWN)
        {
            this.nextClick = MOUSE_DOWN;
            this.click = this.nextClick;
        }
    },
    update(dt)
    {
        this.poll();
        this.render(MAIN_VIEW);

        // Do stuff...
        if (this.click)
        {
            let mouseTileX = Util.clampRange(Math.floor(MOUSE_X / Chunk.TILE_SIZE), 0, Chunk.CHUNK_WIDTH - 1);
            let mouseTileY = Util.clampRange(Math.floor(MOUSE_Y / Chunk.TILE_SIZE), 0, Chunk.CHUNK_HEIGHT - 1);
            Chunk.digTiles(this.chunk, mouseTileX, mouseTileY);
        }
    },
    render(view)
    {
        let ctx = view.context;
        Util.clearScreen(ctx, view.width, view.height);

        Chunk.renderChunk(view, this.chunk);

        let mouseTileX = Util.clampRange(Math.floor(MOUSE_X / Chunk.TILE_SIZE), 0, Chunk.CHUNK_WIDTH - 1);
        let mouseTileY = Util.clampRange(Math.floor(MOUSE_Y / Chunk.TILE_SIZE), 0, Chunk.CHUNK_HEIGHT - 1);
        
        Util.drawBox(ctx,
            Chunk.TILE_OFFSET_X + mouseTileX * Chunk.TILE_SIZE,
            Chunk.TILE_OFFSET_Y + mouseTileY * Chunk.TILE_SIZE,
            0, Chunk.TILE_SIZE - 1, Chunk.TILE_SIZE - 1, 'rgba(0, 0, 0, 0.2)');
        
        Display.drawBufferToScreen(view.context);
    }
}

GameLoop.start(game);

function onMouseDown(e)
{
    MOUSE_DOWN = true;
}

function onMouseUp(e)
{
    MOUSE_DOWN = false;
}

function onMouseMove(e)
{
    const widthRatio = MAIN_VIEW.width / Display.getClientWidth();
    const heightRatio = MAIN_VIEW.height / Display.getClientHeight();

    MOUSE_X = (e.pageX - Display.getClientOffsetX()) * widthRatio;
    MOUSE_Y = (e.pageY - Display.getClientOffsetY()) * heightRatio;
}
