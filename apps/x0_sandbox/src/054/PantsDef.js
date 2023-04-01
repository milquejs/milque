// @ts-ignore
import PANTS_PATH from './pants.png';
import { newDefs } from '../room';

export default newDefs()
    .asset('pants.png').filepath(PANTS_PATH).build()
    .sprite('sp_pants').fromJSON({
        image: 'pants.png',
        width: 128, height: 128,
    }).centered().build()
    .object('obj_pants').sprite('sp_pants').build()
    .build();
