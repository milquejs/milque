import { Utils } from './milque.js';

import * as PlayerControls from './PlayerControls.js';

export const PLAYER_MOVE_SPEED = 0.2;
export const PLAYER_ROT_SPEED = 0.2;
export const MAX_PLAYER_VELOCITY_X = 3;
export const MAX_PLAYER_VELOCITY_Y = 3;
export const PLAYER_BRAKE_FRICTION = 0.1;
export const INV_PLAYER_BRAKE_FRICTION = 1 - PLAYER_BRAKE_FRICTION;

export async function load(assets)
{
    
}

export function create(world, x = 0, y = 0)
{
    let result = {
        x,
        y,
        dx: 0,
        dy: 0,
        rotation: 0,
        brakeMode: false,
    };
    world.players.push(result);
    return result;
}

export function onPreUpdate(dt, world, entities)
{

}

export function onUpdate(dt, world, entities)
{
    let player = entities[0];

    let xControl = PlayerControls.RIGHT.value - PlayerControls.LEFT.value;
    let yControl = PlayerControls.DOWN.value - PlayerControls.UP.value;
    let brakeControl = PlayerControls.BRAKE.value;
    let toggleBrakeControl = PlayerControls.TOGGLE_BRAKE.value;
    
    player.dx += xControl * PLAYER_MOVE_SPEED;
    player.dy += yControl * PLAYER_MOVE_SPEED;
    let moveControl = xControl || yControl;
    if (moveControl)
    {
        if (!xControl) player.dx *= INV_PLAYER_BRAKE_FRICTION;
        if (!yControl) player.dy *= INV_PLAYER_BRAKE_FRICTION;
    }

    if (toggleBrakeControl) player.brakeMode = !player.brakeMode;
    if (!moveControl && player.brakeMode || brakeControl)
    {
        player.dx *= INV_PLAYER_BRAKE_FRICTION;
        player.dy *= INV_PLAYER_BRAKE_FRICTION;
    }

    player.dx = Utils.clampRange(player.dx, -MAX_PLAYER_VELOCITY_X, MAX_PLAYER_VELOCITY_X);
    player.dy = Utils.clampRange(player.dy, -MAX_PLAYER_VELOCITY_Y, MAX_PLAYER_VELOCITY_Y);
    player.x += player.dx;
    player.y += player.dy;

    if (player.dx || player.dy)
    {
        player.rotation = Utils.lookAt2D(player.rotation, Math.atan2(player.dy, player.dx), PLAYER_ROT_SPEED);
    }
}

export function onPostUpdate(dt, world, entities)
{
    
}

export function onRender(view, world, entities)
{
    let ctx = view.context;
    let player = entities[0];
    Utils.drawBox(ctx, player.x, player.y, player.rotation, 16, 16, 'red');
    Utils.drawBox(ctx, player.x, player.y, player.rotation, 12, 4, 'white');
}

export function destroy(world, entity)
{
    world.players.splice(world.players.indexOf(entity), 1);
}

export function unload(assets)
{

}
