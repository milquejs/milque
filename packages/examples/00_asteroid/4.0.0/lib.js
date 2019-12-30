import * as Views from './Views.js';

let SHOW_COLLISION = false;

export function toggleShowCollision(value = !SHOW_COLLISION)
{
    SHOW_COLLISION = value;
}

export function drawCollisionCircle(ctx, x, y, radius)
{
    if (!SHOW_COLLISION) return;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'lime';
    ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

export function wrapAround(position, width, height)
{
    if (position.x < -width) position.x = Views.MAIN_VIEW.width;
    if (position.y < -height) position.y = Views.MAIN_VIEW.height;
    if (position.x > Views.MAIN_VIEW.width + width / 2) position.x = -width;
    if (position.y > Views.MAIN_VIEW.height + height / 2) position.y = -height;
}
