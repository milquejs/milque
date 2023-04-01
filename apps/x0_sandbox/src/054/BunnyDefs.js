// @ts-ignore
import BUNNY_PATH from './bunny.png';
// @ts-ignore
import BUNNY_OCCUPIED_PATH from './bunny_occupied.png';
// @ts-ignore
import BUNNY_SEATED_PATH from './bunny_seated.png';
import { newDefs } from '../room';

export default newDefs()
    .asset('bunny.png').filepath(BUNNY_PATH).build()
    .asset('bunny_occupied.png').filepath(BUNNY_OCCUPIED_PATH).build()
    .asset('bunny_seated.png').filepath(BUNNY_SEATED_PATH).build()
    .sprite('sp_bunny').fromJSON({
        image: 'bunny.png',
        width: 64, height: 64,
        frameSpeed: 10
    }).centered().addFrames(0, 0, 64, 64, 3).build()
    .sprite('sp_bunny_eyes').fromJSON({
        image: 'bunny.png',
        width: 64, height: 64,
        frameSpeed: 10
    }).centered().addFrames(64 * 3, 0, 64 * 4, 64, 2).build()
    .sprite('sp_bunny_occupied')
        .image('bunny_occupied.png', 64, 64)
        .origin(32, 32)
        .frameSpeed(0.6)
        .addFrames(0, 0, 64, 64, 2)
        .build()
    .sprite('sp_bunny_seated')
        .image('bunny_seated.png', 64, 64)
        .origin(32, 32)
        .frameSpeed(0.6)
        .addFrames(0, 0, 64, 64, 2)
        .build()
    .sprite('sp_bunny_seated_eyes')
        .image('bunny_seated.png', 64, 64)
        .origin(32, 32)
        .frameSpeed(0.6)
        .addFrames(64 * 2, 0, 64 * 3, 64, 2)
        .build()
    .object('obj_bunny').fromJSON({
        sprite: 'sp_bunny',
        children: ['obj_bunny_eyes']
    }).build()
    .object('obj_bunny_eyes').sprite('sp_bunny_eyes').build()
    .object('obj_bunny_occupied').sprite('sp_bunny_occupied').build()
    .object('obj_bunny_seated').addChild('obj_bunny_seated_eyes').sprite('sp_bunny_seated').build()
    .object('obj_bunny_seated_eyes').sprite('sp_bunny_seated_eyes').build()
    .build();
