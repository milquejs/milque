export function State(up, down)
{
    return {
        eventKeys: [ up, down ]
    };
}

export function Range(key)
{
    return {
        eventKeys: [ key ]
    };
}

export function Action(key)
{
    return {
        eventKeys: [ key ]
    };
}
