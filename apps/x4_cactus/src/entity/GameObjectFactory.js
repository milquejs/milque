import { CustomComponentFactory } from './factory/CustomComponentFactory.js';
import { GameObject } from './GameObject.js';

class GameObjectFactory extends CustomComponentFactory
{
    constructor()
    {
        super(GameObject, GameObject.create, GameObject.destroy);
    }
}
