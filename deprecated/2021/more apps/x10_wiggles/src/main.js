import '@milque/display';
import '@milque/input';
import './error.js';

window.addEventListener('DOMContentLoaded', main);

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/input').InputPort} InputPort
 * @typedef {import('@milque/display').FrameEvent} FrameEvent
 */

async function main()
{
    /** @type {DisplayPort} */
    const display = document.querySelector('display-port');
    /** @type {InputPort} */
    const input = document.querySelector('input-port');
    input.src = {
        CursorX: 'Mouse:PosX',
        CursorY: 'Mouse:PosY',
        InteractA: 'Mouse:Button0',
        InteractB: 'Mouse:Button2',
    };

    let player = {
        x: 0,
        y: 0,
        motionX: 0,
        motionY: 0,
    };
    let cursor = {
        targetX: 0,
        targetY: 0,
    };

    let ctx = display.canvas.getContext('2d');
    display.addEventListener('frame', e => {
        let { deltaTime } = /** @type {FrameEvent} */(e).detail;
        let dt = deltaTime / 60;

        if (input.getInputState('InteractA'))
        {
            cursor.targetX = input.getInputState('CursorX') * display.width;
            cursor.targetY = input.getInputState('CursorY') * display.height;
        }

        updatePlayer(dt, cursor, player);

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, display.width, display.height);
        drawPlayer(ctx, player);
    });
}

function updatePlayer(dt, cursor, player)
{
    let moveSpeed = 1;
    let moveFriction = 1 - 0.4;
    let dy = cursor.targetY - player.y;
    let dx = cursor.targetX - player.x;
    let dist = Math.sqrt(dy * dy + dx * dx);
    let dir = Math.atan2(dy, dx);
    if (dist > 4)
    {
        player.motionX += Math.cos(dir) * moveSpeed;
        player.motionY += Math.sin(dir) * moveSpeed;
    }
    player.motionX *= moveFriction;
    player.motionY *= moveFriction;
    player.x += player.motionX;
    player.y += player.motionY;
}

function drawPlayer(ctx, player)
{
    let x = player.x;
    let y = player.y;
    let rx = 8;
    let ry = 8;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - rx, y - ry, rx * 2, ry * 2);
}