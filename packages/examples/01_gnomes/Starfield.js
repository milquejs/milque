import * as Random from './Random.js';

/**
 * What I learned:
 * - I need access to the current bound canvas, wherever this object
 * is being used.
 * - I should implement all things related to Starfield in here and
 * just expose an interface for the engine to connect to.
 */

export function create()
{
    let result = {
        x: [],
        y: [],
        size: [],
        length: 0
    };
    for(let i = 0; i < 30; ++i)
    {
        result.x.push(Random.randomRange(0, canvas.width));
        result.y.push(Random.randomRange(0, canvas.height));
        result.size.push(Random.randomRange(2, 4));
        result.length++;
    }
    return result;
}

export function update(dt, scene)
{
    updateStarfield(scene.starfield, -1);
}

export function render(ctx, scene)
{
    for(let i = 0; i < scene.starfield.length; ++i)
    {
        let x = scene.starfield.x[i];
        let y = scene.starfield.y[i];
        let size = scene.starfield.size[i];
        drawBox(ctx, x, y, 0, size, size, 'white');
    }
}

function updateStarfield(starfield, dx = 1, dy = 0)
{
    for(let i = 0; i < starfield.length; ++i)
    {
        if (dx)
        {
            starfield.x[i] += dx;
            if (starfield.x[i] < 0)
            {
                starfield.x[i] = canvas.width;
                starfield.y[i] = Random.randomRange(0, canvas.height);
            }
            else if (starfield.x[i] > canvas.width)
            {
                starfield.x[i] = 0;
                starfield.y[i] = Random.randomRange(0, canvas.height);
            }
        }

        if (dy)
        {
            starfield.y[i] += dy;
            if (starfield.y[i] < 0)
            {
                starfield.x[i] = Random.randomRange(0, canvas.width);
                starfield.y[i] = canvas.height;
            }
            else if (starfield.y[i] > canvas.height)
            {
                starfield.x[i] = Random.randomRange(0, canvas.width);
                starfield.y[i] = 0;
            }
        }
    }
}