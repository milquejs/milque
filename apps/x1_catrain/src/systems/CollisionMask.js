export function CollisionMask(props)
{
    const { name = 'main', x = 0, y = 0, rx = 8, ry = 8 } = props;
    return {
        name,
        x, y,
        rx, ry,
    };
}
CollisionMask.multiple = true;
