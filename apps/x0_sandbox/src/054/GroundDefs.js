// @ts-ignore
import GROUND_PATH from './ground.png';
// @ts-ignore
import GRASS_PATH from './grass.png';
// @ts-ignore
import STONE_PATH from './stone.png';
import { newDefs } from '../room';

export const GroundDefs = newDefs()
    .asset('ground.png').filepath(GROUND_PATH).build()
    .sprite('sp_ground').image('ground.png', 32, 32).build()
    .object('obj_ground').sprite('sp_ground').build()
    .build();

export const GrassDefs = newDefs()
    .asset('grass.png').filepath(GRASS_PATH).build()
    .sprite('sp_grass').image('grass.png', 16, 16).build()
    .object('obj_grass').sprite('sp_grass').build()
    .build();

export const StoneDefs = newDefs()
    .asset('stone.png').filepath(STONE_PATH).build()
    .sprite('sp_stone').image('stone.png', 8, 8).build()
    .object('obj_stone').sprite('sp_stone').build()
    .build();
