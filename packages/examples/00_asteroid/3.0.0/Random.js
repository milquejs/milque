import MersenneTwister from './MersenneTwister.js';

let CACHED_SEEDED_RANDOMS = new Map();

export function seed(seedValue)
{
    let m;
    if (CACHED_SEEDED_RANDOMS.has(seedValue))
    {
        m = CACHED_SEEDED_RANDOMS.get(seedValue);
    }
    else
    {
        CACHED_SEEDED_RANDOMS.set(seedValue, m = new MersenneTwister(seedValue));
    }
    return {
        _random: m,
        random,
        randomChoose,
        randomRange,
    };
}

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
