import * as Random from './Random.js';
import * as Bullets from './Bullets.js';
import * as Particles from './Particles.js';

export const PLAYER_MOVE_PARTICLE_OFFSET_RANGE = [-2, 2];
export const PLAYER_MOVE_PARTICLE_DAMP_FACTOR = 1.5;
export const MIN_PLAYER_MOVE_PARTICLE_LIFE_RATIO = 0.1;
export const MAX_PLAYER_MOVE_PARTICLE_LIFE_RATIO = 0.4;

const FLASH_TIME_STEP = 0.1;

export const PLAYER_EXPLODE_PARTICLE_COLORS = [ 'red', 'red', 'red', 'yellow', 'orange' ];
export const PLAYER_RADIUS = 5;
export const PLAYER_SHOOT_COOLDOWN = 10;
const PLAYER_MOVE_SPEED = 0.02;
const PLAYER_ROT_SPEED = 0.008;
const PLAYER_ROT_FRICTION = 0.1;
const PLAYER_MOVE_FRICTION = 0.001;

const PLAYER_MOVE_PARTICLE_COLORS = [ 'gray', 'darkgray', 'lightgray' ];

export function create(scene)
{
    return {
        scene,
        x: canvas.width / 2,
        y: canvas.height / 2,
        rotation: 0,
        dx: 0,
        dy: 0,
        dr: 0,
        left: 0,
        right: 0,
        up: 0,
        down: 0,
        cooldown: 0,
        powerMode: 0,
        shoot()
        {
            Bullets.shootFromPlayer(this);
        }
    };
}

export function update(dt, scene)
{
    // Determine control
    const rotControl = scene.player.right - scene.player.left;
    const moveControl = scene.player.down - scene.player.up;
    const fireControl = scene.player.fire;

    // Calculate velocity
    scene.player.dx += moveControl * Math.cos(scene.player.rotation) * PLAYER_MOVE_SPEED;
    scene.player.dy += moveControl * Math.sin(scene.player.rotation) * PLAYER_MOVE_SPEED;
    scene.player.dx *= 1 - PLAYER_MOVE_FRICTION;
    scene.player.dy *= 1 - PLAYER_MOVE_FRICTION;

    // Calculate angular velocity
    scene.player.dr += rotControl * PLAYER_ROT_SPEED;
    scene.player.dr *= 1 - PLAYER_ROT_FRICTION;

    // Calculate position
    scene.player.x += scene.player.dx;
    scene.player.y += scene.player.dy;
    scene.player.rotation += scene.player.dr;

    --scene.player.cooldown;

    // Wrap around
    wrapAround(scene.player, PLAYER_RADIUS * 2, PLAYER_RADIUS * 2);

    // Whether to fire a bullet
    if (fireControl)
    {
        scene.player.shoot();
        scene.flashShootDelta = 1;
    }

    // Whether to spawn thruster particles
    if (moveControl)
    {
        Particles.thrust(scene, scene.player.x, scene.player.y, 
            -moveControl * Math.cos(scene.player.rotation) * PLAYER_MOVE_PARTICLE_DAMP_FACTOR,
            -moveControl * Math.sin(scene.player.rotation) * PLAYER_MOVE_PARTICLE_DAMP_FACTOR, 
            Random.randomChoose.bind(null, PLAYER_MOVE_PARTICLE_COLORS));
    }
}

export function render(ctx, scene)
{
    if (scene.showPlayer)
    {
        ctx.translate(scene.player.x, scene.player.y);
        ctx.rotate(scene.player.rotation);
        ctx.fillStyle = 'white';
        let size = PLAYER_RADIUS;
        ctx.fillRect(-size, -size, size * 2, size * 2);
        let xOffset = -1;
        let yOffset = 0;
        let sizeOffset = 0;
        if (scene.flashShootDelta > 0)
        {
            ctx.fillStyle = `rgb(${200 * scene.flashShootDelta + 55 * Math.sin(performance.now() / (PLAYER_SHOOT_COOLDOWN * 2))}, 0, 0)`;
            scene.flashShootDelta -= FLASH_TIME_STEP;
            sizeOffset = scene.flashShootDelta * 2;
            xOffset = scene.flashShootDelta;
        }
        else
        {
            ctx.fillStyle = 'black';
        }
        ctx.fillRect(-size - sizeOffset / 2 + xOffset, -(size / 4) - sizeOffset / 2 + yOffset, size + sizeOffset, size / 2 + sizeOffset);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    drawCollisionCircle(ctx, scene.player.x, scene.player.y, PLAYER_RADIUS);
}
