function lerp(a, b, t)
{
    return a + (b - a) * t;
}

function clamp(value, min, max)
{
    return Math.min(max, Math.max(min, value));
}

function cycle(value, min, max)
{
    let range = max - min;
    let result = (value - min) % range;
    if (result < 0) result += range;
    return result + min;
}

function withinRadius(fromX, fromY, toX, toY, radius)
{
    const dx = fromX - toX;
    const dy = fromY - toY;
    return dx * dx + dy * dy <= radius * radius
}

function distance2(fromX, fromY, toX, toY)
{
    let dx = toX - fromX;
    let dy = toY - fromY;
    return Math.sqrt(dx * dx + dy * dy);
}

function direction2(fromX, fromY, toX, toY)
{
    let dx = toX - fromX;
    let dy = toY - fromY;
    return Math.atan2(dy, dx);
}

function lookAt2(radians, target, dt)
{
    let step = cycle(target - radians, -Math.PI, Math.PI);
    return clamp(radians + step, radians - dt, radians + dt);
}

const TO_RAD_FACTOR = Math.PI / 180;
const TO_DEG_FACTOR = 180 / Math.PI;
function toRadians(degrees)
{
    return degrees * TO_RAD_FACTOR;
}

function toDegrees(radians)
{
    return radians * TO_DEG_FACTOR;
}

export { clamp, cycle, direction2, distance2, lerp, lookAt2, toDegrees, toRadians, withinRadius };
