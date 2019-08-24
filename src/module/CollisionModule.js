import CollisionManager from '../collision/CollisionManager.js';
import { VIEW } from './DisplayModule.js';

const COLLISION_MANAGER = new CollisionManager();

function overlap(x, y, w, h, otherX, otherY, otherW, otherH)
{
    return x + w >= otherX
        && otherX + otherW >= x
        && y + h >= otherY
        && otherY + otherH >= y;
}

function draw()
{
    const ctx = VIEW.canvas.getContext('2d');
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.beginPath();
    COLLISION_MANAGER.broadPhase.draw(ctx);
    ctx.stroke();

    ctx.strokeStyle = '#00FF00';
    ctx.beginPath();
    COLLISION_MANAGER.broadPhase.drawBVH(ctx);
    ctx.stroke();
}

export {
    COLLISION_MANAGER,
    overlap,
    draw
};