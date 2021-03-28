import '@milque/display';
import '@milque/input';
import { OrthographicCamera } from '@milque/scene';
import { mat4 } from 'gl-matrix';

import { TexturedQuadRenderer } from './renderer/TexturedQuadRenderer.js';
import { ColoredQuadRenderer } from './renderer/ColoredQuadRenderer.js';
import * as WebGLTextureLoader from './WebGLTextureLoader.js';

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/display').FrameEvent} FrameEvent
 * @typedef {import('@milque/input').InputPort} InputPort
 */

window.addEventListener('error', error, true);
window.addEventListener('unhandledrejection', error, true);
function error(e)
{
    if (e instanceof PromiseRejectionEvent)
    {
        window.alert(e.reason.stack);
    }
    else if (e instanceof ErrorEvent)
    {
        window.alert(e.error.stack);
    }
    else
    {
        window.alert(JSON.stringify(e));
    }
}

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

    const updater = worldUpdater(game);
    const renderer = worldRenderer(game);
    
    display.addEventListener('frame', e => {
        const frameEvent = /** @type {FrameEvent} */(e);
        const dt = frameEvent.detail.deltaTime / 60;

        updater(dt);
        renderer();
    });
}

/**
 * @param {Game} game 
 * @returns {Function}
 */
function worldUpdater(game)
{
    const world = game.world;

    let player = createPlayer(game);
    world.player = player;
    
    return function(dt)
    {
        updatePlayer(game, player, dt);
    };
}

/**
 * @param {Game} game 
 * @returns {Function}
 */
function worldRenderer(game)
{
    /** @type {DisplayPort} */
    const display = game.display;
    
    /** @type {WebGLRenderingContext} */
    let gl = display.canvas.getContext('webgl');
    gl.clearColor(0, 0, 0, 0);

    let camera = new OrthographicCamera(0, 0, 10, 10, 0, 10);
    let projectionViewMatrix = mat4.create();

    let texture = WebGLTextureLoader.load('color.png', { gl });
    let fontTexture = WebGLTextureLoader.load('webgl/font.png', { gl });

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

        coloredRenderer
            .setColor(0, 1, 0)
            .draw(1, 2, 2, 3);
        coloredRenderer
            .setColor(1, 0, 0)
            .draw(4, 2, 2, 3);

        texturedRenderer
            .setTexture(texture, 16, 16)
            .setSprite(0, 0, 16, 16)
            .draw(0, 0, 1, 1);
        texturedRenderer
            .setTexture(fontTexture, 64, 40)
            .setSprite(0, 0, 8, 8)
            .draw(1, 0, 1, 1);

        texturedRenderer.setTexture(fontTexture, 64, 40);

        // Draw player
        renderPlayer(game, game.world.player, texturedRenderer, fontTexture);
    };
}

/* == PLAYER ===================================================== */

/**
 * @param {Game} game
 */
function createPlayer(game)
{
    let player = {
        x: 0, y: 0,
        motionX: 0,
        motionY: 0,
        renderInfo: {
            u: 56, v: 32,
        }
    };
    return player;
}

/**
 * @param {Game} game
 */
function updatePlayer(game, player, dt)
{
    let input = game.input;
    let moveSpeed = 0.1;
    let friction = 0.3;
    let invFriction = 1 - friction;
    let dx = input.getInputState('MoveRight') - input.getInputState('MoveLeft');
    let dy = input.getInputState('MoveDown') - input.getInputState('MoveUp');
    player.motionX += dx * moveSpeed * dt;
    player.motionY += dy * moveSpeed * dt;
    player.motionX *= invFriction;
    player.motionY *= invFriction;
    player.x += player.motionX;
    player.y += player.motionY;
}

/**
 * @param {Game} game
 */
function renderPlayer(game, player, texturedRenderer, fontTexture)
{
    texturedRenderer
        .setTexture(fontTexture, 64, 40)
        .setSprite(player.renderInfo.u, player.renderInfo.v, 8, 8)
        .draw(player.x, player.y);
}
