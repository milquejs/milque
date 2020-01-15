import { Utils } from './milque.js';

import * as RenderHelper from './RenderHelper.js';
import * as MouseControls from './MouseControls.js';

import * as View from './View.js';

const CAMERA_SPEED = 0.1;

const WORLD_VIEW = View.createView();
const HUD_VIEW = View.createView();

export async function load(game)
{
    WORLD_VIEW.camera.offsetX = WORLD_VIEW.width / 2;
    WORLD_VIEW.camera.offsetY = WORLD_VIEW.height / 2;
    game.registerView(HUD_VIEW);
    game.registerView(WORLD_VIEW);
}

export async function unload(game)
{
    game.unregisterView(WORLD_VIEW);
    game.unregisterView(HUD_VIEW);
}

export function onStart()
{
    this.target = null;

    this.player = {
        x: 0, y: 0
    };

    this.target = this.player;
}

export function onUpdate(dt)
{
    if (MouseControls.LEFT_DOWN.value)
    {
        this.player.x += 10;
    }

    if (MouseControls.RIGHT_DOWN.value)
    {
        this.player.x -= 10;
    }

    if (this.target)
    {
        let transform = WORLD_VIEW.camera.transform;
        transform.x = Utils.lerp(transform.x, this.target.x, dt * CAMERA_SPEED);
        transform.y = Utils.lerp(transform.y, this.target.y, dt * CAMERA_SPEED);
    }
}

export function onRender(ctx, view, world)
{
    if (view === HUD_VIEW)
    {
        RenderHelper.drawNavigationInfo(view,
            -WORLD_VIEW.camera.transform.x + WORLD_VIEW.camera.offsetX,
            -WORLD_VIEW.camera.transform.y + WORLD_VIEW.camera.offsetY);
    }
    else if (view === WORLD_VIEW)
    {
        Utils.drawBox(ctx, world.player.x, world.player.y, 0, 64);

        const mouseX = MouseControls.POS_X.value * view.width + view.camera.transform.x - view.camera.offsetX;
        const mouseY = MouseControls.POS_Y.value * view.height + view.camera.transform.y - view.camera.offsetY;
        Utils.drawText(ctx, 'Bye!', mouseX, mouseY);
    }
}

