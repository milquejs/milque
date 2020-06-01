import * as Random from './Random.js';
import { wrapAround } from './util.js';

import * as FlashAnimation from './FlashAnimation.js';

// import * as Bullets from './Bullets.js';
// import * as Particles from './Particles.js';
// import * as PlayerControls from './PlayerControls.js';

export const PLAYER_MOVE_PARTICLE_OFFSET_RANGE = [-2, 2];
export const PLAYER_MOVE_PARTICLE_DAMP_FACTOR = 1.5;
export const MIN_PLAYER_MOVE_PARTICLE_LIFE_RATIO = 0.1;
export const MAX_PLAYER_MOVE_PARTICLE_LIFE_RATIO = 0.4;

export const PLAYER_EXPLODE_PARTICLE_COLORS = [ 'red', 'red', 'red', 'yellow', 'orange' ];
export const PLAYER_RADIUS = 5;
export const PLAYER_SHOOT_COOLDOWN = 10;
const PLAYER_MOVE_SPEED = 0.02;
const PLAYER_ROT_SPEED = 0.008;
const PLAYER_ROT_FRICTION = 0.1;
const PLAYER_MOVE_FRICTION = 0.001;

const PLAYER_MOVE_PARTICLE_COLORS = [ 'gray', 'darkgray', 'lightgray' ];

export function createPlayer(game)
{
    let result = {
        scene: game,
        x: game.display.width / 2,
        y: game.display.height / 2,
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
        shootFlash: FlashAnimation.createFlashAnimation(),
        shoot()
        {
            Bullets.shootFromPlayer(this);
        }
    };
    return result;
}

export function updatePlayer(game, player, displayWidth, displayHeight)
{
    // Determine control
    const rotControl = PlayerControls.RIGHT.value - PlayerControls.LEFT.value;
    const moveControl = PlayerControls.DOWN.value - PlayerControls.UP.value;
    const fireControl = PlayerControls.FIRE.value;

    // Calculate velocity
    player.dx += moveControl * Math.cos(player.rotation) * PLAYER_MOVE_SPEED;
    player.dy += moveControl * Math.sin(player.rotation) * PLAYER_MOVE_SPEED;
    player.dx *= 1 - PLAYER_MOVE_FRICTION;
    player.dy *= 1 - PLAYER_MOVE_FRICTION;

    // Calculate angular velocity
    player.dr += rotControl * PLAYER_ROT_SPEED;
    player.dr *= 1 - PLAYER_ROT_FRICTION;

    // Calculate position
    player.x += player.dx;
    player.y += player.dy;
    player.rotation += player.dr;

    --player.cooldown;

    // Wrap around
    wrapAround(player, PLAYER_RADIUS * 2, PLAYER_RADIUS * 2, displayWidth, displayHeight);

    // Whether to fire a bullet
    if (fireControl)
    {
        player.shoot();
        FlashAnimation.playFlashAnimation(player.shootFlash);
    }

    // Whether to spawn thruster particles
    if (moveControl)
    {
        Particles.thrust(game, player.x, player.y, 
            -moveControl * Math.cos(player.rotation) * PLAYER_MOVE_PARTICLE_DAMP_FACTOR,
            -moveControl * Math.sin(player.rotation) * PLAYER_MOVE_PARTICLE_DAMP_FACTOR, 
            Random.choose.bind(null, PLAYER_MOVE_PARTICLE_COLORS));
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

        FlashAnimation.updateFlashAnimation(scene.player.shootFlash);
        let flashValue = FlashAnimation.getFlashValue(scene.player.shootFlash);
        if (flashValue > 0)
        {
            ctx.fillStyle = `rgb(${200 * flashValue + 55 * Math.sin(performance.now() / (PLAYER_SHOOT_COOLDOWN * 2))}, 0, 0)`;
            sizeOffset = flashValue * 2;
            xOffset = flashValue;
        }
        else
        {
            ctx.fillStyle = 'black';
        }
        
        ctx.fillRect(-size - sizeOffset / 2 + xOffset, -(size / 4) - sizeOffset / 2 + yOffset, size + sizeOffset, size / 2 + sizeOffset);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    // Lib.drawCollisionCircle(ctx, scene.player.x, scene.player.y, PLAYER_RADIUS);
}
