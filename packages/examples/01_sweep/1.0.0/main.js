import * as GameLoop from './util/GameLoop.js';
import * as Display from './util/Display.js';
import * as Util from './lib.js';
import * as Viewport from './util/Viewport.js';

import * as Chunk from './Chunk.js';
import * as Input from './Input.js';

const MAX_HEALTH = 3;
const HEALTH_X = 0;
const HEALTH_Y = 0;

const MAIN_DISPLAY = document.querySelector('#main');

const MAIN_CONTEXT = Input.createContext();
let ACTIVE_ACTION = MAIN_CONTEXT.registerAction('active', 'mouse[0].down');
let MARK_ACTION = MAIN_CONTEXT.registerAction('mark', 'mouse[2].down');
let RESTART_ACTION = MAIN_CONTEXT.registerAction('restart', 'key[r].up');
let MOUSE_X = MAIN_CONTEXT.registerRange('mousex', 'mouse[pos].x');
let MOUSE_Y = MAIN_CONTEXT.registerRange('mousey', 'mouse[pos].y');
let MOUSE_LEFT = MAIN_CONTEXT.registerState('mouseleft', {
    'mouse[0].up': 0,
    'mouse[0].down': 1
});
let MOUSE_RIGHT = MAIN_CONTEXT.registerState('mouseright', {
    'mouse[2].up': 0,
    'mouse[2].down': 1
});

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
    update(dt)
    {
        Input.poll();
        this.render(MAIN_VIEW);

        // Check if restarting...
        if (RESTART_ACTION.value)
        {
            restart(this);
            return;
        }

        // Do stuff...
        if (this.gameOver || this.gameWin)
        {
            // Do nothing...
            if (ACTIVE_ACTION.value || MARK_ACTION.value)
            {
                restart(this);
                return;
            }
        }
        else
        {
            this.gameTime += dt;

            if (ACTIVE_ACTION.value)
            {
                let mouseX = MOUSE_X.value * MAIN_VIEW.width;
                let mouseY = MOUSE_Y.value * MAIN_VIEW.height;
                let mouseTileX = Util.clampRange(Math.floor((mouseX - Chunk.CHUNK_OFFSET_X) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_WIDTH - 1);
                let mouseTileY = Util.clampRange(Math.floor((mouseY - Chunk.CHUNK_OFFSET_Y) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_HEIGHT - 1);
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

            if (MARK_ACTION.value)
            {
                let mouseX = MOUSE_X.value * MAIN_VIEW.width;
                let mouseY = MOUSE_Y.value * MAIN_VIEW.height;
                let mouseTileX = Util.clampRange(Math.floor((mouseX - Chunk.CHUNK_OFFSET_X) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_WIDTH - 1);
                let mouseTileY = Util.clampRange(Math.floor((mouseY - Chunk.CHUNK_OFFSET_Y) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_HEIGHT - 1);
                Chunk.markTile(this.chunk, mouseTileX, mouseTileY);
            }
        }
    },
    render(view)
    {
        let ctx = view.context;
        Util.clearScreen(ctx, view.width, view.height);

        Chunk.renderChunk(view, this.chunk);

        let mouseX = MOUSE_X.value * view.width;
        let mouseY = MOUSE_Y.value * view.height;
        let mouseTileX = Util.clampRange(Math.floor((mouseX - Chunk.CHUNK_OFFSET_X) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_WIDTH - 1);
        let mouseTileY = Util.clampRange(Math.floor((mouseY - Chunk.CHUNK_OFFSET_Y) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_HEIGHT - 1);
        
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
