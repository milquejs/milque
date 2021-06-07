import { vec2, vec3, mat4 } from 'gl-matrix';
import { TexturedQuadRenderer } from '../renderer/TexturedQuadRenderer.js';
import { OrthographicCamera, screenToWorldRay } from '@milque/scene';

export class ChunkMap
{
    constructor(width, height = width, depth = 1)
    {
        const length = width * height * depth;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.length = length;
        this.data = new Uint32Array(length);
    }

    get(x = 0, y = 0, z = 0)
    {
        return this.data[x + y * this.width + z * this.width * this.height];
    }

    set(x = 0, y = 0, z = 0, value = 1)
    {
        this.data[x + y * this.width + z * this.width * this.height] = value;
    }
}

export function GameRenderer(game)
{
    const display = game.display;
    const world = game.world;

    /** @type {WebGLRenderingContext} */
    const gl = display.canvas.getContext('webgl');
    gl.clearColor(0.1, 0.1, 0.1, 1);
    TexturedQuadRenderer.enableTransparencyBlend(gl);

    const camera = new OrthographicCamera(-10, -10, 10, 10, -10, 10);

    const texturedRenderer = new TexturedQuadRenderer(gl);

    const chunkMap = new ChunkMap(16, 16, 16);
    chunkMap.data.fill(1);

    for(let i = 0; i < chunkMap.length; ++i)
    {
        chunkMap.data[i] = Math.random() > 0.99 ? 1 : 0;
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

        let screenX = game.input.getInputState('CursorX') * 2 - 1;
        let screenY = 1 - game.input.getInputState('CursorY') * 2;
        let [cursorX, cursorY, cursorZ] = screenToWorldRay(vec3.create(), screenX, screenY, camera.projectionMatrix, camera.viewMatrix);

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
        
        texturedRenderer
            .setProjectionMatrix(camera.projectionMatrix)
            .setViewMatrix(camera.viewMatrix);
        
        computeCursor(cursorX, cursorY, chunkMap);

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
                    let tile = chunkMap.get(x, y, z);
                    if (tile > 1)
                    {
                        texturedRenderer.setColor(1, 0, 0);
                    }
                    if (tile > 0)
                    {
                        texturedRenderer.draw(drawx, drawy, UNIT_SCALE, UNIT_SCALE);
                    }

                    if (tile > 1)
                    {
                        texturedRenderer.setColor(1, 1, 1);
                    }
                }
            }
        }

        texturedRenderer.setViewMatrix(mat4.create());
        texturedRenderer.setColor(1, 0, 0);
        texturedRenderer.draw(cursorX - UNIT_WIDTH, cursorY - UNIT_HEIGHT, UNIT_SCALE, UNIT_SCALE);
    };
}

function computeCursor(cursorX, cursorY, chunkMap)
{
    let v = vec2.fromValues(cursorX, cursorY);
    cartesianToIsometric(v, v);
    let [ x, y ] = v;
    console.log(v);
    if (x >= 0 && x < chunkMap.width && y >= 0 && y < chunkMap.height)
    {
        chunkMap.set(x, y, 0, 1);
    }
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