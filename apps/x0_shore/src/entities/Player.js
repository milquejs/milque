import { World } from '../World.js';
import { GameObject } from './GameObject.js';

World.require('entityManager');

const RENDERABLE_OPTIONS = { renderType: 'sprite' };
export class Player extends GameObject
{
    constructor()
    {
        super();
        
        const { assets } = World.getWorld();
        this.add('Transform');
        this.add('Motion');
        this.add('Renderable', RENDERABLE_OPTIONS);
        this.add('PlayerControlled', true);
        this.add('Collidable', Player.maskProps);
        this.add('Sprite', {
            textureStrip: assets.dungeon.getTextureStrip('elf_m_run_anim')
        });
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
