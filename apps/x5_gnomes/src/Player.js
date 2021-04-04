import { ASSETS } from './assets/Assets.js';

const PLAYER_SPEED = 1;
const PLAYER_FRICTION = 0.1;
const INV_PLAYER_FRICTION = 1 - PLAYER_FRICTION;

export function createPlayer(game)
{
    let player = {
        x: 0, y: 0,
        motionX: 0,
        motionY: 0,
    };
    return player;
}

export function renderPlayer(player)
{
    let renderInfo = {
        renderType: 'textured-quad',
        x: player.x, y: player.y,
        scaleX: 8, scaleY: 8,
        texture: {
            handle: ASSETS.getAsset('texture', 'font'),
            w: 64,
            h: 40,
        },
        sprite: {
            u: 0, v: 0,
            s: 8, t: 8,
        },
    };
    return renderInfo;
}

export function updatePlayer(player, game, dt)
{
    const input = game.input;

    let dx = input.getInputState('MoveRight') - input.getInputState('MoveLeft');
    let dy = input.getInputState('MoveDown') - input.getInputState('MoveUp');

    let mx, my;
    if (dx || dy)
    {
        let dr = Math.atan2(dy, dx);
        mx = (player.motionX + Math.cos(dr) * PLAYER_SPEED) * INV_PLAYER_FRICTION;
        my = (player.motionY + Math.sin(dr) * PLAYER_SPEED) * INV_PLAYER_FRICTION;
    }
    else
    {
        mx = player.motionX * INV_PLAYER_FRICTION;
        my = player.motionY * INV_PLAYER_FRICTION;
    }

    player.motionX = mx;
    player.motionY = my;
    player.x += mx * dt;
    player.y += my * dt;
}
