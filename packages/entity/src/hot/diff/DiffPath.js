export const FUNCTION_NAME = Symbol('functionName');
export const FUNCTION_ARGS = Symbol('functionArguments');

export function resolveObject(target, path = [])
{
    let node = target;
    for(let p of path)
    {
        if (typeof p === 'object' && FUNCTION_NAME in p)
        {
            node = node[p[FUNCTION_NAME]](...p[FUNCTION_ARGS]);
        }
        else
        {
            node = node[p];
        }
    }
    return node;
}

export function nextProperty(parentPath, nextKey)
{
    return [
        ...parentPath,
        nextKey,
    ];
}

export function nextFunction(parentPath, functionName, functionArguments = [])
{
    return [
        ...parentPath,
        {
            [FUNCTION_NAME]: functionName,
            [FUNCTION_ARGS]: functionArguments,
        }
    ];
}
