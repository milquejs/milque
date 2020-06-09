import { IntersectionHelper } from './lib.js';

import * as Bullets from './Bullets.js';
import {
    MoveRight,
    MoveLeft,
    MoveDown,
    MoveUp,
    ShootAction,
    ShootPosX,
    ShootPosY,
    PLAYER_INPUT_CONTEXT
} from './PlayerControls.js';

export const PLAYER_RADIUS = 4;
export const MAX_SHOOT_COOLDOWN = 10;

export async function load(world)
{
    PLAYER_INPUT_CONTEXT.attach(document, world.display.canvas);
}

export function create(world, x, y)
{
    let aabb = IntersectionHelper.createAABB(x, y, PLAYER_RADIUS, PLAYER_RADIUS);
    world.intersections.dynamics.push(aabb);

    return {
        x, y,
        shootCooldown: 0,
        aabb,
    };
}

export function update(dt, world, players)
{
    PLAYER_INPUT_CONTEXT.poll();

    let player = players[0];

    // Move logic.
    const moveSpeed = 0.1;
    let dx = MoveRight.value - MoveLeft.value;
    let dy = MoveDown.value - MoveUp.value;

    player.aabb.dx = dx * moveSpeed;
    player.aabb.dy = dy * moveSpeed;

    // Shoot logic.
    if (player.shootCooldown <= 0)
    {
        if (ShootAction.value)
        {
            let pos = world.camera.screenToWorld(
                ShootPosX.value * world.display.width - world.display.width / 2,
                ShootPosY.value * world.display.height - world.display.height / 2);

            let bulletSpeed = 0.1;
            let dx = pos[0] - player.x;
            let dy = pos[1] - player.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            let bullet = Bullets.create(
                player.x,
                player.y,
                (dx / dist) * bulletSpeed,
                (dy / dist) * bulletSpeed);
            world.bullets.push(bullet);

            player.shootCooldown = MAX_SHOOT_COOLDOWN;
        }
    }
    else
    {
        --player.shootCooldown;
    }
}

export function postUpdate(dt, world, players)
{
    let player = players[0];

    player.x = Math.round(player.aabb.x);
    player.y = Math.round(player.aabb.y);
}

export function render(ctx, world, players)
{
    for(let player of players)
    {
        ctx.translate(player.x, player.y);
        ctx.fillStyle = 'red';
        ctx.fillRect(-PLAYER_RADIUS, -PLAYER_RADIUS, PLAYER_RADIUS * 2, PLAYER_RADIUS * 2);
        ctx.translate(-player.x, -player.y);
    }
}
