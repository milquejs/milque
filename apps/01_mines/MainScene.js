import { MathHelper } from './lib.js';

import { Mines } from './Mines.js';
import * as MinesControls from './MinesControls.js';

export const MAX_HEALTH = 3;

export const CHUNK_OFFSET_X = 32;
export const CHUNK_OFFSET_Y = 32;
export const CHUNK_TILE_SIZE = 16;

export function onStart()
{
    this.mines = new Mines(16, 16);

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
    if (MinesControls.Restart.value)
    {
        restart(this);
        return;
    }

    // Do stuff...
    if (this.gameOver || this.gameWin)
    {
        // Do nothing...
        if (MinesControls.Activate.value || MinesControls.Mark.value)
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
        if (MinesControls.Activate.value)
        {
            let mouseX = MinesControls.CursorX.value * worldWidth;
            let mouseY = MinesControls.CursorY.value * worldHeight;
            let mouseTileX = MathHelper.clamp(Math.floor((mouseX - CHUNK_OFFSET_X) / CHUNK_TILE_SIZE), 0, this.mines.width - 1);
            let mouseTileY = MathHelper.clamp(Math.floor((mouseY - CHUNK_OFFSET_Y) / CHUNK_TILE_SIZE), 0, this.mines.height - 1);
            let result = this.mines.dig(mouseTileX, mouseTileY);

            if (!result)
            {
                dealDamage(this, 1);
            }

            if (this.mines.checkWinCondition())
            {
                gameWin(this);
            }

            flag = true;
        }

        if (MinesControls.Mark.value)
        {
            let mouseX = MinesControls.CursorX.value * worldWidth;
            let mouseY = MinesControls.CursorY.value * worldHeight;
            let mouseTileX = MathHelper.clamp(Math.floor((mouseX - CHUNK_OFFSET_X) / CHUNK_TILE_SIZE), 0, this.mines.width - 1);
            let mouseTileY = MathHelper.clamp(Math.floor((mouseY - CHUNK_OFFSET_Y) / CHUNK_TILE_SIZE), 0, this.mines.height - 1);
            this.mines.mark(mouseTileX, mouseTileY);

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
    scene.mines.reset();
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
