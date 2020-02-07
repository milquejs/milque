import { Input } from '@milque/input';
import { EntityManager } from '@milque/entity';
import { Display } from '@milque/display';
import { GameLoop } from '@milque/game';
import { Eventable } from '@milque/util';
import { lerp } from '@milque/math';

const CONTEXT = Input.createContext().disable();
const POS_X = CONTEXT.registerRange('x', 'mouse[pos].x');
const POS_Y = CONTEXT.registerRange('y', 'mouse[pos].y');
/*
// FIXME: This consumes all input for some reason...
export const DOWN = CONTEXT.registerState('down', {
    'mouse.up': 0,
    'mouse.down': 1,
});
*/
const LEFT_DOWN = CONTEXT.registerState('ldown', {
    'mouse[0].up': 0,
    'mouse[0].down': 1,
});
const RIGHT_DOWN = CONTEXT.registerState('rdown', {
    'mouse[2].up': 0,
    'mouse[2].down': 1,
});
const CLICK = CONTEXT.registerAction('click', 'mouse.up');
const LEFT_CLICK = CONTEXT.registerAction('lclick', 'mouse[0].up');
const RIGHT_CLICK = CONTEXT.registerAction('rclick', 'mouse[2].up');

var MouseControls = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CONTEXT: CONTEXT,
    POS_X: POS_X,
    POS_Y: POS_Y,
    LEFT_DOWN: LEFT_DOWN,
    RIGHT_DOWN: RIGHT_DOWN,
    CLICK: CLICK,
    LEFT_CLICK: LEFT_CLICK,
    RIGHT_CLICK: RIGHT_CLICK
});

const CONTEXT$1 = Input.createContext().disable();
const UP = CONTEXT$1.registerState('up', {
    'key[ArrowUp].up': 0,
    'key[ArrowUp].down': 1,
    'key[w].up': 0,
    'key[w].down': 1
});
const DOWN = CONTEXT$1.registerState('down', {
    'key[ArrowDown].up': 0,
    'key[ArrowDown].down': 1,
    'key[s].up': 0,
    'key[s].down': 1
});
const LEFT = CONTEXT$1.registerState('left', {
    'key[ArrowLeft].up': 0,
    'key[ArrowLeft].down': 1,
    'key[a].up': 0,
    'key[a].down': 1
});
const RIGHT = CONTEXT$1.registerState('right', {
    'key[ArrowRight].up': 0,
    'key[ArrowRight].down': 1,
    'key[d].up': 0,
    'key[d].down': 1
});

var MoveControls = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CONTEXT: CONTEXT$1,
    UP: UP,
    DOWN: DOWN,
    LEFT: LEFT,
    RIGHT: RIGHT
});

const CONTEXT$2 = Input.createContext().disable();
const UP$1 = CONTEXT$2.registerState('up', {
    'key[ArrowUp].up': 0,
    'key[ArrowUp].down': 1,
    'key[w].up': 0,
    'key[w].down': 1
});
const DOWN$1 = CONTEXT$2.registerState('down', {
    'key[ArrowDown].up': 0,
    'key[ArrowDown].down': 1,
    'key[s].up': 0,
    'key[s].down': 1
});
const LEFT$1 = CONTEXT$2.registerState('left', {
    'key[ArrowLeft].up': 0,
    'key[ArrowLeft].down': 1,
    'key[a].up': 0,
    'key[a].down': 1
});
const RIGHT$1 = CONTEXT$2.registerState('right', {
    'key[ArrowRight].up': 0,
    'key[ArrowRight].down': 1,
    'key[d].up': 0,
    'key[d].down': 1
});
const ZOOM_IN = CONTEXT$2.registerState('zoomin', {
    'key[z].up': 0,
    'key[z].down': 1
});
const ZOOM_OUT = CONTEXT$2.registerState('zoomout', {
    'key[x].up': 0,
    'key[x].down': 1
});
const ROLL_LEFT = CONTEXT$2.registerState('rollleft', {
    'key[q].up': 0,
    'key[q].down': 1
});
const ROLL_RIGHT = CONTEXT$2.registerState('rollright', {
    'key[e].up': 0,
    'key[e].down': 1
});

function doCameraMove(camera, moveSpeed = 6, zoomSpeed = 0.02, rotSpeed = 0.01)
{
    const xControl = RIGHT$1.value - LEFT$1.value;
    const yControl = DOWN$1.value - UP$1.value;
    const zoomControl = ZOOM_OUT.value - ZOOM_IN.value; 
    const rollControl = ROLL_RIGHT.value - ROLL_LEFT.value;

    // let roll = rollControl * rotSpeed;
    // camera.transform.rotation += roll;

    let scale = (zoomControl * zoomSpeed) + 1;
    let scaleX = camera.transform.scaleX * scale;
    let scaleY = camera.transform.scaleY * scale;
    camera.transform.setScale(scaleX, scaleY);

    let moveX = (xControl * moveSpeed) / scaleX;
    let moveY = (yControl * moveSpeed) / scaleY;
    camera.transform.x += moveX;
    camera.transform.y += moveY;
}

var Camera2DControls = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CONTEXT: CONTEXT$2,
    UP: UP$1,
    DOWN: DOWN$1,
    LEFT: LEFT$1,
    RIGHT: RIGHT$1,
    ZOOM_IN: ZOOM_IN,
    ZOOM_OUT: ZOOM_OUT,
    ROLL_LEFT: ROLL_LEFT,
    ROLL_RIGHT: ROLL_RIGHT,
    doCameraMove: doCameraMove
});

function clearScreen(ctx, width, height)
{
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
}

function drawText(ctx, text, x, y, radians = 0, fontSize = 16, color = 'white')
{
    ctx.translate(x, y);
    if (radians) ctx.rotate(radians);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(text, 0, 0);
    if (radians) ctx.rotate(-radians);
    ctx.translate(-x, -y);
}

const NO_TRANSITION = {};

class SceneManager
{
    constructor()
    {
        this.registry = new Map();
        this.sharedContext = {};

        this._scene = null;
        this._nextScene = null;
        this._nextLoadOpts = null;
        this._nextTransition = null;
    }

    /** Shared contexts are persistent across scenes of this manager. */
    setSharedContext(context)
    {
        this.sharedContext = context;
        return this;
    }

    register(name, scene)
    {
        if (typeof name !== 'string')
        {
            throw new Error('Scene name must be a string.');
        }

        this.registry.set(name, scene);
        return this;
    }

    unregister(name)
    {
        this.registry.delete(name);
        return this;
    }

    nextScene(scene, transition = null, loadOpts = {})
    {
        if (this._nextScene)
        {
            throw new Error('Cannot change scenes during a scene transition.');
        }

        // Whether to check the registry for the associated scene
        if (typeof scene === 'string')
        {
            if (!this.registry.has(scene))
            {
                throw new Error(`Cannot find scene with name '${scene}'.`);
            }

            scene = this.registry.get(scene);
        }

        // For class-like scene structure
        if (typeof scene === 'function')
        {
            scene = new scene();
        }
        // For object-like scene structure (includes modules)
        else if (typeof scene === 'object')
        {
            // Whether the scene is non-extensible and should be converted to an object
            if (!Object.isExtensible(scene))
            {
                scene = createExtensibleSceneFromModule(scene);
            }
        }
        // For anything else...
        else
        {
            throw new Error('Scene type not supported.');
        }

        this._nextScene = scene;
        this._nextLoadOpts = loadOpts;

        // NOTE: Transition MUST NEVER be null while switching scenes as it
        // also serves as the flag to stop scene updates.
        this._nextTransition = transition || NO_TRANSITION;
    }

    update(dt)
    {
        if (this._transition)
        {
            // TODO: Transitions should have their own methods and not just be tiny scenes...
            
            // Waiting for scene load...
            this._updateStep(dt, this._transition);
        }
        else if (this._nextScene)
        {
            // Starting next scene request...
            const nextScene = this._nextScene;
            const nextLoadOpts = this._nextLoadOpts;
            const nextTransition = this._nextTransition;

            this._nextScene = null;
            this._nextLoadOpts = null;
            this._nextTransition = null;

            this._transition = nextTransition;

            let result = Promise.resolve();
            let currentScene = this._scene;
            if (currentScene)
            {
                if ('onStop' in currentScene) currentScene.onStop(this.sharedContext);
                if ('unload' in currentScene) result = result.then(() =>
                    currentScene.unload(this.sharedContext));
            }

            if ('load' in nextScene) result = result.then(() =>
                nextScene.load(this.sharedContext, nextLoadOpts));
            
            result = result.then(() => {
                this._scene = nextScene;
                this._transition = null;

                if ('onStart' in this._scene) this._scene.onStart(this.sharedContext);
            });
        }
        else if (this._scene)
        {
            this._updateStep(dt, this._scene);
        }
    }

    _updateStep(dt, target)
    {
        if ('onPreUpdate' in target) target.onPreUpdate(dt);
        this.emit('preupdate', dt);
        if ('onUpdate' in target) target.onUpdate(dt);
        this.emit('update', dt);
        if ('onPostUpdate' in target) target.onPostUpdate(dt);
        this.emit('postupdate', dt);
    }

    getCurrentScene() { return this._scene; }
    getNextScene() { return this._nextScene; }

    [Symbol.iterator]()
    {
        return this.registry[Symbol.iterator]();
    }
}
Eventable.mixin(SceneManager);

function createExtensibleSceneFromModule(sceneModule)
{
    return {
        ...sceneModule
    };
}

/**
 * This is not required to create a scene. Any object or class
 * with any of the defined functions can be considered a valid
 * scene. This is for ease of use and readability.
 */
class SceneBase
{
    /** @abstract */
    async load(world, opts) {}
    /** @abstract */
    async unload(world) {}

    /** @abstract */
    onStart(world) {}
    /** @abstract */
    onStop(world) {}

    /** @abstract */
    onPreUpdate(dt) {}
    /** @abstract */
    onUpdate(dt) {}
    /** @abstract */
    onPostUpdate(dt) {}
}

/**
 * @module View
 * @version 1.1.0
 * 
 * A view is a section of a world that is drawn onto a section of a
 * display. For every view, there must exist a camera and viewport.
 * However, there could exist multiple cameras in the same view
 * (albeit inactive).
 * 
 * A viewport is the section of the display that shows the content.
 * Since viewports generally change with the display, it is calculated
 * when needed rather than stored. Usually, you only want the full display
 * as a viewport.
 * 
 * A camera is the view in the world space itself. This usually means
 * it has the view and projection matrix. And because of its existance
 * within the world, it is often manipulated to change the world view.
 * 
 * Another way to look at it is that viewports hold the destination
 * dimensions of a view, whilst the camera holds the source transformations
 * that are applied to a view's source canvas (its buffer) dimension.
 * The size of the view buffer should never change (unless game resolution
 * and aspect ratio changes).
 */

/**
 * Creates a view which facilitates rendering from world to screen space.
 */
function createView(width = 640, height = 480)
{
    let { canvas, context } = createViewBuffer(width, height);
    return {
        _canvas: canvas,
        _context: context,
        _width: width,
        _height: height,

        get canvas() { return this._canvas; },
        get context() { return this._context; },

        get width() { return this._width; },
        set width(value)
        {
            this._width = value;
            this._canvas.width = value;
        },
        get height() { return this._height; },
        set height(value)
        {
            this._height = value;
            this._canvas.height = value;
        },
    };
}

function createViewBuffer(width, height)
{
    let canvasElement = document.createElement('canvas');
    canvasElement.width = width;
    canvasElement.height = height;
    canvasElement.style = 'image-rendering: pixelated';
    let canvasContext = canvasElement.getContext('2d');
    canvasContext.imageSmoothingEnabled = false;
    return { canvas: canvasElement, context: canvasContext };
}

function drawBufferToCanvas(
    targetCanvasContext,
    bufferCanvasElement,
    viewPortX = 0,
    viewPortY = 0,
    viewPortWidth = targetCanvasContext.canvas.clientWidth,
    viewPortHeight = targetCanvasContext.canvas.clientHeight)
{
    targetCanvasContext.drawImage(bufferCanvasElement,
        viewPortX, viewPortY, viewPortWidth, viewPortHeight);
}

var View = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createView: createView,
    createViewBuffer: createViewBuffer,
    drawBufferToCanvas: drawBufferToCanvas
});

function setViewTransform(view, camera = undefined)
{
    if (camera)
    {
        view.context.setTransform(...camera.getProjectionMatrix());
        view.context.transform(...camera.getViewMatrix());
    }
    else
    {
        view.context.setTransform(1, 0, 0, 1, 0, 0);
    }
}

var ViewHelper = /*#__PURE__*/Object.freeze({
    __proto__: null,
    setViewTransform: setViewTransform
});

/**
 * A viewport for a display output. This serves as the output dimensions of a view.
 * @param {HTMLElement} canvasElement The output canvas (or the display).
 * @param {RenderingContext} canvasContext The output canvas context.
 */
class ViewPort
{
    constructor(canvasElement, canvasContext)
    {
        this._canvas = canvasElement;
        this._context = canvasContext;
    }

    // NOTE: We use function getters instead of property getters here because
    // this can easily be overridden for a different implementation. These
    // values are expected to support both computed and stored values. Whereas
    // property getters imply a static, or stored, value.

    /** The x position offset in the output. */
    getX() { return 0; }
    /** The y position offset in the output. */
    getY() { return 0; }
    /** The width of the viewport in the output. */
    getWidth() { return this._canvas.clientWidth; }
    /** The height of the viewport in the output. */
    getHeight() { return this._canvas.clientHeight; }
    
    /** The output canvas element. */
    getCanvas() { return this._canvas; }
    /** The output canvas context. */
    getContext() { return this._context; }
}

/**
 * A camera for a view. This serves as the in-world representation of the
 * view. This is usually manipulated to move the world, zoom in, etc.
 */
class AbstractCamera
{
    /** @abstract */
    getProjectionMatrix() { return [1, 0, 0, 1, 0, 0]; }
    /** @abstract */
    getViewMatrix() { return [1, 0, 0, 1, 0, 0]; }
}

var game;

const DEFAULT_VIEW = createView();

function registerScene(name, scene)
{
    if (!game) game = createGame(scene);
    game.scenes.register(name, scene);
}

function start(scene = undefined)
{
    if (!game) game = createGame(scene);
    return game.start();
}

function nextScene(scene, transition = null, loadOpts = {})
{
    game.nextScene(scene, transition, loadOpts);
}

function stop()
{
    game.stop();
}

function getScene()
{
    return game.scenes.getCurrentScene();
}

function createGame(scene)
{
    let result = {
        loop: new GameLoop(),
        scenes: new SceneManager(),
        entities: new EntityManager(),
        _renderTargets: new Map(),
        addRenderTarget(view, renderer = null, viewPort = null, context = null, handle = view)
        {
            this._renderTargets.set(handle, { view, renderer, viewPort, context });
            return this;
        },
        removeRenderTarget(handle)
        {
            this._renderTargets.delete(handle);
            return this;
        },
        clearRenderTargets()
        {
            this._renderTargets.clear();
            return this;
        },
        nextScene(scene, transition = null, loadOpts = {})
        {
            this.scenes.nextScene(scene, transition, loadOpts);
        },
        start()
        {
            this.loop.start();
            return this;
        },
        stop()
        {
            this.loop.stop();
            return this;
        },
        update(dt)
        {
            this.scenes.update(dt);

            // Do render regardless of loading...
            this.render();
        },
        render()
        {
            if (this._renderTargets.size <= 0)
            {
                let scene = this.scenes.getCurrentScene();
                this._renderStep(DEFAULT_VIEW,
                    scene ? scene.onRender : null,
                    null,
                    scene,
                    true);
            }
            else
            {
                // TODO: In the future, renderer should be completely separate from the scene.
                // Perhaps not even handled in Game.js ...
                let scene = this.scenes.getCurrentScene();
                let first = true;
                for(let renderTarget of this._renderTargets.values())
                {
                    let view = renderTarget.view;
                    let renderer = renderTarget.renderer
                        || (scene ? scene.onRender : null);
                    let viewPort = renderTarget.viewPort;
                    let renderContext = renderTarget.context || scene;
                    this._renderStep(view, renderer, viewPort, renderContext, first);
                    first = false;
                }
            }
        },
        _renderStep(view, renderer = null, viewPort = null, renderContext = null, first = true)
        {
            // Reset any transformations...
            view.context.setTransform(1, 0, 0, 1, 0, 0);

            // TODO: Something more elegant please? I don't think we need the flag.
            if (first)
            {
                clearScreen(view.context, view.width, view.height);
            }
            else
            {
                view.context.clearRect(0, 0, view.width, view.height);
            }
            
            if (renderer) renderer.call(renderContext, view.context, view, this.scenes.getCurrentScene());

            // NOTE: The renderer can define a custom viewport to draw to
            if (viewPort)
            {
                drawBufferToCanvas(viewPort.getContext(), view.canvas, viewPort.getX(), viewPort.getY(), viewPort.getWidth(), viewPort.getHeight());
            }
            // TODO: Is there a way to get rid of this?
            else if (Display.getDrawContext())
            {
                drawBufferToCanvas(Display.getDrawContext(), view.canvas);
            }
        }
    };
    result.loop.on('update', result.update.bind(result));
    result.scenes.on('preupdate', () => Input.poll());
    result.scenes.setSharedContext(result);
    result.scenes.nextScene(scene);
    return result;
}

var Game = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DEFAULT_VIEW: DEFAULT_VIEW,
    registerScene: registerScene,
    start: start,
    nextScene: nextScene,
    stop: stop,
    getScene: getScene,
    createGame: createGame
});

const LOAD_TIME = 250;
const FADE_IN_TIME = LOAD_TIME * 0.3;
const FADE_OUT_TIME = LOAD_TIME * 0.9;

const CONTEXT$3 = Input.createContext().disable();
const ANY_KEY = CONTEXT$3.registerAction('continue', 'key.down', 'mouse.down');

class SplashScene
{
    constructor(splashText, nextScene)
    {
        this.splashText = splashText;
        this.nextScene = nextScene;
    }

    /** @override */
    async load(game)
    {
        CONTEXT$3.enable();
    }

    /** @override */
    async unload(game)
    {
        CONTEXT$3.disable();
    }

    /** @override */
    onStart()
    {
        this.time = 0;
    }
    
    /** @override */
    onUpdate(dt)
    {
        this.time += dt;
        // Skip loading...
        if (ANY_KEY.value && this.time > FADE_IN_TIME && this.time < FADE_OUT_TIME)
        {
            this.time = FADE_OUT_TIME;
        }
        // Continue to next scene...
        if (this.time > LOAD_TIME) nextScene(this.nextScene);
    }
    
    /** @override */
    onRender(ctx, view, world)
    {
        let opacity = 0;
        if (world.time < FADE_IN_TIME)
        {
            opacity = world.time / (FADE_IN_TIME);
        }
        else if (world.time > FADE_OUT_TIME)
        {
            opacity = (LOAD_TIME - world.time) / (LOAD_TIME - FADE_OUT_TIME);
        }
        else
        {
            opacity = 1;
        }
        drawText(ctx, this.splashText, view.width / 2, view.height / 2, 0, 16, `rgba(255, 255, 255, ${opacity})`);
    }
}

class Transform2D
{
    constructor(x = 0, y = 0)
    {
        this.matrix = [1, 0, 0, 1, x, y];
    }

    setMatrix(m11, m12, m21, m22, m31, m32)
    {
        this.matrix[0] = m11;
        this.matrix[1] = m12;
        this.matrix[2] = m21;
        this.matrix[3] = m22;
        this.matrix[4] = m31;
        this.matrix[5] = m32;
        return this;
    }

    setPosition(x, y)
    {
        this.matrix[4] = x;
        this.matrix[5] = y;
        return this;
    }

    setRotation(radians)
    {
        this.rotation = radians;
        return this;
    }

    setScale(sx, sy = sx)
    {
        let rsin = Math.sin(this.rotation);
        this.matrix[0] = sx;
        this.matrix[1] = rsin * sy;
        this.matrix[2] = -rsin * sx;
        this.matrix[3] = sy;
        return this;
    }

    // NOTE: This is for ease of access
    get x() { return this.matrix[4]; }
    set x(value) { this.matrix[4] = value; }
    get y() { return this.matrix[5]; }
    set y(value) { this.matrix[5] = value; }
    get rotation() { return Math.atan2(-this.matrix[2], this.matrix[0]); }
    set rotation(value)
    {
        let scaleX = this.scaleX;
        let scaleY = this.scaleY;
        // HACK: Rolling doesn't work...
        value = Math.abs(value);
        this.matrix[1] = Math.sin(value) * scaleY;
        this.matrix[2] = -Math.sin(value) * scaleX;
    }
    get scaleX() { return this.matrix[0]; }
    set scaleX(value)
    {
        let rotation = this.rotation;
        this.matrix[0] = value;
        this.matrix[2] = -Math.sin(rotation) * value;
    }
    get scaleY() { return this.matrix[3]; }
    set scaleY(value)
    {
        let rotation = this.rotation;
        this.matrix[1] = Math.sin(rotation) * value;
        this.matrix[3] = value;
    }

    // NOTE: This supports 2D DOMMatrix manipulation (such as transform() or setTransform())
    get a() { return this.matrix[0]; }
    get b() { return this.matrix[1]; }
    get c() { return this.matrix[2]; }
    get d() { return this.matrix[3]; }
    get e() { return this.matrix[4]; }
    get f() { return this.matrix[5]; }

    // NOTE: This supports array access (such as gl-matrix)
    get 0() { return this.matrix[0]; }
    set 0(value) { this.matrix[0] = value; }
    get 1() { return this.matrix[1]; }
    set 1(value) { this.matrix[1] = value; }
    get 2() { return this.matrix[2]; }
    set 2(value) { this.matrix[2] = value; }
    get 3() { return this.matrix[3]; }
    set 3(value) { this.matrix[3] = value; }
    get 4() { return this.matrix[4]; }
    set 4(value) { this.matrix[4] = value; }
    get 5() { return this.matrix[5]; }
    set 5(value) { this.matrix[5] = value; }
    // NOTE: These should never change for 2D transformations
    get 6() { return 0; }
    get 7() { return 0; }
    get 8() { return 1; }
    get length() { return 9; }
}

class Camera2D extends AbstractCamera
{
    static applyTransform(ctx, camera, viewOffsetX = 0, viewOffsetY = 0)
    {
        camera.setOffset(viewOffsetX, viewOffsetY);
        ctx.setTransform(...camera.getProjectionMatrix());
        ctx.transform(...camera.getViewMatrix());
    }

    static resetTransform(ctx)
    {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    
    static followTarget(camera, target, speed = 1)
    {
        if (target)
        {
            camera.transform.x = lerp(camera.transform.x, target.x, speed);
            camera.transform.y = lerp(camera.transform.y, target.y, speed);
        }
    }

    constructor(offsetX = 0, offsetY = 0, speed = 1)
    {
        super();
        this.target = null;
        this.speed = speed;
        this.transform = new Transform2D();

        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    setOffset(x, y)
    {
        this.offsetX = x;
        this.offsetY = y;
        return this;
    }

    /** @override */
    getProjectionMatrix()
    {
        // NOTE: Scaling must be applied here, instead of the view
        return [this.transform.matrix[0], 0, 0, this.transform.matrix[3],
            this.offsetX, this.offsetY];
    }

    /** @override */
    getViewMatrix()
    {
        let dst = [ ...this.transform.matrix ];
        dst[0] = Math.cos(this.transform.rotation);
        dst[3] = dst[0];
        dst[4] = -dst[4];
        dst[5] = -dst[5];
        return dst;
    }
}

const CELL_SIZE = 32;
const ORIGIN_POINT = new DOMPointReadOnly(0, 0, 0, 1);
const CELL_POINT = new DOMPointReadOnly(CELL_SIZE, CELL_SIZE, 0, 1);
const INV_NATURAL_LOG_2 = 1 / Math.log(2);

function drawWorldGrid(ctx, view, camera)
{
    const viewMatrix = new DOMMatrixReadOnly(camera.getViewMatrix());
    const projMatrix = new DOMMatrixReadOnly(camera.getProjectionMatrix());
    const transformMatrix = projMatrix.multiply(viewMatrix);
    const offsetPoint = transformMatrix.transformPoint(ORIGIN_POINT);
    const cellPoint = transformMatrix.transformPoint(CELL_POINT);

    const minCellWidth = cellPoint.x - offsetPoint.x;
    const minCellHeight = cellPoint.y - offsetPoint.y;
    const maxCellSize = Math.floor((Math.log(view.width) - Math.log(minCellWidth)) * INV_NATURAL_LOG_2);
    
    let cellWidth = Math.pow(2, maxCellSize) * minCellWidth;
    let cellHeight = Math.pow(2, maxCellSize) * minCellHeight;
    if (cellWidth === 0 || cellHeight === 0) return;
    drawGrid(ctx, view, offsetPoint.x, offsetPoint.y, cellWidth, cellHeight, 1, false);
    drawGrid(ctx, view, offsetPoint.x, offsetPoint.y, cellWidth / 2, cellHeight / 2, 3 / 4, false);
    drawGrid(ctx, view, offsetPoint.x, offsetPoint.y, cellWidth / 4, cellHeight / 4, 2 / 4, false);
    drawGrid(ctx, view, offsetPoint.x, offsetPoint.y, cellWidth / 8, cellHeight / 8, 1 / 4, false);
}

function drawWorldTransformGizmo(ctx, view, camera)
{
    const viewMatrix = new DOMMatrixReadOnly(camera.getViewMatrix());
    const worldPoint = viewMatrix.transformPoint(ORIGIN_POINT);
    const fontSize = view.width / CELL_SIZE;
    ctx.fillStyle = '#666666';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `${fontSize}px monospace`;
    ctx.fillText(`(${-Math.floor(worldPoint.x)},${-Math.floor(worldPoint.y)})`, CELL_SIZE, CELL_SIZE);
    drawTransformGizmo(ctx, CELL_SIZE / 4, CELL_SIZE / 4, CELL_SIZE, CELL_SIZE);
}

function drawGrid(ctx, view, offsetX, offsetY, cellWidth = 32, cellHeight = cellWidth, lineWidth = 1, showCoords = false)
{
    ctx.beginPath();
    for(let y = offsetY % cellHeight; y < view.height; y += cellHeight)
    {
        ctx.moveTo(0, y);
        ctx.lineTo(view.width, y);
    }
    for(let x = offsetX % cellWidth; x < view.width; x += cellWidth)
    {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, view.height);
    }
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.lineWidth = 1;

    if (showCoords)
    {
        const fontSize = Math.min(cellWidth / 4, 16);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = `bold ${fontSize}px monospace`;
        ctx.fillStyle = '#333333';

        for(let y = offsetY % cellHeight; y < view.height; y += cellHeight)
        {
            for(let x = offsetX % cellWidth; x < view.width; x += cellWidth)
            {
                ctx.fillText(`(${Math.round((x - offsetX) / cellWidth)},${Math.round((y - offsetY) / cellHeight)})`, x + lineWidth * 2, y + lineWidth * 2);
            }
        }
    }
}

function drawTransformGizmo(ctx, x, y, width, height = width)
{
    const fontSize = width * 0.6;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontSize}px monospace`;

    ctx.translate(x, y);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.strokeStyle = '#FF0000';
    ctx.stroke();
    ctx.fillStyle = '#FF0000';
    ctx.fillText('x', width + fontSize, 0);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.strokeStyle = '#00FF00';
    ctx.stroke();
    ctx.fillStyle = '#00FF00';
    ctx.fillText('y', 0, height + fontSize);

    const zSize = fontSize / 4;
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(-zSize / 2, -zSize / 2, zSize, zSize);
    ctx.fillText('z', fontSize / 2, fontSize / 2);

    ctx.translate(-x, -y);
}

var CameraHelper = /*#__PURE__*/Object.freeze({
    __proto__: null,
    drawWorldGrid: drawWorldGrid,
    drawWorldTransformGizmo: drawWorldTransformGizmo,
    drawGrid: drawGrid,
    drawTransformGizmo: drawTransformGizmo
});

function createSpawner(entityFactory)
{
    return {
        entities: new Set(),
        factory: entityFactory,
        create(...args)
        {
            return this.factory.apply(null, args);
        },
        destroy(entity)
        {
            this.entities.delete(entity);
        },
        spawn(...args)
        {
            let entity = this.create(...args);
            this.entities.add(entity);
            return entity;
        },
        clear()
        {
            this.entities.clear();
        },
        [Symbol.iterator]()
        {
            return this.entities.values();
        }
    };
}

var EntitySpawner = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createSpawner: createSpawner
});

export { AbstractCamera, Camera2D, Camera2DControls, CameraHelper, EntitySpawner, Game, MouseControls, MoveControls, SceneBase, SceneManager, SplashScene, Transform2D, View, ViewHelper, ViewPort };
