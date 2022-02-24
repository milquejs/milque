import { Utils, Input } from './milque.js';

import * as Game from './Game.js';

const TIME_STEP = 100;
const LOAD_TIME = 300;
const FADE_IN_TIME = LOAD_TIME * 0.3;
const FADE_OUT_TIME = LOAD_TIME * 0.9;

const CONTEXT = Input.createContext();
const ANY_KEY = CONTEXT.registerAction('continue', 'key.down', 'mouse.down');

export class SplashScene
{
    constructor(splashText, nextScene)
    {
        this.splashText = splashText;
        this.nextScene = nextScene;
    }

    /** @override */
    async load(world, opts)
    {
        CONTEXT.enable();
    }

    /** @override */
    async unload(world)
    {
        CONTEXT.disable();
    }

    /** @override */
    onStart(world)
    {
        this.time = 0;
    }
    
    /** @override */
    onUpdate(dt)
    {
        this.time += dt * TIME_STEP;
        // Skip loading...
        if (ANY_KEY.value && this.time > FADE_IN_TIME && this.time < FADE_OUT_TIME)
        {
            this.time = FADE_OUT_TIME;
        }
        // Continue to next scene...
        if (this.time > LOAD_TIME) Game.nextScene(this.nextScene);
    }
    
    /** @override */
    onRender(ctx, view, world)
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
        Utils.drawText(ctx, this.splashText, view.width / 2, view.height / 2, 0, 16, `rgba(255, 255, 255, ${opacity})`);
    }
}
