export const DEBUG = {
    showCollision: false,
};
export const FLASH_TIME_STEP = 0.1;

export function wrapAround(canvas, position, width, height) {
    if (position.x < -width) position.x = canvas.width;
    if (position.y < -height) position.y = canvas.height;
    if (position.x > canvas.width + width / 2) position.x = -width;
    if (position.y > canvas.height + height / 2) position.y = -height;
}

export function withinRadius(from, to, radius) {
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    return dx * dx + dy * dy <= radius * radius;
}

export function drawCollisionCircle(ctx, x, y, radius) {
    if (!DEBUG.showCollision) return;
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'lime';
    ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}
