import * as CellWorld from './cellworld/main.js';
import * as LaneWorld from './laneworld/main.js';

export async function main(game)
{
    LaneWorld.main(game);
    // CellWorld.main(game);
}
