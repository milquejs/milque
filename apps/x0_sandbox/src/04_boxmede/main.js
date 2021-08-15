import * as CellWorld from './cellworld/main.js';
import * as AcreWorld from './acreworld/main.js';

export async function main(game)
{
    // LaneWorld.main(game);
    // CellWorld.main(game);
    await AcreWorld.main(game);
    //await CartWorld.main(game);
}
