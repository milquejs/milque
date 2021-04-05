import '@milque/display';
import '@milque/input';
import './error.js';

import { Random } from '@milque/random';

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

    let cursor = {
        x: 0, y: 0,
    };
    world.cursor = cursor;

    let cameraController = {
        prevX: 0,
        prevY: 0,
        nextX: 0,
        nextY: 0,
    };

    let tileMap = new TileMap(16);
    for(let i = 0; i < tileMap.length; ++i)
    {
        tileMap.data[i] = Random.choose([2, 3]);
    }
    let tileMapView = new TileMapView(tileMap, 32, 32);
    world.tileMap = tileMap;
    world.tileMapView = tileMapView;

    return function()
    {
        let screenX = game.input.getInputState('CursorX') * 2 - 1;
        let screenY = 1 - game.input.getInputState('CursorY') * 2;
        let [cursorX, cursorY, cursorZ] = screenToWorldRay(vec3.create(),
            screenX, screenY, camera.projectionMatrix, camera.viewMatrix);
        
        cursor.x = cursorX;
        cursor.y = cursorY;

        if (game.input.getInputChanged('CursorInteract') > 0)
        {
            cameraController.prevX = cursorX;
            cameraController.prevY = cursorY;
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
    };
}

const CURSOR_SIZE = 3;
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

    const m = mat4.create();
    const v = vec2.create();

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
            .setTexture(ASSETS.getAsset('texture', 'monster'), 256, 256)
            .setSpriteVector(0, 0, 32, 48)
            .drawQuad(-32, -64, 0, -1, 1);
        quadRenderer
            .drawQuad(-64, 0, 1);
        
        let cursor = world.cursor;
        QuadRenderer.toggleWireframe(false);
        {
            vec2.set(v, cursor.x, cursor.y);
            mat4.invert(m, camera.viewMatrix);
            vec2.transformMat4(v, v, m);
            cartesianToUnitIsometric(v, v[0], v[1]);
            let tileMapView = world.tileMapView;
            drawTileMap(tileMapView, quadRenderer, v[0], v[1]);
            
            // Draw Cursor
            mat4.identity(quadRenderer.viewMatrix);
            quadRenderer.drawColoredQuad(0xFF00FF, cursor.x, cursor.y, 100, CURSOR_SIZE, CURSOR_SIZE);
        }
        QuadRenderer.toggleWireframe(true);
    };
}

const TILE_WIDTH = 32;
const TILE_HEIGHT = 32;
const TILE_WIDTH_HALF = TILE_WIDTH / 2;
const TILE_HEIGHT_HALF = TILE_HEIGHT / 2;
const TILE_HEIGHT_FOURTH = TILE_HEIGHT / 4;

function drawTileMap(tileMapView, quadRenderer, cursorX, cursorY)
{
    quadRenderer
        .setTexture(ASSETS.getAsset('texture', 'font'), 256, 256)
        .setSpriteVector(34, 0, 33, 33);

    const width = tileMapView.tileMap.width;
    const height = tileMapView.tileMap.height;
    const tileView = tileMapView.at(tileMapView.offsetX, tileMapView.offsetY);
    const tileMap = tileMapView.tileMap;

    const v = vec2.create();
    for(let y = height - 1; y >= 0; --y)
    {
        for(let x = width - 1; x >= 0; --x)
        {
            let value = tileMap.get(x, y);
            switch(value)
            {
                case 0:
                    continue;
                case 1:
                    quadRenderer.setSpriteVector(0, 0, 33, 33);
                    break;
                case 2:
                    quadRenderer.setSpriteVector(34, 0, 33, 33);
                    break;
                case 3:
                    quadRenderer.setSpriteVector(68, 0, 33, 33);
                    break;
                default:
                    continue;
            }
            unitIsometricToCartesian(v, x, y);
            let drawX = v[0];
            let drawY = v[1];
            let isCursor = x === cursorX && y === cursorY;
            if (isCursor)
            {
                quadRenderer.setColorHex(0xFF00FF, 1);
            }
            quadRenderer.drawQuad(drawX, drawY);
            if (isCursor)
            {
                quadRenderer.setColorHex(0x000000, 0);
            }
        }
    }
}

function cartesianToUnitIsometric(out, cartX, cartY)
{
    cartX /= TILE_WIDTH;
    cartY /= TILE_HEIGHT_HALF;
    let isoX = cartX + cartY;
    let isoY = cartY - cartX;
    out[0] = Math.floor(isoX + 1);
    out[1] = Math.floor(isoY + 1);
    return out;
}

function unitIsometricToCartesian(out, isoX, isoY)
{
    let cartX = (isoX - isoY) * TILE_WIDTH_HALF;
    let cartY = (isoX + isoY) * TILE_HEIGHT_FOURTH;
    out[0] = cartX;
    out[1] = cartY;
    return out;
}

class TileMapView
{
    constructor(tileMap, tileWidth, tileHeight, offsetX = 0, offsetY = 0)
    {
        this.tileMap = tileMap;
        this.tileWidthHalf = tileWidth / 2;
        this.tileHeightHalf = tileHeight / 2;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    at(posX, posY)
    {
        let coordX = posX - this.offsetX;
        let coordY = posY - this.offsetY;
        let tx = Math.ceil(((coordX / this.tileWidthHalf) + (coordY / this.tileHeightHalf)) / 2);
        let ty = Math.ceil(((coordY / this.tileHeightHalf) - (coordX / this.tileWidthHalf)) / 2);
        coordX = tx - 1;
        coordY = ty - 1;
        let result = new TileView(this.tileMap, coordX, coordY);
        if (result.isWithinBounds())
        {
            return result;
        }
        else
        {
            return null;
        }
    }
}

class TileView
{
    constructor(tileMap, coordX, coordY)
    {
        this.tileMap = tileMap;
        /** @private */
        this.stride = tileMap.width;
        /** @private */
        this._coordX = coordX;
        /** @private */
        this._coordY = coordY;
        /** @private */
        this._index = coordX * coordY * this.stride;
    }

    isWithinBounds()
    {
        return this._coordX >= 0 && this._coordX < this.tileMap.width
            && this._coordY >= 0 && this._coordY < this.tileMap.height;
    }

    set(coordX, coordY)
    {
        this._coordX = coordX;
        this._coordY = coordY;
        this._index = coordX * coordY * this.stride;
        return this;
    }

    set index(value)
    {
        this._index = value;
        let stride = this.stride;
        this._coordX = value % stride;
        this._coordY = Math.floor(value / stride);
    }

    get index()
    {
        return this._index;
    }

    set coordX(value)
    {
        this._coordX = value;
        this._index = value + this._coordY * this.stride;
    }

    get coordX()
    {
        return this._coordX;
    }

    set coordY(value)
    {
        this._coordY = value;
        this._index = this._coordX + value * this.stride;
    }

    get coordY()
    {
        return this._coordY;
    }

    set value(value)
    {
        this.tileMap.data[this._index] = value;
    }

    get value()
    {
        return this.tileMap.data[this._index];
    }
}

class TileMap
{
    constructor(width, height = width, length = width * height)
    {
        this.width = width;
        this.height = height;
        this.length = length;
        this.data = new Uint32Array(length);
    }

    get(x = 0, y = 0)
    {
        return this.data[x + y * this.width];
    }

    set(x = 0, y = 0, value = 1)
    {
        this.data[x + y * this.width] = value;
    }
}