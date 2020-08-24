import { BoxRenderer, Camera2D, CanvasView } from './lib.js';

import { DISPLAY } from './display.js';
import { INPUT } from './input.js';

import * as Farmland from './Farmland.js';

document.addEventListener('DOMContentLoaded', main);

async function main()
{
    const ctx = DISPLAY.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const world = {
        assets: {},
    };

    await load(world);
    initialize(world);

    DISPLAY.addEventListener('frame', e => {
        const dt = (e.detail.deltaTime / 1000) * 60;
        
        ctx.clearRect(0, 0, DISPLAY.width, DISPLAY.height);

        update(dt, world);
        render(ctx, world);
    });
}

function initialize(world)
{

}

async function load(world)
{
    world.farmlands = [
        Farmland.create(),
        Farmland.create(),
    ];
}

function update(dt, world)
{
}

function render(ctx, world)
{
    Farmland.render(ctx, world.farmlands);
}
