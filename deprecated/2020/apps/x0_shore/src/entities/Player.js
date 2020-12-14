import { World } from '../World.js';
import { GameObject } from './GameObject.js';
import { Openable } from '../components/Openable.js';
import { Sprite } from '../components/Sprite.js';

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
        this.add('Collidable', Player);
        this.add('Sprite', {
            subTexture: assets.dungeon.getSubTexture('elf_m_run_anim'),
            offsetY: -8,
        });
    }

    onUpdate(dt)
    {
        const { assets, input } = World.getWorld();
        const motion = this.get('Motion');
        let dx = input.getInputValue('moveRight') - input.getInputValue('moveLeft');
        let dy = input.getInputValue('moveDown') - input.getInputValue('moveUp');
        if (dx || dy)
        {
            let dr = Math.atan2(dy, dx);
            let cdr = Math.cos(dr);
            let sdr = Math.sin(dr);
            motion.motionX += cdr * motion.speed;
            motion.motionY += sdr * motion.speed;
            motion.moving = true;
            motion.facing = Math.sign(cdr);
        }
        else
        {
            motion.moving = false;
        }
        let action = input.getInputValue('mainAction');
        if (action)
        {
            const collidable = this.get('Collidable');
            if (collidable.collided)
            {
                const otherId = collidable.target.owner;
                if (this.entityManager.has('Openable', otherId))
                {
                    let openable = this.entityManager.get('Openable', otherId);
                    if (!openable.open)
                    {
                        openable.open = true;   
                        this.entityManager.remove('Solid', otherId);
                        Sprite.change(this.entityManager.get('Sprite', otherId), assets.dungeon.getSubTexture('doors_leaf_opened'));
                    }
                    else
                    {
                        openable.open = false;
                        this.entityManager.add('Solid', otherId);
                        Sprite.change(this.entityManager.get('Sprite', otherId), assets.dungeon.getSubTexture('doors_leaf_closed'));
                    }
                }
            }
        }
    }
}
Player.masks = {
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
};
