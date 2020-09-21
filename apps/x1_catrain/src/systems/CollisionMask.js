export function CollisionMask(props)
{
    const { name = 'main', x = 0, y = 0, rx = 16, ry = 16 } = props;
    return {
        name,
        x, y,
        rx, ry,
    };
}
CollisionMask.multiple = true;
