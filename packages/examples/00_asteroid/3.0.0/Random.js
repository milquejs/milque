export function random()
{
    return ((this && this._random) || Math).random();
}

export function randomChoose(choices)
{
    return choices[Math.floor(random.call(this) * choices.length)];
}

export function randomRange(min, max)
{
    return random.call(this) * (max - min) + min;
}
