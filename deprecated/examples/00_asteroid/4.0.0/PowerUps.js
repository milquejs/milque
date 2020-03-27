import * as Random from './util/Random.js';
import * as Utils from './util/Utils.js';
import * as Lib from './lib.js';

import * as Player from './Player.js';
import * as Particles from './Particles.js';

const POWER_UP_RADIUS = 4;
const POWER_UP_SPAWN_RATE = [10000, 30000];
const POWER_UP_EXPLODE_PARTICLE_COLORS = [ 'violet', 'white', 'violet' ];
const POWER_UP_AMOUNT = 30;

export function create(scene, x, y, dx, dy)
{
    return {
        scene,
        x, y,
        dx, dy,
        rotation: Math.atan2(dy, dx),
        destroy()
        {
            this.scene.powerUps.splice(this.scene.powerUps.indexOf(this), 1);
        }
    }
}

export function render(ctx, scene)
{
    for(let powerUp of scene.powerUps)
    {
        ctx.translate(powerUp.x, powerUp.y);
        ctx.rotate(powerUp.rotation);
        ctx.beginPath();
        ctx.strokeStyle = 'violet';
        ctx.arc(0, 0, POWER_UP_RADIUS, 0, Math.PI * 2);
        ctx.moveTo(-POWER_UP_RADIUS / 2, 0);
        ctx.lineTo(POWER_UP_RADIUS / 2, 0);
        ctx.moveTo(0, -POWER_UP_RADIUS / 2);
        ctx.lineTo(0, POWER_UP_RADIUS / 2);
        ctx.stroke();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        Lib.drawCollisionCircle(ctx, powerUp.x, powerUp.y, POWER_UP_RADIUS);
    }
}

export function update(ctx, scene)
{
    // Update power-up motion
    for(let powerUp of scene.powerUps)
    {
        powerUp.x += powerUp.dx;
        powerUp.y += powerUp.dy;

        // Wrap around
        Lib.wrapAround(powerUp, POWER_UP_RADIUS * 2, POWER_UP_RADIUS * 2);
    }

    // Update power-up collision
    for(let powerUp of scene.powerUps)
    {
        if (Utils.withinRadius(powerUp, scene.player, POWER_UP_RADIUS + Player.PLAYER_RADIUS))
        {
            Particles.explode(scene, powerUp.x, powerUp.y, 10, Random.randomChoose.bind(null, POWER_UP_EXPLODE_PARTICLE_COLORS));
            powerUp.destroy();
            scene.player.powerMode += POWER_UP_AMOUNT;
            break;
        }
    }
}