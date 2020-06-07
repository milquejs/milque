export function assertNotNull(a)
{
    if (!a)
    {
        throw new Error(`Assertion failed - expected not null but was '${a}'.`);
    }
}

export function assertNull(a)
{
    if (a != null)
    {
        throw new Error(`Assertion failed - expected null but was '${a}'.`);
    }
}

export function assertGreaterThan(value, target)
{
    if (value <= target)
    {
        throw new Error(`Assertion failed - expected value to be greater than '${target}' but was '${value}'.`);
    }
}

export function assertGreaterThanOrEqualTo(value, target)
{
    if (value < target)
    {
        throw new Error(`Assertion failed - expected value to be greater than or equal to '${target}' but was '${value}'.`);
    }
}

export function assertLessThan(value, target)
{
    if (value >= target)
    {
        throw new Error(`Assertion failed - expected value to be less than '${target}' but was '${value}'.`);
    }
}

export function assertLessThanOrEqualTo(value, target)
{
    if (value > target)
    {
        throw new Error(`Assertion failed - expected value to be less than or equal to '${target}' but was '${value}'.`);
    }
}

export function assertEquals(a, b)
{
    if (a != b)
    {
        throw new Error(`Assertion failed - expected '${b}' but was '${a}'.`);
    }
}

export function assertEqualsWithError(a, b, error = Number.EPSILON)
{
    if (a < b - error || a > b + error)
    {
        throw new Error(`Assertion failed - expected '${b}' +/- ${error} but was '${a}'.`);
    }
}

export function assertTrue(result)
{
    if (!result)
    {
        throw new Error(`Assertion failed - expected true but was '${result}'.`);
    }
}

export function assertFalse(result)
{
    if (result)
    {
        throw new Error(`Assertion failed - expected false but was '${result}'.`);
    }
}
