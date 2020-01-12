export function create()
{
    return {
        delta: 0,
        step: 0.1
    };
}

export function play(flashData)
{
    flashData.delta = 1;
}

export function update(flashData)
{
    if (flashData.delta > 0)
    {
        flashData.delta -= flashData.step;
    }
    else
    {
        flashData.delta = 0;
    }
}

export function getFlashValue(flashData)
{
    return flashData.delta;
}
