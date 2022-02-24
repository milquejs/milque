import { FixedSpriteGLRenderer2d } from '../renderer/FixedSpriteGLRenderer2d.js';

import { Player } from './Player.js';

/**
 * @typedef {import('../lib/game/Game.js').Game} Game
 * @typedef {import('./EntityBase.js').EntityBase} EntityBase
 * 
 * @typedef RenderContext
 * @property {FixedSpriteGLRenderer2d} renderer
 * @property {number} dt
 */

export class World
{
    constructor(game)
    {
        /** @type {Game} */
        this.game = game;
        /** @type {Array<EntityBase>} */
        this.entities = [];
    }

    async onLoad()
    {
        const { display, assets } = this.game;
        this.renderer = new FixedSpriteGLRenderer2d(display.canvas);
        let toastImage = assets.getAsset('image:toast.png');
        this.renderer.texture(0, toastImage, 'toast');
        let slimeImage = assets.getAsset('image:slime.png');
        this.renderer.texture(1, slimeImage, 'slime');
    }

    spawnEntity(entity)
    {
        this.entities.push(entity);
        entity.onCreate(this);
        return entity;
    }

    onStart()
    {
        const { inputs } = this.game;
        inputs.bindButton('MoveLeft', 'Keyboard', 'KeyA');
        inputs.bindButton('MoveLeft', 'Keyboard', 'ArrowLeft');
        inputs.bindButton('MoveRight', 'Keyboard', 'KeyD');
        inputs.bindButton('MoveRight', 'Keyboard', 'ArrowRight');
        inputs.bindButton('MoveUp', 'Keyboard', 'KeyW');
        inputs.bindButton('MoveUp', 'Keyboard', 'ArrowUp');
        inputs.bindButton('MoveDown', 'Keyboard', 'KeyS');
        inputs.bindButton('MoveDown', 'Keyboard', 'ArrowDown');
        inputs.bindButton('Jump', 'Keyboard', 'Space');
        
        this.player = this.spawnEntity(new Player());
    }

    onFrame(deltaTime)
    {
        const { display } = this.game;
        let dt = deltaTime / 60;
        let r = this.renderer;
        r.resetFrame();
        let scale = display.width / 100;
        r.pushScaling(scale, scale);
        
        /** @type {RenderContext} */
        let ctx = {
            renderer: r,
            dt,
        };
        for(let entity of this.entities)
        {
            entity.onRender(ctx);
        }
        r.draw('toast', 0, 16, 16);
    }

    onUpdate(deltaTime)
    {
        const { inputs } = this.game;
        let dt = deltaTime / 60;
        for(let entity of this.entities)
        {
            entity.onInputUpdate(inputs, dt);
            entity.onUpdate(dt);
        }
    }
    
    onFixedUpdate()
    {
        for(let entity of this.entities)
        {
            entity.onFixedUpdate();
        }
    }
}
