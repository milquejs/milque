import * as CellWorld from './cellworld/main.js';
import * as LaneWorld from './laneworld/main.js';
import * as AcreWorld from './acreworld/main.js';
import * as CartWorld from './cartworld/main.js';

export async function main(game)
{
    // LaneWorld.main(game);
    // CellWorld.main(game);
    await AcreWorld.main(game);
    //await CartWorld.main(game);
}
