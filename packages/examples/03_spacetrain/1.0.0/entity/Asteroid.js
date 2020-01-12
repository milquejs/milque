import { Utils } from '../milque.js';

export async function load() {}
export function unload() {}

export function spawn(world, ...args)
{
    let result = create(...args);
    world.asteroids.push(result);
    return result;
}

export function destroy(world, entity)
{
    world.asteroids.splice(world.asteroids.indexOf(entity), 1);
}

export function create(x = 0, y = 0)
{
    return {
        x, y,
        dx: 0, dy: 0,
        rotation: 0,
        width: 16,
        height: 16
    };
}

export function onPreUpdate(dt, world, entities) {}

export function onUpdate(dt, world, entities)
{
    for(let asteroid of entities)
    {
        asteroid.x += asteroid.dx;
        asteroid.y += asteroid.dy;
    }
}

export function onRender(view, world, entities)
{
    let ctx = view.context;
    for(let asteroid of entities)
    {
        Utils.drawBox(ctx, asteroid.x, asteroid.y, asteroid.rotation, asteroid.width, asteroid.height, 'gray');
    }
}
