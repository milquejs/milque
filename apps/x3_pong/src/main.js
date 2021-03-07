import '@milque/display';
import * as Input from '@milque/input';

import * as Player from './Player.js';

window.addEventListener('DOMContentLoaded', main);
window.addEventListener('error', error, true);
window.addEventListener('unhandledrejection', error, true);

function error(e)
{
    if (e instanceof PromiseRejectionEvent)
    {
        window.alert(e.reason.stack);
    }
    else if (e instanceof ErrorEvent)
    {
        window.alert(e.error.stack);
    }
    else
    {
        window.alert(JSON.stringify(e));
    }
}

async function main()
{
    /** @type {import('@milque/display').DisplayPort}  */
    const display = document.querySelector('#display');

    const input = new InputPort(display, INPUT_MAP)
        .addContext(Player.PLAYER_CONTROLS);

    display.addEventListener('frame', e => {
        const dt = e.detail.deltaTime;

        Player.update(world, player);
    });
}
