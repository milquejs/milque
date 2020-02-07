export function clampRange(value, min, max)
{
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

export function withinRadius(fromX, fromY, toX, toY, radius)
{
    const dx = fromX - toX;
    const dy = fromY - toY;
    return dx * dx + dy * dy <= radius * radius
}

export function lerp(a, b, dt)
{
    return a + (b - a) * dt;
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
    let step = cycleRange(target - radians, -Math.PI, Math.PI);
    return clampRange(radians + step, radians - dt, radians + dt);
}

export function cycleRange(value, min, max)
{
    let range = max - min;
    let result = (value - min) % range;
    if (result < 0) result += range;
    return result + min;
}
