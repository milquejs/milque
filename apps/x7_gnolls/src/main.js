import '@milque/display';
import '@milque/input';
import { InputContextElement } from '@milque/input';
import { Random } from '@milque/random';

window.addEventListener('DOMContentLoaded', main);

const DISPLAY_WIDTH = 640;
const DISPLAY_HEIGHT = 480;
const INPUT_MAP = {
    MoveLeft: [ 'Keyboard:ArrowLeft', 'Keyboard:KeyA' ],
    MoveRight: [ 'Keyboard:ArrowRight', 'Keyboard:KeyD' ],
    MoveUp: [ 'Keyboard:ArrowUp', 'Keyboard:KeyW' ],
    MoveDown: [ 'Keyboard:ArrowDown', 'Keyboard:KeyS' ],
    Evade: { key: 'Keyboard:Space', event: 'down' },
    Interact: { key: 'Keyboard:KeyE', event: 'down' },
    Interacting: 'Keyboard:KeyE'
};

const HALF_PI = Math.PI / 2;
const FOURTH_PI = Math.PI / 4;
const TWO_PI = Math.PI * 2;

async function main()
{
    /** @type {import('@milque/display').DisplayPort} */
    const display = document.querySelector('#main');
    display.width = DISPLAY_WIDTH;
    display.height = DISPLAY_HEIGHT;

    /** @type {import('@milque/input').InputContextElement} */
    const input = document.querySelector('input-context');
    input.src = INPUT_MAP;

    const ctx = display.canvas.getContext('2d');

    let world = {};

    let player = createPlayer();
    player.x = DISPLAY_WIDTH / 2;
    player.y = DISPLAY_HEIGHT / 2;
    world.player = player;

    let item = createItem(64, 64);
    world.items = [
        item
    ];

    display.addEventListener('frame', e => {
        const dt = e.detail.deltaTime / 60;

        controlPlayer(player, dt, input, world);
        updatePlayer(player, dt);

        updateItem(item, dt);

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);

        drawItem(item, ctx);
        drawPlayer(player, ctx);
    });
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * PLAYERS */

const PLAYER_WIDTH = 16;
const PLAYER_HEIGHT = 20;
const HALF_PLAYER_WIDTH = PLAYER_WIDTH / 2;
const HALF_PLAYER_HEIGHT = PLAYER_HEIGHT / 2;

const PLAYER_SPEED = 2;
const PLAYER_FRICTION = 0.6;
const INV_PLAYER_FRICTION = 1 - PLAYER_FRICTION;

const PLAYER_STEP_SWING_RANGE = Math.PI / 8;
const PLAYER_STEP_SWING_DELTA = HALF_PLAYER_WIDTH / 2;
const PLAYER_STEP_SWING_SPEED = 0.11;

const PLAYER_DASH_DURATION = 10;
const PLAYER_DASH_SPEED_MULTIPLIER = 5;

const PLAYER_INTERACT_RADIUS = 24;

function createPlayer()
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
    };
    return player;
}

function drawPlayer(player, ctx)
{
    let x = Math.trunc(player.x);
    let y = Math.trunc(player.y);

    let mirror = player.facing < 0;
    let dashing = player.dashing;
    let dashRadians = 0;

    if (dashing)
    {
        player.swingProgress = 0;
        dashRadians = mirror ? -HALF_PI + PLAYER_STEP_SWING_RANGE : HALF_PI - PLAYER_STEP_SWING_RANGE;
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
                drawItem(item, ctx);
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
    ctx.fillRect(fx, fy, 4, 4);
    
    ctx.translate(-x, -y);
}

function updatePlayer(player, dt)
{
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
}

function controlPlayer(player, dt, input, world)
{
    let dx = input.getInputValue('MoveRight') - input.getInputValue('MoveLeft');
    let dy = input.getInputValue('MoveDown') - input.getInputValue('MoveUp');
    let dash = input.getInputValue('Evade');
    let interact = input.getInputValue('Interact');
    let interacting = input.getInputValue('Interacting');

    if (interact)
    {
        for(let item of world.items)
        {
            if (intersects(item.x, item.y, 0, player.x, player.y, PLAYER_INTERACT_RADIUS))
            {
                player.holding = item;
                break;
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

/* * * * * * * * * * * * * * * * * * * * * * * * * * ITEMS */

const ITEM_SIZE = 12;
const HALF_ITEM_SIZE = ITEM_SIZE / 2;

function createItem(x, y)
{
    let item = {
        x: x,
        y: y,
    };
    return item;
}

function drawItem(item, ctx)
{
    let x = item.x;
    let y = item.y;
    ctx.translate(x, y);
    {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(-HALF_ITEM_SIZE, -HALF_ITEM_SIZE, ITEM_SIZE, ITEM_SIZE);
    }
    ctx.translate(-x, -y);
}

function updateItem(item, dt)
{
}

function intersects(x1, y1, r1, x2, y2, r2)
{
    let dx = x2 - x1;
    let dy = y2 - y1;
    let radius = r1 + r2;
    let radiusSqu = radius * radius;
    let distanceSqu = dx * dx + dy * dy;
    return distanceSqu < radiusSqu;
}
