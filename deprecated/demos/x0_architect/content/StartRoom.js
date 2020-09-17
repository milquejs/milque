import { Room } from '../Room.js';
import { Player } from './Player.js';

export class StartRoom extends Room
{
    /** @override */
    onCreate(world)
    {
        this.createInstance(Player);
    }
}
