import '@milque/display';
import '@milque/input';

window.addEventListener('DOMContentLoaded', main);

const INPUT_MAP = {
    MoveLeft: [ 'Keyboard:ArrowLeft', 'Keyboard:KeyA' ],
    MoveRight: [ 'Keyboard:ArrowRight', 'Keyboard:KeyD' ],
    MoveUp: [ 'Keyboard:ArrowUp', 'Keyboard:KeyW' ],
    MoveDown: [ 'Keyboard:ArrowDown', 'Keyboard:KeyS' ],
    Evade: 'Keyboard:Space',
};

async function main()
{
    const display = document.querySelector('#main');
    display.width = 640;
    display.height = 480;
    const input = document.querySelector('input-context');
    input.src = INPUT_MAP;

    const ctx = display.canvas.getContext('2d');

    let player = {
        lookX: 0,
        lookY: 0,
        motionX: 0,
        motionY: 0,
        x: 0,
        y: 0,
    };

    display.addEventListener('frame', () => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, display.width, display.height);

        updatePlayer(player, input);
        drawPlayer(player, ctx);
    });
}

function updatePlayer(player, input)
{
    const FRICTION = 0.2;
    const INV_FRICTION = 1 - FRICTION;
    const MOVE_SPEED = 0.3;

    let speed = Math.max(dx, dy);

    let dx = input.getInputValue('MoveRight') - input.getInputValue('MoveLeft');
    let dy = input.getInputValue('MoveDown') - input.getInputValue('MoveUp');

    player.lookX = dx;
    player.lookY = dy;

    player.motionX += dx * MOVE_SPEED;
    player.motionY += dy * MOVE_SPEED;

    player.motionX *= INV_FRICTION;
    player.motionY *= INV_FRICTION;

    player.x += player.motionX;
    player.y += player.motionY;
}

const PLAYER_RADIUS = 8;
function drawPlayer(player, ctx)
{
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(Math.trunc(player.x) - PLAYER_RADIUS, Math.trunc(player.y) - PLAYER_RADIUS, PLAYER_RADIUS * 2, PLAYER_RADIUS * 2);
}