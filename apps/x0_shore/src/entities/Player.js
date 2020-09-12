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
            textureStrip: assets.dungeon.getSubTexture('elf_m_run_anim'),
            offsetY: -8,
        });
    }
}
Player.maskProps = {
    masks: {
        main: {
            rx: 6, ry: 6,
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
