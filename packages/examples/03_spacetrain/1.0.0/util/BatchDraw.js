import { Utils } from '../milque.js';

export function drawBoxes(ctx, boxes, outline = false)
{
    for(let box of boxes)
    {
        Utils.drawBox(ctx,
            box.x || 0,
            box.y || 0,
            box.rotation || 0,
            box.width || 16,
            box.height || 16,
            box.color || 'white',
            outline
        );
    }
}

export function drawCircles(ctx, circles, outline = false)
{
    for(let circle of circles)
    {
        Utils.drawCircle(ctx,
            circle.x || 0,
            circle.y || 0,
            circle.radius || 8,
            circle.color || 'white',
            outline
        );
    }
}