import { IntersectionWorld } from './lib.js';

export function initialize(world)
{
    const physics = IntersectionWorld.createIntersectionWorld();
    world.physics = physics;
}

export function update(world, dt)
{
    world.physics.update(dt);
}

export function render(world, ctx)
{
    world.physics.render(ctx);
}
