export function createFlashAnimation()
{
    return {
        delta: 0,
        step: 0.1
    };
}

export function playFlashAnimation(flashData)
{
    flashData.delta = 1;
}

export function updateFlashAnimation(flashData)
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
