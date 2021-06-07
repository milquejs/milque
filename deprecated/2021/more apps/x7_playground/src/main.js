import '@milque/display';
import '@milque/input';
import './error.js';

import { vec2, vec3, vec4, mat4, quat } from 'gl-matrix';
import { OrthographicCamera, screenToWorldRay } from '@milque/scene';

import { ASSETS } from './assets/Assets.js';
import { TexturedQuadRenderer } from './renderer/TexturedQuadRenderer.js';
import { ColoredQuadRenderer } from './renderer/ColoredQuadRenderer.js';
import { ChunkMap, TileMap } from './TileMap.js';

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/display').FrameEvent} FrameEvent
 * @typedef {import('@milque/input').InputPort} InputPort
 */

window.addEventListener('DOMContentLoaded', main);

const INPUT_MAP = {
    CursorX: 'Mouse:PosX',
    CursorY: 'Mouse:PosY',
    CursorInteract: 'Mouse:Button0',
};

async function main()
{
    /** @type {DisplayPort} */
    const display = document.querySelector('#display');
    /** @type {InputPort} */
    const input = document.querySelector('#input');
    input.src = INPUT_MAP;
    
    const game = {
        display,
        input,
        world: {},
        assets: {},
        loader: null,
        updater: null,
        renderer: null,
    };

    game.loader = GameLoader(game);
    game.updater = GameUpdater(game);
    game.renderer = GameRenderer(game);

    await game.loader(game);

    display.addEventListener('frame', e => {
        const { deltaTime } = e.detail;
        const dt = deltaTime / 60;

        game.updater(game);
        game.renderer(game);
    });
}

function GameLoader(game)
{
    const world = game.world;
    return async function()
    {
        const gl = game.display.canvas.getContext('webgl');
        ASSETS.registerAsset('texture', 'font', 'cloud/cube.png', { gl });
        await ASSETS.loadAssets();
    };
}

function GameUpdater(game)
{
    const world = game.world;
    return function()
    {
    };
}

function GameRenderer(game)
{
    /** @type {DisplayPort} */
    const display = game.display;
    const world = game.world;

    /** @type {WebGLRenderingContext} */
    const gl = display.canvas.getContext('webgl');
    gl.clearColor(0.1, 0.1, 0.1, 1);
    TexturedQuadRenderer.enableTransparencyBlend(gl);

    const camera = new OrthographicCamera(-10, -10, 10, 10, -10, 10);

    const texturedRenderer = new TexturedQuadRenderer(gl);
    const coloredRenderer = new ColoredQuadRenderer(gl);

    const chunkMap = new ChunkMap(16, 16, 16);
    chunkMap.data.fill(1);

    for(let i = 0; i < chunkMap.length; ++i)
    {
        chunkMap.data[i] = Math.random() > 0.5 ? 1 : 0;
    }

    const UNIT_SCALE = 2;
    const UNIT_WIDTH = 32 / 48 * UNIT_SCALE;
    const UNIT_HEIGHT = 32 / 48 * UNIT_SCALE;
    const UNIT_HALF_WIDTH = UNIT_WIDTH / 2;
    const UNIT_HALF_HEIGHT = UNIT_HEIGHT / 2;
    const UNIT_FOURTH_WIDTH = UNIT_WIDTH / 4;
    const UNIT_FOURTH_HEIGHT = UNIT_HEIGHT / 4;

    let cameraController = {
        dragging: false,
        prevX: 0,
        prevY: 0,
        fromX: 0,
        fromY: 0,
        toX: 0,
        toY: 0,
    };

    return function()
    {
        const viewportWidth = gl.canvas.width;
        const viewportHeight = gl.canvas.height;
        gl.viewport(0, 0, viewportWidth, viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        camera.resize(viewportWidth, viewportHeight);
        
        texturedRenderer
            .setProjectionMatrix(camera.projectionMatrix)
            .setViewMatrix(camera.viewMatrix);
        coloredRenderer
            .setProjectionMatrix(camera.projectionMatrix)
            .setViewMatrix(camera.viewMatrix);
        
        texturedRenderer.setColor(1, 1, 1);
        for(let z = chunkMap.depth - 1; z >= 0; --z)
        {
            for(let y = 0; y < chunkMap.height; ++y)
            {
                for(let x = chunkMap.width - 1; x >= 0; --x)
                {
                    let ux = x * UNIT_HALF_WIDTH + y * UNIT_HALF_WIDTH;
                    let uy = -x * UNIT_FOURTH_HEIGHT + y * UNIT_FOURTH_HEIGHT + z * UNIT_HALF_HEIGHT;
    
                    let drawx = ux;
                    let drawy = uy;
                    if (chunkMap.get(x, y, z) > 0)
                    {
                        texturedRenderer.draw(drawx, drawy, UNIT_SCALE, UNIT_SCALE);
                    }
                }
            }
        }
        
        let screenX = game.input.getInputState('CursorX') * 2 - 1;
        let screenY = 1 - game.input.getInputState('CursorY') * 2;
        let [cursorX, cursorY, cursorZ] = screenToWorld(vec3.create(), [screenX, screenY], camera.projectionMatrix, camera.viewMatrix);

        /*
        let screenX = game.input.getInputState('CursorX') * 2 - 1;
        let screenY = 1 - game.input.getInputState('CursorY') * 2;
        let screen = vec2.fromValues(screenX, screenY);
        let iso = screenToIsometric(vec2.create(), screen, display, UNIT_WIDTH, UNIT_HEIGHT);
        */

        texturedRenderer.setColor(1, 0, 0);
        texturedRenderer.draw(cursorX, cursorY, UNIT_SCALE, UNIT_SCALE);
    };
}

function screenToWorld(out, screen, projectionMatrix, viewMatrix)
{
    let z = 1;
    let normalized = vec3.fromValues(screen[0], screen[1], z);
    let clip = vec4.fromValues(normalized[0], normalized[1], -1, 1);
    let invproj = mat4.invert(mat4.create(), projectionMatrix);
    let eye = vec4.transformMat4(clip, clip, invproj);
    eye[2] = -1;
    eye[3] = 0;
    let invview = mat4.invert(mat4.create(), viewMatrix);
    let world = vec4.transformMat4(eye, eye, invview);
    let world3 = vec3.fromValues(world[0], world[1], world[2]);
    let normalizedWorld = vec3.normalize(world3, world3);
    out[0] = normalizedWorld[0];
    out[1] = normalizedWorld[1];
    out[2] = normalizedWorld[2];
    return out;
}

function screenToIsometric(out, screen, display, unitWidth, unitHeight)
{
    let [ x, y ] = screen;
    out[0] = x * 20;
    out[1] = (1 - y - 1) * 10;
    return out;
}

function cartesianToIsometric(out, cartesian)
{
    let [ x, y ] = cartesian;
    out[0] = x - y;
    out[1] = (x + y) / 2;
    return out;
}

function isometricToCartesian(out, isometric)
{
    let [ x, y ] = isometric;
    out[0] = (2 * y + x) / 2;
    out[1] = (2 * y - x) / 2;
    return out;
}

/*
function dragWithoutScale()
{
    let screenX = game.input.getInputState('CursorX');
    let screenY = game.input.getInputState('CursorY');

    if (game.input.getInputChanged('CursorInteract') > 0)
    {
        cameraController.fromX = screenX;
        cameraController.fromY = screenY;
        
        cameraController.prevX = screenX;
        cameraController.prevY = screenY;
    }
    else if (game.input.getInputChanged('CursorInteract') < 0)
    {
        cameraController.toX = screenX;
        cameraController.toY = screenY;
    }
    else if (game.input.getInputState('CursorInteract'))
    {
        let { prevX, prevY } = cameraController;
        let nextX = screenX;
        let nextY = screenY;
        cameraController.prevX = nextX;
        cameraController.prevY = nextY;
        let aspectRatio = display.height / display.width;
        let sx = 20;
        let sy = sx * aspectRatio;
        let dx = nextX - prevX;
        let dy = nextY - prevY;
        mat4.translate(camera.viewMatrix, camera.viewMatrix, vec3.fromValues(dx * sx, dy * sy, 0));
    }
}

function dragWithWorldRay()
{
    let screenX = game.input.getInputState('CursorX') * 2 - 1;
    let screenY = 1 - game.input.getInputState('CursorY') * 2;
    let [ cursorX, cursorY, cursorZ ] = screenToWorldRay(screenX, screenY, camera.projectionMatrix, camera.viewMatrix);

    if (game.input.getInputChanged('CursorInteract') > 0)
    {
        cameraController.fromX = cursorX;
        cameraController.fromY = cursorY;
        cameraController.prevX = cursorX;
        cameraController.prevY = cursorY;
    }
    else if (game.input.getInputChanged('CursorInteract') < 0)
    {
        cameraController.toX = cursorX;
        cameraController.toY = cursorY;
    }
    else if (game.input.getInputState('CursorInteract'))
    {
        let { prevX, prevY } = cameraController;
        let nextX = cursorX;
        let nextY = cursorY;
        cameraController.prevX = nextX;
        cameraController.prevY = nextY;
        let dx = nextX - prevX;
        let dy = nextY - prevY;
        mat4.translate(camera.viewMatrix, camera.viewMatrix, vec3.fromValues(dx, dy, 0));
    }
}
*/