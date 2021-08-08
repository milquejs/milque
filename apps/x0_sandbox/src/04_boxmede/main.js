import * as CellWorld from './cellworld/main.js';
import * as LaneWorld from './laneworld/main.js';
import * as MuleWorld from './muleworld/main.js';

export async function main(game)
{
    LaneWorld.main(game);
    // CellWorld.main(game);
    // MuleWorld.main(game);
}
