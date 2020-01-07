import { Utils, Random } from './milque.js';

export const MIN_PLANET_ROT_SPEED = 0.005;
export const MAX_PLANET_ROT_SPEED = 0.01;

export async function load(assets)
{
    
}

export function create(world, x = 0, y = 0, radius = 32)
{
    let result = {
        x, y,
        rotation: 0,
        dr: Random.randomSign() * Random.randomRange(MIN_PLANET_ROT_SPEED, MAX_PLANET_ROT_SPEED),
        radius
    };
    world.planets.push(result);
    return result;
}

export function onPreUpdate(dt, world, entities)
{

}

export function onUpdate(dt, world, entities)
{
    for(let planet of entities)
    {
        planet.rotation += planet.dr * dt;
        planet.rotation %= Math.PI * 2;
    }
}

export function onPostUpdate(dt, world, entities)
{
    
}

export function onRender(view, world, entities)
{
    let ctx = view.context;
    for(let planet of entities)
    {
        Utils.drawBox(ctx, planet.x, planet.y, planet.rotation, planet.radius, planet.radius, 'green');
    }
}

export function destroy(world, entity)
{
    world.planets.splice(world.planets.indexOf(entity), 1);
}

export function unload(assets)
{

}
