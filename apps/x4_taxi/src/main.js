import '@milque/display';
import * as Background from './Background.js';
import * as DialogueBox from './DialogueBox.js';

window.addEventListener('DOMContentLoaded', main);
window.addEventListener('error', error, true);
window.addEventListener('unhandledrejection', error, true);

function error(e)
{
    if (e instanceof PromiseRejectionEvent)
    {
        window.alert(e.reason.stack);
    }
    else if (e instanceof ErrorEvent)
    {
        window.alert(e.error.stack);
    }
    else
    {
        window.alert(JSON.stringify(e));
    }
}

async function main()
{
    /** @type {import('@milque/display').DisplayPort}  */
    const display = document.querySelector('#display');
    const ctx = display.canvas.getContext('2d');
    const world = {
        display,
        ctx,
        frames: 0,
    };

    Background.load(world);
    DialogueBox.load(world);

    display.addEventListener('frame', e => {
        const { deltaTime } = e.detail;
        const dt = deltaTime / 60;
        update(dt, world);
        render(ctx, world);
        world.frames += 1;
    });
}

function update(dt, world)
{
    Background.update(dt, world);
    DialogueBox.update(dt, world);
}

function render(ctx, world)
{
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, world.display.width, world.display.height);

    Background.render(ctx, world);
    DialogueBox.render(ctx, world);
}
