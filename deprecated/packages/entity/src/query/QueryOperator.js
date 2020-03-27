export function createQueryOperator(handler, key = Symbol(handler.name))
{
    let result = function(componentType) {
        return { [OPERATOR]: key, [HANDLER]: handler, component: componentType };
    };
    // Dynamic renaming of function for debugging purposes
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
    Object.defineProperty(result, 'name', {
        value: name,
        configurable: true,
    });
    return result;
}

export const Not = createQueryOperator(
    function NotOperator(world, entityId, componentTypees)
    {
        return !(world.hasComponent(entityId, ...componentTypees));
    },
    Symbol('!')
);
