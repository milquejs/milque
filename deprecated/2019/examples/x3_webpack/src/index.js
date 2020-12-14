import { EntityManager } from '../lib/milque.js';

import * as Player from './Player.js';
import { RainbowColor } from './RainbowColor.js';

var world = {
    entities: new EntityManager(),
};

let button = document.createElement('button');
button.innerHTML = 'Boo.';
button.onclick = onClick;
document.body.appendChild(button);

let player = Player.create(world);

function onClick(e)
{
    let component = world.entities.getComponent(player, RainbowColor);
    component.colors = [];
}

function main(now)
{
    requestAnimationFrame(main);

    let component = world.entities.getComponent(player, RainbowColor);
    button.style.color = component.color;
    button.textContent = component.text;
    if (Math.random() > 0.9)
    {
        let other = component.colors.shift();
        component.colors.push(component.color);
        component.color = other;
    }
}

main(performance.now());

if (module.hot)
{
}
