export function lerp(a, b, t)
{
    return a + (b - a) * t;
}

export function clamp(value, min, max)
{
    return Math.min(max, Math.max(min, value));
}
