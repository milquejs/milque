import { World } from '../World.js';
import { GameObject } from './GameObject.js';

World.require('entityManager');

const RENDERABLE_OPTIONS = { renderType: 'player' };
export class Player extends GameObject
{
    constructor()
    {
        super();
        
        this.add('Transform');
        this.add('Motion');
        this.add('Renderable', RENDERABLE_OPTIONS);
        this.add('PlayerControlled', true);
        this.add('Collidable', Player.maskProps);
    }
}
Player.maskProps = {
    masks: {
        main: {
            rx: 8, ry: 8,
            get(aabb, owner)
            {
                const { entityManager } = World.getWorld();
                const transform = entityManager.get('Transform', owner);
                aabb.x = transform.x;
                aabb.y = transform.y;
            }
        }
    }
};
