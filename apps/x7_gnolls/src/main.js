import '@milque/display';
import '@milque/input';

import * as Player from './gameobject/player.js';
import * as Item from './gameobject/item.js';
import * as Appliances from './gameobject/appliance.js';

window.addEventListener('DOMContentLoaded', main);

const DISPLAY_WIDTH = 320;
const DISPLAY_HEIGHT = 240;
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

    let world = {
        display,
        input,
        ctx,
        entities: {},
    };

    let player = Player.createPlayer(world);
    player.x = DISPLAY_WIDTH / 2;
    player.y = DISPLAY_HEIGHT / 2;
    world.entities.players = [player];

    let item = Item.createItem(world);
    item.x = 64;
    item.y = 64;
    world.entities.items = [item];

    let dispenser = Appliances.createDispenser(world);
    dispenser.x = 32;
    dispenser.y = 64;
    world.entities.dispensers = [dispenser];

    display.addEventListener('frame', e => {
        const dt = e.detail.deltaTime / 60;

        Player.controlPlayer(player, dt, world);

        Player.updatePlayer(player, dt, world);
        for(let item of world.entities.items)
        {
            Item.updateItem(item, dt, world);
        }

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);

        for(let item of world.entities.items)
        {
            Item.drawItem(item, ctx);
        }
        
        Player.drawPlayer(player, ctx);

        for(let dispenser of world.entities.dispensers)
        {
            Appliances.drawDispenser(ctx, world, dispenser);
        }
    });
}
