// @ts-ignore
import CARROT_PATH from './carrot.png';
// @ts-ignore
import CARROT_BITTEN_1_PATH from './carrot_bitten_1.png';
// @ts-ignore
import CARROT_BITTEN_2_PATH from './carrot_bitten_2.png';
import { newDefs } from '../room';

export default newDefs()
    .asset('carrot.png').filepath(CARROT_PATH).build()
    .asset('carrot_bitten_1.png').filepath(CARROT_BITTEN_1_PATH).build()
    .asset('carrot_bitten_2.png').filepath(CARROT_BITTEN_2_PATH).build()
    .sprite('sp_carrot').image('carrot.png', 8, 32).centered().build()
    .sprite('sp_carrot_bitten_1').image('carrot_bitten_1.png', 8, 32).centered().build()
    .sprite('sp_carrot_bitton_2').image('carrot_bitten_2.png', 8, 32).centered().build()
    .object('obj_carrot').sprite('sp_carrot').build()
    .object('obj_carrot_bitten').sprite('sp_carrot_bitten_1').build()
    .build();
