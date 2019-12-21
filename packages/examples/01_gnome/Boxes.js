import * as Util from './lib.js';

export const ENTITY_CLASS_NAME = 'box';

const GRAVITY = 0.1;
const MAX_VELOCITY_X = 5;
const MAX_VELOCITY_Y = 5;

const FRICTION_X = 0.1;
const INVERSE_FRICTION_X = 1 - FRICTION_X;
const RESTITUTION = 0.4;

export function createBox(scene, x, y, width, height, dynamic = true, solid = true)
{
    let result = {
        scene,
        x, y,
        width, height,
        dx: 0, dy: 0,
        solid,
        dynamic,
        ground: false,
        color: Util.randomHexColor()
    };
    scene.entities[ENTITY_CLASS_NAME].push(result);
    return result;
}

export function update(dt, scene)
{
    for(let entity of scene.entities[ENTITY_CLASS_NAME])
    {
        if (entity.dynamic)
        {
            entity.ground = false;
            entity.dx *= INVERSE_FRICTION_X;
            entity.dy += GRAVITY;

            if (entity.dx > MAX_VELOCITY_X) entity.dx = MAX_VELOCITY_X;
            if (entity.dy > MAX_VELOCITY_Y) entity.dy = MAX_VELOCITY_Y;

            if (entity.dx)
            {
                entity.x += entity.dx;
                
                let other = checkCollision(entity, scene.entities[ENTITY_CLASS_NAME]);
                if (other)
                {
                    if (entity.dx < 0)
                    {
                        entity.x = other.x + other.width / 2 + entity.width / 2;
                    }
                    else
                    {
                        entity.x = other.x - other.width / 2 - entity.width / 2;
                    }

                    if (other.dynamic)
                    {
                        entity.dx *= RESTITUTION;
                        other.dx += entity.dx;
                    }
                    else
                    {
                        entity.dx = 0;
                    }
                }
            }

            if (entity.dy)
            {
                entity.y += entity.dy;
                
                let other = checkCollision(entity, scene.entities[ENTITY_CLASS_NAME]);
                if (other)
                {
                    if (entity.dy < 0)
                    {
                        entity.y = other.y + other.height / 2 + entity.height / 2;
                    }
                    else
                    {
                        entity.y = other.y - other.height / 2 - entity.height / 2;
                    }

                    if (other.dynamic)
                    {
                        entity.dy *= 0.5;
                        other.dy += entity.dy;
                    }
                    else
                    {
                        entity.dy = 0;
                    }

                    entity.ground = true;
                }
            }
        }
    }
}

function checkCollision(entity, others)
{
    for(let other of others)
    {
        if (entity === other) continue;
        if (!other.solid) continue;

        if (Util.intersectBox(entity, other))
        {
            return other;
        }
    }

    return null;
}

export function render(ctx, scene)
{
    for(let entity of scene.entities[ENTITY_CLASS_NAME])
    {
        Util.drawBox(ctx, entity.x, entity.y, 0, entity.width, entity.height, entity.color);
    }
}
