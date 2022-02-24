import { Game } from './lib.js';

import * as MainStage from './MainStage.js';

document.title = 'dungeon';

function main()
{
    Game.start(MainStage);
}

main();
