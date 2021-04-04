import '@milque/display';
import '@milque/input';
import { OrthographicCamera } from '@milque/scene';
import { mat4 } from 'gl-matrix';

import './error.js';

import { TexturedQuadRenderer } from './renderer/TexturedQuadRenderer.js';
import { ColoredQuadRenderer } from './renderer/ColoredQuadRenderer.js';
import { ASSETS } from './assets/Assets.js';

import * as Player from './Player.js';

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/display').FrameEvent} FrameEvent
 * @typedef {import('@milque/input').InputPort} InputPort
 */

window.addEventListener('DOMContentLoaded', main);

async function main()
{
    /** @type {DisplayPort} */
    const display = document.querySelector('#display');

    /** @type {InputPort} */
    const input = document.querySelector('#input');
    input.src = {
        MoveLeft: [ 'Keyboard:ArrowLeft', 'Keyboard:KeyA' ],
        MoveRight: [ 'Keyboard:ArrowRight', 'Keyboard:KeyD' ],
        MoveUp: [ 'Keyboard:ArrowUp', 'Keyboard:KeyW' ],
        MoveDown: [ 'Keyboard:ArrowDown', 'Keyboard:KeyS' ],
        Interact: [ 'Keyboard:KeyE' ],
        Evade: [ 'Keyboard:Space' ],
    };

    /**
     * @typedef Game
     * @property {DisplayPort} display
     * @property {number} frames
     * @property {InputPort} input
     * @property {object} world
     */

    /** @type {Game} */
    const game = {
        display,
        frames: 0,
        input,
        world: {}
    };

    await GameAssetLoader(game);
    const updater = GameUpdater(game);
    const renderer = GameRenderer(game);
    
    display.addEventListener('frame', e => {
        const frameEvent = /** @type {FrameEvent} */(e);
        const dt = frameEvent.detail.deltaTime / 60;

        updater(dt);
        renderer();
    });
}

/**
 * @param {Game} game 
 */
async function GameAssetLoader(game)
{
    let gl = game.display.canvas.getContext('webgl');
    ASSETS.registerAsset('texture', 'font', 'webgl/font.png', { gl });
    await ASSETS.loadAssets();
}

/**
 * @param {Game} game 
 * @returns {Function}
 */
function GameUpdater(game)
{
    const world = game.world;

    let player = Player.createPlayer(game);
    world.player = player;
    
    return function(dt)
    {
        Player.updatePlayer(player, game, dt);
    };
}

/**
 * @param {Game} game 
 * @returns {Function}
 */
function GameRenderer(game)
{
    /** @type {DisplayPort} */
    const display = game.display;
    
    /** @type {WebGLRenderingContext} */
    let gl = display.canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 0);

    let camera = new OrthographicCamera(-100, -100, 100, 100, 0, 100);
    let projectionViewMatrix = mat4.create();

    let texturedRenderer = new TexturedQuadRenderer(gl);
    let coloredRenderer = new ColoredQuadRenderer(gl);
    
    return function()
    {
        game.frames += 1;
        
        let viewportWidth = gl.canvas.width;
        let viewportHeight = gl.canvas.height;
        gl.viewport(0, 0, viewportWidth, viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT);

        camera.resize(viewportWidth, viewportHeight);
        mat4.multiply(projectionViewMatrix, camera.projectionMatrix, camera.viewMatrix);
        
        texturedRenderer.setProjectionViewMatrix(projectionViewMatrix);
        coloredRenderer.setProjectionViewMatrix(projectionViewMatrix);

        let renderables = [
            Player.renderPlayer(game.world.player),
        ];

        for(let renderable of renderables)
        {
            switch(renderable.renderType)
            {
                case 'textured-quad':
                    {
                        let {
                            sprite = { u: 0, v: 0, s: 0, t: 0 },
                            texture = { handle: null, w: 0, h: 0 },
                            transform = { matrix: mat4.create() },
                            x = 0, y = 0, scaleX = 1, scaleY = 1
                        } = renderable;

                        texturedRenderer
                            .setSprite(sprite.u, sprite.v, sprite.s, sprite.t)
                            .setTexture(texture.handle, texture.w, texture.h)
                            .setTransformationMatrix(transform.matrix)
                            .draw(x, y, scaleX, scaleY);
                    }
                    break;
                case 'colored-quad':
                    {
                        let {
                            color = { r: 0, g: 0, b: 0 },
                            transform = { matrix: mat4.create() },
                            x = 0, y = 0, scaleX = 1, scaleY = 1,
                        } = renderable;

                        coloredRenderer
                            .setColor(color.r, color.g, color.b)
                            .setTransformationMatrix(transform.matrix)
                            .draw(x, y, scaleX, scaleY);
                    }
                    break;
                default:
                    throw new Error('Unkown render type.');
            }
        }
    };
}
