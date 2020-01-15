import { Utils } from './milque.js';

import * as RenderHelper from './RenderHelper.js';
import * as MouseControls from './MouseControls.js';

import { Camera2D } from './Camera2D.js';
import * as View from './View.js';
import * as ViewHelper from './ViewHelper.js';

const WORLD_VIEW = View.createView();
const HUD_VIEW = View.createView();

export async function load(game)
{
    this.camera = new Camera2D(WORLD_VIEW.width / 2, WORLD_VIEW.height / 2);

    game.addRenderTarget(HUD_VIEW, onHUDRender)
        .addRenderTarget(WORLD_VIEW, onWorldRender);
}

export async function unload(game)
{
    game.clearRenderTargets();
}

export function onStart()
{
    this.player = {
        x: 0, y: 0
    };

    this.camera.target = this.player;
    this.camera.speed = 0.1;
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

    this.camera.update(dt);
}

export function onHUDRender(ctx, view, world)
{
    RenderHelper.drawNavigationInfo(view,
        -world.camera.transform.x + world.camera.offsetX,
        -world.camera.transform.y + world.camera.offsetY);
}

export function onWorldRender(ctx, view, world)
{
    ViewHelper.applyViewTransform(view, world.camera);

    Utils.drawBox(ctx, world.player.x, world.player.y, 0, 64);

    const mouseX = MouseControls.POS_X.value * view.width + world.camera.transform.x - world.camera.offsetX;
    const mouseY = MouseControls.POS_Y.value * view.height + world.camera.transform.y - world.camera.offsetY;
    Utils.drawText(ctx, 'Bye!', mouseX, mouseY);
}

