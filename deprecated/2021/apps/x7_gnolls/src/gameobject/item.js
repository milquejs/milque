export const ITEM_SIZE = 12;
export const HALF_ITEM_SIZE = ITEM_SIZE / 2;

export function createItem(world, type)
{
    let item = {
        x: 0,
        y: 0,
        type: 'tomato',
    };
    return item;
}

export function drawItem(item, ctx)
{
    let x = item.x;
    let y = item.y;
    ctx.translate(x, y);
    {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(-HALF_ITEM_SIZE, -HALF_ITEM_SIZE, ITEM_SIZE, ITEM_SIZE);
    }
    ctx.translate(-x, -y);
}

export function updateItem(item, dt)
{
}

export function intersects(x1, y1, r1, x2, y2, r2)
{
    let dx = x2 - x1;
    let dy = y2 - y1;
    let radius = r1 + r2;
    let radiusSqu = radius * radius;
    let distanceSqu = dx * dx + dy * dy;
    return distanceSqu < radiusSqu;
}
