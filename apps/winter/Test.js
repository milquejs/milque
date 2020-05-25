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
