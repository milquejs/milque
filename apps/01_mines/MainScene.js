import * as MathHelper from '../../packages/lib/src/MathHelper.js';

import * as Chunk from './Chunk.js';
import * as PlayerControls from './PlayerControls.js';
import * as ChunkRenderer from './ChunkRenderer.js';

/*

What is good in Minesweeper?
- Inherant scaling difficulty as the game progresses (less tiles)
- Clean ruleset
    - Deductive reasoning and arithmetic (best forms of logic for play)
- Replay value (randomized maps)
- Pure form

deterministic, mostly.
High risk / High reward? (sadly, only high risk)

What is bad in minesweeper?
- Doesn't have a progression Curve.
- Don't have low risk options.
- DONT LIKE TIMED TASKS!!!
    - Hard ceiling
- CANNOT BE IMPOSSIBLE TO WIN

*/

export const MAX_HEALTH = 3;

export function onStart()
{
    this.chunk = Chunk.createChunk();

    this.firstAction = false;

    this.health = MAX_HEALTH;
    this.gameOver = false;
    this.gameWin = false;
    this.gameTime = 0;
}

export function onPreUpdate(dt)
{

}

export function onUpdate(dt)
{
    // Check if restarting...
    if (PlayerControls.RESTART.value)
    {
        restart(this);
        return;
    }

    // Do stuff...
    if (this.gameOver || this.gameWin)
    {
        // Do nothing...
        if (PlayerControls.ACTIVATE.value || PlayerControls.MARK.value)
        {
            restart(this);
            return;
        }
    }
    else
    {
        const worldWidth = this.display.width;
        const worldHeight = this.display.height;

        if (this.firstAction)
        {
            this.gameTime += dt;
        }

        let flag = false;
        if (PlayerControls.ACTIVATE.value)
        {
            let mouseX = PlayerControls.MOUSE_X.value * worldWidth;
            let mouseY = PlayerControls.MOUSE_Y.value * worldHeight;
            let mouseTileX = MathHelper.clamp(Math.floor((mouseX - ChunkRenderer.CHUNK_OFFSET_X) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_WIDTH - 1);
            let mouseTileY = MathHelper.clamp(Math.floor((mouseY - ChunkRenderer.CHUNK_OFFSET_Y) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_HEIGHT - 1);
            let result = Chunk.digTiles(this.chunk, mouseTileX, mouseTileY);

            if (!result)
            {
                dealDamage(this, 1);
            }

            if (checkWinCondition(this.chunk))
            {
                gameWin(this);
            }

            flag = true;
        }

        if (PlayerControls.MARK.value)
        {
            let mouseX = PlayerControls.MOUSE_X.value * worldWidth;
            let mouseY = PlayerControls.MOUSE_Y.value * worldHeight;
            let mouseTileX = MathHelper.clamp(Math.floor((mouseX - ChunkRenderer.CHUNK_OFFSET_X) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_WIDTH - 1);
            let mouseTileY = MathHelper.clamp(Math.floor((mouseY - ChunkRenderer.CHUNK_OFFSET_Y) / Chunk.TILE_SIZE), 0, Chunk.CHUNK_HEIGHT - 1);
            Chunk.markTile(this.chunk, mouseTileX, mouseTileY);

            flag = true;
        }

        if (flag && !this.firstAction)
        {
            this.firstAction = true;
        }
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

function restart(scene)
{
    Chunk.setupMap(scene.chunk);
    scene.gameOver = false;
    scene.gameWin = false;
    scene.gameTime = 0;
    scene.firstAction = false;
    scene.health = MAX_HEALTH;
}

function gameWin(scene)
{
    scene.gameWin = true;
}

function gameOver(scene)
{
    scene.gameOver = true;
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
