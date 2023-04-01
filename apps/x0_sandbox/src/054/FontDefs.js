// @ts-ignore
import HAND_FONT_PATH from './hand_font.png';
import { newDefs } from '../room';

export default newDefs()
    .asset('hand_font.png').filepath(HAND_FONT_PATH).build()
    .sprite('sp_font').fromJSON({
        image: 'hand_font.png',
        width: 16, height: 16,
    }).centered()
    .frameSpeed(5).addFrames(0, 0, 16, 16, 48, 8).build()
    .object('obj_font').sprite('sp_font').build()
    .build();
