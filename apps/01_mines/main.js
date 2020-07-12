import * as MainScene from './MainScene.js';
import * as MainRender from './MainRender.js';

import * as MinesControls from './MinesControls.js';

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

Maybe:
// Some of the bombs are treasures.
// Either chance it, use a life, or use a scanner.

*/

async function main()
{
    const display = document.querySelector('display-port');
    const input = document.querySelector('input-context');

    const world = { display, input };
    await MainRender.load.call(world);
    MainScene.onStart.call(world);

    display.addEventListener('frame', e => {
        const dt = e.detail.deltaTime / 1000;
        const ctx = e.detail.context;

        MainScene.onPreUpdate.call(world, dt);
        MinesControls.INPUT_CONTEXT.poll();
        MainScene.onUpdate.call(world, dt);

        const view = {
            context: ctx,
            width: display.width,
            height: display.height,
        };
        MainRender.onRender.call(world, view, world);
    });
}

document.addEventListener('DOMContentLoaded', main);
