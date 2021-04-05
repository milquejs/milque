import '@milque/display';
import '@milque/input';
import './error.js';

import { vec2, vec3, vec4, mat4, quat } from 'gl-matrix';
import { OrthographicCamera, screenToWorldRay } from '@milque/scene';

import { ASSETS } from './assets/Assets.js';
import { QuadRenderer } from './QuadRenderer.js';

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
        CursorX: 'Mouse:PosX',
        CursorY: 'Mouse:PosY',
        CursorInteract: 'Mouse:Button0',
    };
    const assets = {
        texture: {
            monster: 'cloud/monster.png',
            font: 'cloud/cube.png',
        }
    };
    const camera = new OrthographicCamera(-100, -100, 100, 100, -100, 100);
    
    const game = {
        display,
        input,
        camera,
        world: {},
        assets,
        loader: null,
        updater: null,
        renderer: null,
    };

    game.loader = GameLoader(game);
    game.updater = GameUpdater(game);
    game.renderer = GameRenderer(game);

    await game.loader(game);
    display.addEventListener('frame', e => {
        const { deltaTime } = /** @type {FrameEvent} */(e).detail;
        const dt = deltaTime / 60;

        game.updater(game);
        game.renderer(game);
    });
}

function GameLoader(game)
{
    const gl = game.display.canvas.getContext('webgl');

    return async function()
    {
        let opts = { gl };
        for(let assetLoaderType of Object.keys(game.assets))
        {
            let group = game.assets[assetLoaderType];
            for(let assetName of Object.keys(group))
            {
                let url = group[assetName];
                ASSETS.registerAsset(assetLoaderType, assetName, url, opts);
            }
        }
        await ASSETS.loadAssets();
    };
}

function GameUpdater(game)
{
    const {
        world,
        camera,
    } = game;

    return function()
    {
        let screenX = game.input.getInputState('CursorX') * 2 - 1;
        let screenY = 1 - game.input.getInputState('CursorY') * 2;
        let [cursorX, cursorY, cursorZ] = screenToWorldRay(vec3.create(),
            screenX, screenY, camera.projectionMatrix, camera.viewMatrix);
    };
}

function GameRenderer(game)
{
    const {
        display,
        world,
        camera,
    } = game;

    /** @type {WebGLRenderingContext} */
    const gl = display.canvas.getContext('webgl');
    QuadRenderer
        .setClearColor(gl, 0x111111)
        .enableDepthTest(gl)
        .toggleWireframe(true);
    const quadRenderer = new QuadRenderer(gl);

    return function()
    {
        const viewportWidth = gl.canvas.width;
        const viewportHeight = gl.canvas.height;
        gl.viewport(0, 0, viewportWidth, viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        camera.resize(viewportWidth, viewportHeight);

        quadRenderer
            .setProjectionMatrix(camera.projectionMatrix)
            .setViewMatrix(camera.viewMatrix);
        
        quadRenderer
            .setTexture(ASSETS.getAsset('texture', 'font'), 256, 256)
            .setSpriteVector(0, 0, 33, 33)
            .drawQuad(0, 0, 0);

        quadRenderer
            .setTexture(ASSETS.getAsset('texture', 'monster'), 256, 256)
            .setSpriteVector(0, 0, 32, 48)
            .drawQuad(-32, -64, 0);
        quadRenderer
            .drawQuad(-64, 0, 1);
        
        quadRenderer
            .drawColoredQuad(0xFF, 16, 0, 0, 33, 33);
    };
}
