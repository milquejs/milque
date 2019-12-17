import * as Random from './Random.js';
import * as Display from './Display.js';

/**
 * What I learned:
 * - I need access to the current bound canvas, wherever this object
 * is being used.
 * - I should implement all things related to Starfield in here and
 * just expose an interface for the engine to connect to.
 */

const STAR_SIZE_RANGE = [2, 4];
const STAR_SPEED_RANGE = [-1, -0.3];

export function create()
{
    let result = {
        x: [],
        y: [],
        size: [],
        speed: [],
        length: 0
    };
    for(let i = 0; i < 30; ++i)
    {
        result.x.push(Random.randomRange(0, Display.getWidth()));
        result.y.push(Random.randomRange(0, Display.getHeight()));
        result.size.push(Random.randomRange(...STAR_SIZE_RANGE));
        result.speed.push(Random.randomRange(...STAR_SPEED_RANGE));
        result.length++;
    }
    return result;
}

export function update(dt, scene)
{
    updateStarfield(scene.starfield);
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
            starfield.x[i] += dx * starfield.speed[i];
            if (starfield.x[i] < 0)
            {
                starfield.x[i] = Display.getWidth();
                starfield.y[i] = Random.randomRange(0, Display.getHeight());
            }
            else if (starfield.x[i] > Display.getWidth())
            {
                starfield.x[i] = 0;
                starfield.y[i] = Random.randomRange(0, Display.getHeight());
            }
        }

        if (dy)
        {
            starfield.y[i] += dy * starfield.speed[i];
            if (starfield.y[i] < 0)
            {
                starfield.x[i] = Random.randomRange(0, Display.getWidth());
                starfield.y[i] = Display.getHeight();
            }
            else if (starfield.y[i] > Display.getHeight())
            {
                starfield.x[i] = Random.randomRange(0, Display.getWidth());
                starfield.y[i] = 0;
            }
        }
    }
}