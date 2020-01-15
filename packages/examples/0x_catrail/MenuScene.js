import * as m from './milque.js';
import * as Game from './Game.js';
import * as View from './View.js';

const LOAD_TIME = 250;
const FADE_IN_TIME = LOAD_TIME * 0.3;
const FADE_OUT_TIME = LOAD_TIME * 0.9;

const WORLD_VIEW = View.createView();

export async function load(game)
{
    game.registerView(WORLD_VIEW);
}

export async function unload(game)
{
    game.unregisterView(WORLD_VIEW);
}

export function onStart()
{
    this.time = 0;
}

export function onUpdate(dt)
{
    this.time += dt;
    if (this.time > LOAD_TIME) Game.nextScene('main');
}

export function onRender(ctx, view, world)
{
    let opacity = 0;
    if (world.time < FADE_IN_TIME)
    {
        opacity = world.time / (FADE_IN_TIME);
    }
    else if (world.time > FADE_OUT_TIME)
    {
        opacity = (LOAD_TIME - world.time) / (LOAD_TIME - FADE_OUT_TIME);
    }
    else
    {
        opacity = 1;
    }
    m.Utils.drawText(ctx, 'Powered by Milque', view.width / 2, view.height / 2, 0, 16, `rgba(255, 255, 255, ${opacity})`);
}
