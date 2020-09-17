export function createInputMap(inputs)
{
    let result = {};
    for(let key of inputs)
    {
        result[key] = { value: 0 };
    }
    return result;
}

export function hydrateInputMap(inputMap, inputContext)
{
    for(let key in inputMap)
    {
        inputMap[key] = inputContext.getInput(key);
    }
    return inputMap;
}
