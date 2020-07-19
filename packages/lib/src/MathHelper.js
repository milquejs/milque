export function lerp(a, b, t)
{
    return a + (b - a) * t;
}

export function clamp(value, min, max)
{
    return Math.min(max, Math.max(min, value));
}

export function cycle(value, min, max)
{
    let range = max - min;
    let result = (value - min) % range;
    if (result < 0) result += range;
    return result + min;
}

export function withinRadius(fromX, fromY, toX, toY, radius)
{
    const dx = fromX - toX;
    const dy = fromY - toY;
    return dx * dx + dy * dy <= radius * radius
}

export function distance2(fromX, fromY, toX, toY)
{
    let dx = toX - fromX;
    let dy = toY - fromY;
    return Math.sqrt(dx * dx + dy * dy);
}

export function direction2(fromX, fromY, toX, toY)
{
    let dx = toX - fromX;
    let dy = toY - fromY;
    return Math.atan2(dy, dx);
}

export function lookAt2(radians, target, dt)
{
    let step = cycle(target - radians, -Math.PI, Math.PI);
    return clamp(radians + step, radians - dt, radians + dt);
}
