import * as CellWorld from './cellworld/main.js';
import * as LaneWorld from './laneworld/main.js';
import * as MuleWorld from './muleworld/main.js';
import * as AcreWorld from './acreworld/main.js';

export async function main(game)
{
    // LaneWorld.main(game);
    // CellWorld.main(game);
    // MuleWorld.main(game);
    await AcreWorld.main(game);
}
