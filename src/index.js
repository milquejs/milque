import * as DisplayModule from './module/DisplayModule.js';
import * as InputModule from './module/InputModule.js';
import * as EntityModule from './module/EntityModule.js';

import GameLoop from './GameLoop.js';

const GAME_LOOP = new GameLoop();
GAME_LOOP.on('update', onGameUpdate);

function onGameUpdate()
{
    InputModule.INPUT_MANAGER.poll();
}

export {
    GAME_LOOP as Game,
    DisplayModule as Display,
    InputModule as Input,
    EntityModule as Entity,
};
