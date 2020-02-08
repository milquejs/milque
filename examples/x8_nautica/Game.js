import { GameLoop, View, DisplayPort } from './milque.js';

export async function startGame(game)
{
    let instance = (game.load && await game.load())
        || (Object.isExtensible(game) && game)
        || Object.create();
    
    let view = instance.view || View.createView();
    let viewport = instance.viewport || null;
    let fixedStep = instance.fixedStep || 0.016667;

    let displayPort = document.querySelector('display-port');
    if (!displayPort)
    {
        displayPort = new DisplayPort();
        displayPort.toggleAttribute('full');
        displayPort.toggleAttribute('debug');
        document.body.appendChild(displayPort);
    }

    displayPort.addEventListener('frame', e => {
        let ctx = e.detail.context;

        // Reset any transformations...
        view.context.setTransform(1, 0, 0, 1, 0, 0);
        view.context.clearRect(0, 0, view.width, view.height);

        if (game.render) game.render.call(instance, view, instance);

        displayPort.clear('black');

        // viewport is simply an array for with 4 elements: x, y, width, height
        // rendering pipeline: viewbuffer => view => viewport => displayport
        if (viewport)
        {
            View.drawBufferToCanvas(
                ctx,
                view.canvas,
                viewport.x,
                viewport.y,
                viewport.width,
                viewport.height
            );
        }
        else
        {
            View.drawBufferToCanvas(
                ctx,
                view.canvas
            );
        }
    });

    if (game.start) game.start.call(instance);

    let gameLoop = new GameLoop();
    let fixedTime = 0;
    gameLoop.addEventListener('update', e => {
        let dt = e.detail.delta;

        if (game.preupdate) game.preupdate.call(instance, dt);
        if (game.update) game.update.call(instance, dt);

        if (game.fixedupdate)
        {
            fixedTime += dt;
            if (fixedTime > fixedStep * 250) fixedTime = fixedStep * 250;
            while (fixedTime >= fixedStep)
            {
                fixedTime -= fixedStep;
                game.fixedupdate.call(instance);
            }
        }

        if (game.postupdate) game.postupdate.call(instance, dt);
    });
    gameLoop.start();
}
