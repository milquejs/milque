/**
 * @typedef {import('@milque/input').InputContext} InputContext
 * @typedef {import('./World.js').World} World
 * @typedef {import('../renderer/FixedSpriteGLRenderer2d.js').FixedSpriteGLRenderer2d} Renderer
 */

export class EntityBase
{
    /**
     * @param {World} world 
     */
    onCreate(world)
    {

    }

    onDestroy()
    {

    }

    /** @param {number} dt */
    onUpdate(dt)
    {

    }

    /**
     * @param {InputContext} inputs 
     * @param {number} dt 
     */
    onInputUpdate(inputs, dt)
    {

    }

    onFixedUpdate()
    {

    }

    /**
     * @param {Renderer} r 
     * @param {number} dt 
     */
    onRender(r, dt)
    {

    }
}
