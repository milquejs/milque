// @ts-ignore
import GROUND_PATH from './ground.png';
// @ts-ignore
import GRASS_PATH from './grass.png';
// @ts-ignore
import STONE_PATH from './stone.png';
// @ts-ignore
import HOVEL_PATH from './hovel.png';
import { newDefs } from '../room';

export const GroundDefs = newDefs()
    .asset('ground.png').filepath(GROUND_PATH).build()
    .sprite('sp_ground').image('ground.png', 32, 32).centered().build()
    .object('obj_ground').sprite('sp_ground').build()
    .build();

export const GrassDefs = newDefs()
    .asset('grass.png').filepath(GRASS_PATH).build()
    .sprite('sp_grass').image('grass.png', 16, 16).centered().build()
    .object('obj_grass').sprite('sp_grass').build()
    .build();

export const StoneDefs = newDefs()
    .asset('stone.png').filepath(STONE_PATH).build()
    .sprite('sp_stone').image('stone.png', 8, 8).centered().build()
    .object('obj_stone').sprite('sp_stone').build()
    .build();

export const HovelDefs = newDefs()
    .asset('hovel.png').filepath(HOVEL_PATH).build()
    .sprite('sp_hovel').image('hovel.png', 48, 48).centered().build()
    .sprite('sp_hovel_occupied').image('hovel.png', 48, 48).centered().addFrames(48, 0, 48 * 2, 48, 2).frameSpeed(5).build()
    .object('obj_hovel').sprite('sp_hovel').build()
    .object('obj_hovel_occupied').sprite('sp_hovel_occupied').build()
    .build();
