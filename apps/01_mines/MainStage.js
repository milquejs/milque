import * as PlayerControls from './PlayerControls.js';
import { Keyboard, Mouse } from '../../packages/input/src/index.js';

/*

What is good in Minesweeper?
- Inherant scaling difficulty as the game progresses (less tiles)
- Clean ruleset
    - Deductive reasoning and arithmetic (best forms of logic for play)
- Replay value (randomized maps)
- Pure form

deterministic, mostly.
High risk / High reward? (sadly, only high risk)

What is bad in minesweeper?
- Doesn't have a progression Curve.
- Don't have low risk options.
- DONT LIKE TIMED TASKS!!!
    - Hard ceiling
- CANNOT BE IMPOSSIBLE TO WIN

*/


export async function load()
{
    this.devices = {
        keyboard: new Keyboard(this.display, [ 'KeyR' ]),
        mouse: new Mouse(this.display.canvas),
    };
    PlayerControls.init(this.devices);
}

export function start()
{

}

export function update(dt)
{
    this.devices.mouse.poll();
    this.devices.keyboard.poll();

    if (PlayerControls.ACTIVATE.value)
    {
        console.log('WOOT');
    }
}

export function render(ctx)
{

}
