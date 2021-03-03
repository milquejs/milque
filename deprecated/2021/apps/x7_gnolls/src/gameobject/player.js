import { AxisAlignedBoundingBox } from '@app/bounding/AxisAlignedBoundingBox.js';
import { BoundingRadial } from '@app/bounding/BoundingRadial.js';
import { intersectBoundingRadial } from '@app/intersection/BoundingRadialIntersectionSolver.js';

import * as Item from '@app/gameobject/item.js';

const HALF_PI = Math.PI / 2;

export const PLAYER_WIDTH = 16;
export const PLAYER_HEIGHT = 20;
export const HALF_PLAYER_WIDTH = PLAYER_WIDTH / 2;
export const HALF_PLAYER_HEIGHT = PLAYER_HEIGHT / 2;

export const PLAYER_SPEED = 2;
export const PLAYER_FRICTION = 0.6;
export const INV_PLAYER_FRICTION = 1 - PLAYER_FRICTION;

export const PLAYER_STEP_SWING_RANGE = Math.PI / 8;
export const PLAYER_STEP_SWING_DELTA = HALF_PLAYER_WIDTH / 2;
export const PLAYER_STEP_SWING_SPEED = 0.11;

export const PLAYER_DASH_DURATION = 10;
export const PLAYER_DASH_SPEED_MULTIPLIER = 5;

export const PLAYER_INTERACT_RADIUS = 24;

export const PLAYER_MOVE_SHAPE = new AxisAlignedBoundingBox(0, 0, 8, 8);
export const PLAYER_INTERACT_SHAPE = new BoundingRadial(0, 0, PLAYER_INTERACT_RADIUS);

export function createPlayer(world)
{
    let player = {
        x: 0, y: 0,
        radians: 0,

        motionX: 0,
        motionY: 0,

        holding: null,
        facing: 1,
        moving: false,
        dashing: false,
        dashProgress: 0,
        swingProgress: 0,

        interactBody: { ...PLAYER_INTERACT_SHAPE },
    };
    
    return player;
}

export function drawPlayer(player, ctx)
{
    let x = Math.trunc(player.x);
    let y = Math.trunc(player.y);

    let mirror = player.facing < 0;
    let dashing = player.dashing;
    let dashRadians = 0;

    if (dashing)
    {
        player.swingProgress = 0;
        dashRadians = mirror
            ? -HALF_PI + PLAYER_STEP_SWING_RANGE
            : HALF_PI - PLAYER_STEP_SWING_RANGE;
    }
    else
    {
        if (player.moving)
        {
            player.swingProgress += PLAYER_SPEED * PLAYER_STEP_SWING_SPEED;
            player.swingProgress %= Math.PI * 2;
        }
        else
        {
            if (player.swingProgress !== 0)
            {
                if (player.swingProgress > 0.1)
                {
                    player.swingProgress -= PLAYER_STEP_SWING_SPEED * 2;
                }
                else
                {
                    player.swingProgress = 0;
                }
            }
        }
    }

    let swing = (mirror ? -1 : 1) * Math.sin(player.swingProgress);
    let swingRadians = swing * PLAYER_STEP_SWING_RANGE;
    let swingDelta = swing * PLAYER_STEP_SWING_DELTA;

    ctx.translate(x + swingDelta, y);

    // Shadow
    ctx.fillStyle = 'rgba(100, 100, 100, 0.8)';
    ctx.fillRect(-HALF_PLAYER_WIDTH - 3, HALF_PLAYER_HEIGHT - 1, PLAYER_WIDTH + 6, 4);

    ctx.rotate(swingRadians);
    if (dashing) ctx.rotate(dashRadians);
    if (mirror) ctx.scale(-1, 1);
    {
        // Body
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-HALF_PLAYER_WIDTH, -HALF_PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT);

        // Face
        ctx.fillStyle = '#000000';
        ctx.fillRect(3, -HALF_PLAYER_HEIGHT + 6, 2, 4);
        ctx.fillRect(-2, -HALF_PLAYER_HEIGHT + 6, 2, 4);

        // Holding Item
        if (player.holding)
        {
            let item = player.holding;
            let x = -item.x;
            let y = -item.y - HALF_PLAYER_HEIGHT * 1.3;
            ctx.translate(x, y);
            {
                Item.drawItem(item, ctx);
            }
            ctx.translate(-x, -y);
        }
    }
    if (mirror) ctx.scale(-1, 1);
    if (dashing) ctx.rotate(-dashRadians);
    ctx.rotate(-swingRadians);

    // Stop swinging for facing marker
    ctx.translate(-swingDelta, 0);

    // Facing Marker
    let radians = player.radians;
    let fx = Math.cos(radians) * PLAYER_INTERACT_RADIUS;
    let fy = Math.sin(radians) * PLAYER_INTERACT_RADIUS;
    ctx.fillStyle = '#AAAAAA';
    ctx.fillRect(fx - 2, fy - 2, 4, 4);

    // Interaction Body
    /*
    ctx.strokeStyle = '#00FF00';
    ctx.beginPath();
    ctx.arc(0, 0, PLAYER_INTERACT_SHAPE.r, 0, TWO_PI);
    ctx.stroke();
    */

    ctx.translate(-x, -y);
}

export function updatePlayer(player, dt, world)
{
    const { entities } = world;

    let f = Math.pow(INV_PLAYER_FRICTION, dt);
    player.motionX *= f;
    player.motionY *= f;

    let multiplier = 1;
    if (player.dashing)
    {
        multiplier *= PLAYER_DASH_SPEED_MULTIPLIER;
    }

    player.x += player.motionX * multiplier * dt;
    player.y += player.motionY * multiplier * dt;

    player.interactBody.x = player.x;
    player.interactBody.y = player.y;
}

export function controlPlayer(player, dt, world)
{
    const { input, entities } = world;

    let dx = input.getInputValue('MoveRight') - input.getInputValue('MoveLeft');
    let dy = input.getInputValue('MoveDown') - input.getInputValue('MoveUp');
    let dash = input.getInputValue('Evade');
    let interact = input.getInputValue('Interact');
    let interacting = input.getInputValue('Interacting');

    if (interact)
    {
        if (player.holding)
        {
            player.holding = null;
            let item = Item.createItem(world);
            item.x = player.x;
            item.y = player.y;
            entities.items.push(item);
        }
        else
        {
            for(let item of entities.items)
            {
                let result = intersectBoundingRadial(
                    player.interactBody,
                    item.x, item.y, Item.HALF_ITEM_SIZE);
                if (result)
                {
                    player.holding = item;
                    break;
                }
            }
        }
    }
    
    if (player.dashing)
    {
        let dr = player.radians;

        // Move as normal
        let speed = PLAYER_SPEED;
        let rx = Math.cos(dr) * speed;
        let ry = Math.sin(dr) * speed;
        player.motionX += rx;
        player.motionY += ry;
        
        player.moving = true;
        player.dashProgress += 1;
        if (player.dashProgress >= PLAYER_DASH_DURATION)
        {
            player.dashing = false;
        }
    }
    else
    {
        if (dash)
        {
            player.dashing = true;
            player.dashProgress = 0;
        }
        else if (dx || dy)
        {
            let dr = Math.atan2(dy, dx);
            player.radians = dr;
    
            let speed = PLAYER_SPEED;
            let rx = Math.cos(dr) * speed;
            let ry = Math.sin(dr) * speed;
            player.motionX += rx;
            player.motionY += ry;
            player.moving = true;

            let facing = Math.sign(Math.round(rx));
            if (facing !== 0)
            {
                if (player.facing !== facing)
                {
                    player.facing = facing;
                    player.swingProgress = 0;
                }
            }
        }
        else
        {
            player.moving = false;
        }
    }
}
