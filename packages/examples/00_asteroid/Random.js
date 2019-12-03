export function random()
{
    return Math.random();
}

export function randomChoose(choices)
{
    return choices[Math.floor(Math.random() * choices.length)];
}

export function randomRange(min, max)
{
    return Math.random() * (max - min) + min;
}
