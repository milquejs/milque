// @ts-ignore
import BUNNY_PATH from './bunny.png';
import { newDefs } from '../room';

export default newDefs()
    .asset('bunny.png').fromJSON({
        filepath: BUNNY_PATH
    }).build()
    .sprite('sp_bunny').fromJSON({
        image: 'bunny.png',
        width: 64, height: 64,
        originX: 32, originY: 32,
        frameSpeed: 10
    }).addFrames(0, 0, 64, 64, 3).build()
    .sprite('sp_bunny_eyes').fromJSON({
        image: 'bunny.png',
        width: 64, height: 64,
        originX: 32, originY: 32,
        frameSpeed: 10
    }).addFrames(64 * 3, 0, 64 * 4, 64, 2).build()
    .object('obj_bunny').fromJSON({
        sprite: 'sp_bunny',
        children: ['obj_bunny_eyes']
    }).build()
    .object('obj_bunny_eyes').fromJSON({
        sprite: 'sp_bunny_eyes'
    }).build()
    .build();
