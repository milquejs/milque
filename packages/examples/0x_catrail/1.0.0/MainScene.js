import { Utils, ViewHelper } from './milque.js';

import * as RenderHelper from './RenderHelper.js';
import * as MouseControls from './MouseControls.js';

import { Camera2D } from './Camera2D.js';

export function onStart()
{
    this.camera = new Camera2D();

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

export function onRender(ctx, view, world)
{
    world.camera.setOffset(view.width / 2, view.height / 2);

    ViewHelper.setViewTransform(view);
    {
        RenderHelper.drawNavigationInfo(view,
            -world.camera.transform.x + world.camera.offsetX,
            -world.camera.transform.y + world.camera.offsetY);
    }

    ViewHelper.setViewTransform(view, world.camera);
    {
        Utils.drawBox(ctx, world.player.x, world.player.y);
    
        const mouseX = MouseControls.POS_X.value * view.width + world.camera.transform.x - world.camera.offsetX;
        const mouseY = MouseControls.POS_Y.value * view.height + world.camera.transform.y - world.camera.offsetY;
        Utils.drawText(ctx, 'Bye!', mouseX, mouseY);
    }
}

