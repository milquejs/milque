import * as InputMap from './InputMap.js';
import { Player, PLAYER_INPUT_MAP } from './Player.js';

import { Bullet } from './Bullet.js';
import { Room } from './Room.js';

document.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('display-port');
    const input = document.querySelector('input-context');
    const ctx = display.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    InputMap.hydrateInputMap(PLAYER_INPUT_MAP, input);

    const room = new Room(display.width, display.height, [
        { x: 0, y: 0, object: Player },
        { x: 0, y: 0, object: Bullet },
    ]);
    room.start();

    display.addEventListener('frame', e => {
        const dt = (e.detail.deltaTime / 1000) * 60;

        room.update(dt);

        ctx.clearRect(0, 0, display.width, display.height);

        room.render(ctx);
    });
}
