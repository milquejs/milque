/* eslint-disable no-unused-vars */

/**
 * @typedef {import('../main_scene.js').Game} Game
 */

export class SceneBase
{
    constructor() {}

    /**
     * @abstract
     * @param {Game} game
     */
    async onLoad(game)
    {

    }

    /**
     * @abstract
     * @param {Game} game
     */
    async onUnload(game)
    {
        
    }

    /**
     * @abstract
     * @param {Game} game
     */
    onStart(game)
    {
        
    }

    /**
     * @abstract
     * @param {Game} game
     */
    onStop(game)
    {

    }

    /**
     * @abstract
     * @param {Game} game
     */
    onFrame(game)
    {

    }
}
