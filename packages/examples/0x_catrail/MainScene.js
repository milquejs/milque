import { Utils } from './milque.js';

import * as RenderHelper from './RenderHelper.js';
import * as SceneGraph from './SceneGraph.js';
import * as Transform from './Transform.js';

export function onStart()
{
    this.camera = {
        x: 0, y: 0,
        speed: 0.1,
        target: null
    };

    this.player = {
        x: 0, y: 0
    };

    this.camera.target = this.player;
}

export function onUpdate(dt)
{
    if (this.camera.target)
    {
        this.camera.x = Utils.lerp(this.camera.x, this.camera.target.x, dt * this.camera.speed);
        this.camera.y = Utils.lerp(this.camera.y, this.camera.target.y, dt * this.camera.speed);
    }
}

export function onPostUpdate(dt)
{
}

export function onRender(ctx, view, world)
{
    let cameraX = view.width / 2 - this.camera.x;
    let cameraY = view.height / 2 - this.camera.y;
    RenderHelper.drawNavigationInfo(view, cameraX, cameraY);
    
    ctx.translate(cameraX, cameraY);
    {
        ctx.fillRect(-8, -8, 16, 16);
    }
    ctx.translate(-cameraX, -cameraY);
    
    Utils.drawText(ctx, 'Bye!', view.width / 2, view.height / 2);
}

