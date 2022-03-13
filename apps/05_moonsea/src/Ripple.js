
// TODO: Would be better if the ripple only relies on
//  start time, and whether to "bounce" infinitely

export function drawRipple(ctx, x, y, age) {
    if (age <= 0) return;
    ctx.setColor(0xffffff);
    let dr = age / 10_000;
    ctx.setTranslation(x, y, 10);
    let ds = (1 - dr) * 0.9;
    ctx.setScale(2 + ds * 2, 0.5 + ds);
    ctx.setOpacityFloat(dr);
    ctx.drawLineCircle();
    let dt = (1 - dr) * 0.5;
    ctx.setScale(1 + dt * 2, 0.1 + dt);
    ctx.drawLineCircle();
    ctx.setOpacityFloat(1);
    ctx.resetTransform();
}
