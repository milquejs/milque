import { ApplicationLoop } from '@milque/game';
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
    
    let view = instance.view || new View();
    let viewport = instance.viewport || {
        x: 0, y: 0,
        get width() { return displayPort.getCanvas().clientWidth; },
        get height() { return displayPort.getCanvas().clientHeight; },
    };

    let applicationLoop = new ApplicationLoop();

    let gameInfo = {
        game,
        view,
        viewport,
        display: displayPort,
        loop: applicationLoop,
        onframe: onFrame.bind(undefined, instance),
        onpreupdate: onPreUpdate.bind(undefined, instance),
        onupdate: onUpdate.bind(undefined, instance),
        onfixedupdate: onFixedUpdate.bind(undefined, instance),
        onpostupdate: onPostUpdate.bind(undefined, instance),
        onfirstupdate: onFirstUpdate.bind(undefined, instance),
    };
    
    Object.defineProperty(instance, GAME_INFO_PROPERTY, {
        value: gameInfo,
        enumerable: false,
        configurable: true,
    });
    
    applicationLoop.addEventListener('update', gameInfo.onfirstupdate, { once: true });
    applicationLoop.start();

    return instance;
}

function onFirstUpdate(instance, e)
{
    let { game, display, loop, onpreupdate, onupdate, onpostupdate, onfixedupdate, onframe } = instance[GAME_INFO_PROPERTY];

    if (game.start) game.start.call(instance);

    onpreupdate.call(instance,e);
    onupdate.call(instance, e);
    onfixedupdate.call(instance, e);
    onpostupdate.call(instance, e);

    loop.addEventListener('preupdate', onpreupdate);
    loop.addEventListener('update', onupdate);
    loop.addEventListener('fixedupdate', onfixedupdate);
    loop.addEventListener('postupdate', onpostupdate);
    display.addEventListener('frame', onframe);
}

function onPreUpdate(instance, e)
{
    let { game } = instance[GAME_INFO_PROPERTY];
    let dt = e.detail.delta;
    if (game.preupdate) game.preupdate.call(instance, dt);
}

function onUpdate(instance, e)
{
    let { game } = instance[GAME_INFO_PROPERTY];
    let dt = e.detail.delta;
    if (game.update) game.update.call(instance, dt);
}

function onFixedUpdate(instance, e)
{
    let { game } = instance[GAME_INFO_PROPERTY];
    if (game.fixedupdate) game.fixedupdate.call(instance);
}

function onPostUpdate(instance, e)
{
    let { game } = instance[GAME_INFO_PROPERTY];
    let dt = e.detail.delta;
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
    let { game, loop, display, onframe, onpreupdate, onupdate, onfixedupdate, onpostupdate, onfirstupdate } = instance[GAME_INFO_PROPERTY];

    loop.removeEventListener('update', onfirstupdate);
    loop.removeEventListener('preupdate', onpreupdate);
    loop.removeEventListener('update', onupdate);
    loop.removeEventListener('fixedupdate', onfixedupdate);
    loop.removeEventListener('postupdate', onpostupdate);
    display.removeEventListener('frame', onframe);

    return await new Promise(resolve => {
        loop.addEventListener('stop', async () => {
            if (game.stop) game.stop();
            if (game.unload) await game.unload(instance);
            resolve(instance);
        }, { once: true });
        loop.stop();
    });
}

export async function nextGame(fromInstance, toGame)
{
    await stopGame(fromInstance);
    let result = await startGame(toGame);
    return result;
}
