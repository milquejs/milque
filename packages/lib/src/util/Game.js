import { GameLoop } from '@milque/game';
import { View, DisplayPort } from '@milque/display';

const GAME_INFO_PROPERTY = Symbol('gameInfo');

export async function startGame(game)
{
    if (!game) game = {};

    let displayPort = document.querySelector('display-port');
    if (!displayPort)
    {
        displayPort = new DisplayPort();
        displayPort.toggleAttribute('full');
        displayPort.toggleAttribute('debug');
        document.body.appendChild(displayPort);
    }

    let instance = (game.load && await game.load(game))
        || (Object.isExtensible(game) && game)
        || {};
    
    let view = instance.view || View.createView();
    let viewport = instance.viewport || {
        x: 0, y: 0,
        get width() { return displayPort.getCanvas().clientWidth; },
        get height() { return displayPort.getCanvas().clientHeight; },
    };

    let gameLoop = new GameLoop();

    let gameInfo = {
        game,
        view,
        viewport,
        display: displayPort,
        loop: gameLoop,
        fixed: {
            time: 0,
            step: instance.fixedStep || 0.016667,
        },
        onframe: onFrame.bind(undefined, instance),
        onupdate: onUpdate.bind(undefined, instance),
        onfirstupdate: onFirstUpdate.bind(undefined, instance),
    };
    
    Object.defineProperty(instance, GAME_INFO_PROPERTY, {
        value: gameInfo,
        enumerable: false,
        configurable: true,
    });
    
    gameLoop.addEventListener('update', gameInfo.onfirstupdate, { once: true });
    gameLoop.start();

    return instance;
}

function onFirstUpdate(instance, e)
{
    let { display, loop, onupdate, onframe } = instance[GAME_INFO_PROPERTY];
    console.log('FIRST');
    if (game.start) game.start.call(instance);

    onupdate.call(instance, e);
    loop.addEventListener('update', onupdate);
    display.addEventListener('frame', onframe);
}

function onUpdate(instance, e)
{
    let { game, fixed } = instance[GAME_INFO_PROPERTY];
    let dt = e.detail.delta;

    if (game.preupdate) game.preupdate.call(instance, dt);
    if (game.update) game.update.call(instance, dt);

    if (game.fixedupdate)
    {
        let timeStep = fixed.step;
        let maxTime = timeStep * 250;
        if (fixed.time > maxTime) fixed.time = maxTime;
        else fixed.time += dt;
        while (fixed.time >= timeStep)
        {
            fixed.time -= timeStep;
            game.fixedupdate.call(instance);
        }
    }

    if (game.postupdate) game.postupdate.call(instance, dt);
}

function onFrame(instance, e)
{
    let { game, display, view, viewport } = instance[GAME_INFO_PROPERTY];
    let ctx = e.detail.context;

    // Reset any transformations...
    view.context.setTransform(1, 0, 0, 1, 0, 0);
    view.context.clearRect(0, 0, view.width, view.height);

    if (game.render) game.render.call(instance, view, instance);

    display.clear('black');
    view.drawBufferToCanvas(
        ctx,
        viewport.x,
        viewport.y,
        viewport.width,
        viewport.height
    );
}

export async function pauseGame(instance)
{
    let { loop } = instance[GAME_INFO_PROPERTY];
    loop.pause();
}

export async function resumeGame(instance)
{
    let { loop } = instance[GAME_INFO_PROPERTY];
    loop.resume();
}

export async function stopGame(instance)
{
    let { game, onframe, onupdate, onfirstupdate } = instance[GAME_INFO_PROPERTY];

    game.loop.removeEventListener('update', onfirstupdate);
    game.loop.removeEventListener('update', onupdate);
    game.display.removeEventListener('frame', onframe);

    return await new Promise(resolve => {
        game.loop.addEventListener('stop', async () => {
            if (game.stop) game.stop();
            if (game.unload) await game.unload(instance);
            resolve(instance);
        }, { once: true });
        game.loop.stop();
    });
}

export async function nextGame(fromInstance, toGame)
{
    await stopGame(fromInstance);
    let result = await startGame(toGame);
    return result;
}
