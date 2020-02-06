function clampRange(value, min, max)
{
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

function withinRadius(from, to, radius)
{
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    return dx * dx + dy * dy <= radius * radius
}

function lerp(a, b, dt)
{
    return a + (b - a) * dt;
}

function distance2(from, to)
{
    let dx = to.x - from.x;
    let dy = to.y - from.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function direction2(from, to)
{
    let dx = to.x - from.x;
    let dy = to.y - from.y;
    return Math.atan2(dy, dx);
}

function lookAt2(radians, target, dt)
{
    let step = cycleRange(target - radians, -Math.PI, Math.PI);
    return clampRange(radians + step, radians - dt, radians + dt);
}

function cycleRange(value, min, max)
{
    let range = max - min;
    let result = (value - min) % range;
    if (result < 0) result += range;
    return result + min;
}

export { clampRange, cycleRange, direction2, distance2, lerp, lookAt2, withinRadius };
