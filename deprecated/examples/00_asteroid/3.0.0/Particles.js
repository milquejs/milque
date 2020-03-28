import * as Random from './Random.js';
import * as Player from './Player.js';

export const PARTICLE_RADIUS = 4;
export const PARTICLE_SPEED = 2;
export const MAX_PARTICLE_AGE = 600;

export function create(scene, x, y, dx, dy, color)
{
    if (typeof color === 'function') color = color.call(null);
    return {
        scene,
        x, y,
        dx, dy,
        rotation: Math.atan2(dy, dx),
        age: 0,
        color,
        destroy()
        {
            this.scene.particles.splice(this.scene.particles.indexOf(this), 1);
        }
    };
}

export function render(ctx, scene)
{
    for(let particle of scene.particles)
    {
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.fillStyle = particle.color;
        let size = PARTICLE_RADIUS * (1 - (particle.age / MAX_PARTICLE_AGE));
        ctx.fillRect(-size, -size, size * 2, size * 2);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

export function update(dt, scene)
{
    // Update particle motion
    for(let particle of scene.particles)
    {
        particle.age += dt;
        if (particle.age > MAX_PARTICLE_AGE)
        {
            particle.destroy();
        }
        else
        {
            particle.x += particle.dx;
            particle.y += particle.dy;
    
            // Wrap around
            wrapAround(particle, PARTICLE_RADIUS * 2, PARTICLE_RADIUS * 2);
        }
    }
}

export function thrust(scene, x, y, dx, dy, color)
{
    if (Random.random() > 0.3)
    {
        let particle = create(
            scene,
            x + Random.randomRange(...Player.PLAYER_MOVE_PARTICLE_OFFSET_RANGE),
            y + Random.randomRange(...Player.PLAYER_MOVE_PARTICLE_OFFSET_RANGE),
            dx, dy,
            color
        );
        particle.age = Random.randomRange(MAX_PARTICLE_AGE * Player.MIN_PLAYER_MOVE_PARTICLE_LIFE_RATIO, MAX_PARTICLE_AGE * Player.MAX_PLAYER_MOVE_PARTICLE_LIFE_RATIO);
        scene.particles.push(particle);
    }
}

export function explode(scene, x, y, amount = 10, color)
{
    for(let i = 0; i < amount; ++i)
    {
        scene.particles.push(
            create(
                scene,
                x, y,
                Random.randomRange(-1, 1) * PARTICLE_SPEED,
                Random.randomRange(-1, 1) * PARTICLE_SPEED,
                color
            )
        );
    }
}