import '@milque/display';
import '@milque/input';
import { InputSource } from '@milque/input';

window.addEventListener('DOMContentLoaded', main);

const DISPLAY_WIDTH = 320;
const DISPLAY_HEIGHT = 240;
const INPUT_MAP = {
    PointerX: 'Mouse:PosX',
    PointerY: 'Mouse:PosY',
    Interact: 'Mouse:Button0',
};

const ARENA_WIDTH = 16;
const ARENA_HEIGHT = 16;
const TILE_WIDTH = 16;
const TILE_HEIGHT = 16;

const HALF_PI = Math.PI / 2;
const FOURTH_PI = Math.PI / 4;
const TWO_PI = Math.PI * 2;

async function main()
{
    /** @type {import('@milque/display').DisplayPort} */
    const display = document.querySelector('#main');
    display.width = DISPLAY_WIDTH;
    display.height = DISPLAY_HEIGHT;

    /** @type {import('@milque/input').InputContextElement} */
    const input = document.querySelector('input-context');
    input.src = INPUT_MAP;
    input.source.autopoll = true;
    
    /*
    const other = InputSource.for(display);
    other.autopoll = true;

    setTimeout(() => {
        input.source.autopoll = false;
    }, 4000);
    */

    const ctx = display.canvas.getContext('2d');

    let world = {
        display,
        input,
        ctx,
        arena: new Array(ARENA_WIDTH * ARENA_HEIGHT),
        metadata: new Array(ARENA_WIDTH * ARENA_HEIGHT),
    };

    display.addEventListener('frame', e => {
        if (input.getInputChanged('PointerX'))
        {
            drawArena(world);
        }
    });
}

function drawArena(world)
{
    const { ctx } = world;
    for(let y = 0; y < ARENA_HEIGHT; ++y)
    {
        for(let x = 0; x < ARENA_WIDTH; ++x)
        {
            let xx = x * TILE_WIDTH;
            let yy = y * TILE_HEIGHT;
            let i = x + y * ARENA_WIDTH;
            ctx.translate(xx, yy);
            {
                drawTile(world, world.arena[i], x, y);
            }
            ctx.translate(-xx, -yy);
        }
    }
}

function drawTile(world, tile, x, y)
{
    const { ctx } = world;
    switch(tile)
    {
        default:
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
    }
}

function updateTile(world, tile, x, y)
{
}
