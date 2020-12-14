import { CanvasView2D } from 'milque';
import { INPUT_CONTEXT } from './input.js';

document.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('display-port');
    const input = INPUT_CONTEXT;

    const ctx = display.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const view = new CanvasView2D(display);
    const assets = new AssetManifest();
    await assets.load();

    const world = {};
    const game = {
        display,
        input,
        ctx,
        view,
        assets,
        world,
    };

    initialize(game);
}

function initialize(game)
{
}

function update(dt, world)
{
}

function render(ctx, world)
{
}
