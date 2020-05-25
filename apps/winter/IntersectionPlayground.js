import { sweepInto, intersectPoint, intersectSegment } from './IntersectionHelper.js';

const ONFRAME_KEY = Symbol('onframe');

export function run(displayPort, state)
{
    const { dynamics = [], statics = [], masks = [], update, render } = state;

    function onUpdate(dt)
    {
        if (update) update.call(state, dt);

        let result = {};
        for(let collider of dynamics)
        {
            let sweep = sweepInto(
                result,
                collider,
                statics,
                collider.dx || 0,
                collider.dy || 0);
            
            collider.hit = sweep.hit;
            collider.x = sweep.x;
            collider.y = sweep.y;
        }

        for(let collider of masks)
        {
            let hit = null;
            switch(collider.type)
            {
                case 'point':
                    for(let other of statics)
                    {
                        if (intersectPoint(result, other, collider.x, collider.y))
                        {
                            hit = result;
                            break;
                        }
                    }
                    break;
                case 'segment':
                    for(let other of statics)
                    {
                        if (intersectSegment(result, other, collider.x, collider.y, collider.dx, collider.dy))
                        {
                            hit = result;
                            break;
                        }
                    }
                    break;

            }
            collider.hit = hit;
        }
    }
    
    function onRender(ctx)
    {
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Clear screen.
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, displayPort.width, displayPort.height);

        // Transform canvas to first quadrant; (0,0) = bottom left, (width, height) = top right.
        // ctx.translate(0, -ctx.canvas.clientHeight);
        ctx.translate(displayPort.width / 2, displayPort.height / 2);

        // Draw colliders.
        ctx.strokeStyle = 'lime';
        for(let collider of dynamics)
        {
            ctx.strokeRect(collider.x - collider.rx, collider.y - collider.ry, collider.rx * 2, collider.ry * 2);
        }
        ctx.strokeStyle = 'blue';
        for(let collider of masks)
        {
            switch(collider.type)
            {
                case 'point':
                    ctx.strokeRect(collider.x - 1, collider.y - 1, 2, 2);
                    break;
                case 'segment':
                    ctx.beginPath();
                    ctx.moveTo(collider.x, collider.y);
                    ctx.lineTo(collider.x + collider.dx, collider.y + collider.dy);
                    ctx.stroke();
                    break;
            }
        }
        ctx.strokeStyle = Math.random() > 0.5 ? 'green' : 'blue';
        for(let collider of statics)
        {
            ctx.strokeRect(collider.x - collider.rx, collider.y - collider.ry, collider.rx * 2, collider.ry * 2);
        }

        if (render) render.call(state, ctx);
    }

    function onFrame(e)
    {
        const ctx = e.detail.canvasContext;
        const dt = e.detail.deltaTime;

        onUpdate(dt);
        onRender(ctx);
    }

    state[ONFRAME_KEY] = onFrame;
    displayPort.addEventListener('frame', onFrame);
}

export function stop(displayPort, state)
{
    const onFrame = state[ONFRAME_KEY];
    displayPort.removeEventListener('frame', onFrame);
}

export function createPoint(x, y)
{
    return { type: 'point', x, y, hit: null };
}

export function createSegment(x, y, dx, dy)
{
    return { type: 'segment', x, y, dx, dy, hit: null };
}

export function createRect(left, top, right, bottom)
{
    let rx = Math.abs(right - left) / 2;
    let ry = Math.abs(bottom - top) / 2;
    return createAABB(left + rx, top + ry, rx, ry);
}

export function createAABB(x, y, rx, ry)
{
    return { type: 'aabb', x, y, rx, ry, hit: null };
}
