(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.Milque = {}));
}(this, (function (exports) { 'use strict';

    var self = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get default () { return self; },
        get Audio () { return Audio; },
        get Random () { return Random; },
        get Game () { return Game; },
        get RandomGenerator () { return RandomGenerator; },
        get SimpleRandomGenerator () { return SimpleRandomGenerator; },
        get Eventable () { return Eventable$1; },
        get View () { return View; },
        get ViewHelper () { return ViewHelper; },
        get ViewPort () { return ViewPort; },
        get AbstractCamera () { return AbstractCamera; },
        get GameLoop () { return GameLoop; },
        get SceneManager () { return SceneManager; },
        get SceneBase () { return SceneBase; },
        get Display () { return _default; },
        get MODE_NOSCALE () { return MODE_NOSCALE; },
        get MODE_CENTER () { return MODE_CENTER; },
        get MODE_FIT () { return MODE_FIT; },
        get MODE_STRETCH () { return MODE_STRETCH; },
        get DisplayPort () { return DisplayPort; },
        get QueryOperator () { return QueryOperator; },
        get ComponentFactory () { return ComponentFactory; },
        get Component () { return ComponentHelper; },
        get Entity () { return EntityHelper; },
        get EntityWrapper () { return EntityWrapper; },
        get HotEntityReplacement () { return HotEntityReplacement; },
        get EntityManager () { return EntityManager; },
        get EntityQuery () { return EntityQuery; },
        get ComponentBase () { return ComponentBase; },
        get TagComponent () { return TagComponent; },
        get EntityComponent () { return EntityComponent$1; },
        get EntityBase () { return EntityBase; },
        get HybridEntity () { return HybridEntity; },
        get HotEntityModule () { return HotEntityModule; },
        get FineDiffStrategy () { return FineDiffStrategy; },
        get InputContext () { return InputContext; },
        get InputSource () { return InputSource; },
        get Input () { return _default$1; },
        get EventKey () { return EventKey; },
        get AbstractInputAdapter () { return AbstractInputAdapter; },
        get ActionInputAdapter () { return ActionInputAdapter; },
        get DOUBLE_ACTION_TIME () { return DOUBLE_ACTION_TIME; },
        get DoubleActionInputAdapter () { return DoubleActionInputAdapter; },
        get RangeInputAdapter () { return RangeInputAdapter; },
        get StateInputAdapter () { return StateInputAdapter; },
        get Keyboard () { return Keyboard; },
        get Mouse () { return Mouse; },
        get Util () { return _default$2; }
    });

    class RandomGenerator
    {
        constructor(seed)
        {
            this._seed = seed;
        }

        get seed() { return this._seed; }

        random() { return Math.random(); }

        randomRange(min, max)
        {
            return this.random() * (max - min) + min;
        }

        randomChoose(choices)
        {
            return choices[Math.floor(this.random() * choices.length)];
        }

        randomSign()
        {
            return this.random() < 0.5 ? -1 : 1;
        }
    }

    // SOURCE: https://gist.github.com/blixt/f17b47c62508be59987b
    class SimpleRandomGenerator extends RandomGenerator
    {
        constructor(seed = 0)
        {
            super(Math.abs(seed % 2147483647));
            
            this._next = this.seed;
        }

        /** @override */
        random()
        {
            this._next = Math.abs(this._next * 16807 % 2147483647 - 1);
            return this._next / 2147483646;
        }
    }

    /**
     * @typedef Eventable
     * @property {function} on
     * @property {function} off
     * @property {function} once
     * @property {function} emit
     */

    /**
     * @version 1.2
     * 
     * # Changelog
     * ## 1.2
     * - Added named exports
     * - Added custom this context
     * - Added some needed explanations for the functions
     * 
     * ## 1.1
     * - Started versioning
     */
    const EventableInstance = {
        /**
         * Registers an event handler to continually listen for the event.
         * 
         * @param {string} event The name of the event to listen for.
         * @param {function} callback The callback function to handle the event.
         * @param {*} [handle = callback] The handle to refer to this registered callback.
         * Used by off() to remove handlers. If none specified, it will use the callback
         * itself as the handle. This must be unique.
         * @return {Eventable} Self for method-chaining.
         */
        on(event, callback, handle = callback)
        {
            let callbacks;
            if (!this.__events.has(event))
            {
                callbacks = new Map();
                this.__events.set(event, callbacks);
            }
            else
            {
                callbacks = this.__events.get(event);
            }

            if (!callbacks.has(handle))
            {
                callbacks.set(handle, callback);
            }
            else
            {
                throw new Error(`Found callback for event '${event}' with the same handle '${handle}'.`);
            }
            return this;
        },

        /**
         * Unregisters an event handler to stop listening for the event.
         * 
         * @param {string} event The name of the event listened for.
         * @param {*} handle The registered handle to refer to the registered
         * callback. If no handle was provided when calling on(), the callback
         * is used as the handle instead.
         * @return {Eventable} Self for method-chaining.
         */
        off(event, handle)
        {
            if (this.__events.has(event))
            {
                const callbacks = this.__events.get(event);
                if (callbacks.has(handle))
                {
                    callbacks.delete(handle);
                }
                else
                {
                    throw new Error(`Unable to find callback for event '${event}' with handle '${handle}'.`);
                }
            }
            else
            {
                throw new Error(`Unable to find event '${event}'.`);
            }
            return this;
        },
        
        /**
         * Registers a one-off event handler to start listening for the next,
         * and only the next, event.
         * 
         * @param {string} event The name of the event to listen for.
         * @param {function} callback The callback function to handle the event.
         * @param {*} [handle = callback] The handle to refer to this registered callback.
         * Used by off() to remove handlers. If none specified, it will use the callback
         * itself as the handle. This must be unique.
         * @return {Eventable} Self for method-chaining.
         */
        once(event, callback, handle = callback)
        {
            const func = (...args) => {
                this.off(event, handle);
                callback.apply(this.__context || this, args);
            };
            return this.on(event, func, handle);
        },

        /**
         * Emits the event with the arguments passed on to the registered handlers.
         * The context of the handlers, if none were initially bound, could be
         * defined upon calling the Eventable's creation function. Otherwise, the
         * handler is called with `this` context of the Eventable instance.
         * 
         * @param {string} event The name of the event to emit.
         * @param  {...any} args Any arguments to pass to registered handlers.
         * @return {Eventable} Self for method-chaining.
         */
        emit(event, ...args)
        {
            if (this.__events.has(event))
            {
                const callbacks = Array.from(this.__events.get(event).values());
                for(const callback of callbacks)
                {
                    callback.apply(this.__context || this, args);
                }
            }
            else
            {
                this.__events.set(event, new Map());
            }
            return this;
        }
    };

    /**
     * Creates an eventable object.
     * 
     * @param {Object} [context] The context used for the event handlers.
     * @return {Eventable} The created eventable object.
     */
    function create(context = undefined)
    {
        const result = Object.create(EventableInstance);
        result.__events = new Map();
        result.__context = context;
        return result;
    }

    /**
     * Assigns the passed-in object with eventable properties.
     * 
     * @param {Object} dst The object to assign with eventable properties.
     * @param {Object} [context] The context used for the event handlers.
     * @return {Eventable} The resultant eventable object.
     */
    function assign(dst, context = undefined)
    {
        const result = Object.assign(dst, EventableInstance);
        result.__events = new Map();
        result.__context = context;
        return result;
    }

    /**
     * Mixins eventable properties into the passed-in class.
     * 
     * @param {Class} targetClass The class to mixin eventable properties.
     * @param {Object} [context] The context used for the event handlers.
     * @return {Class<Eventable>} The resultant eventable-mixed-in class.
     */
    function mixin(targetClass, context = undefined)
    {
        const targetPrototype = targetClass.prototype;
        Object.assign(targetPrototype, EventableInstance);
        targetPrototype.__events = new Map();
        targetPrototype.__context = context;
        return targetPrototype;
    }

    var Eventable = {
        create,
        assign,
        mixin
    };

    var Eventable$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create,
        assign: assign,
        mixin: mixin,
        'default': Eventable
    });

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

    /**
     * @version 1.3.0
     * @description
     * Handles a steady update loop.
     * 
     * # Changelog
     * ## 1.3.0
     * - Removed frameTime in favor of deltaTimeFactor
     * - Moved static start()/stop() for game loop to modules
     * 
     * ## 1.2.0
     * - Fixed incrementing dt on window blur
     * - Fixed large dt on first frame
     * 
     * ## 1.1.0
     * - Added pause and resume
     * 
     * ## 1.0.0
     * - Create GameLoop
     * 
     * @property {Number} prevFrameTime The time of the previous frame in milliseconds.
     * @property {Object} animationFrameHandle The handle for the animation frame request. Used by cancelAnimationRequest().
     * @property {Object} gameContext The context of the game loop to run in.
     * @property {Object} deltaTimeFactor The value multiplied to dt for the update call.
     * @property {Object} started Whether the game has started.
     * @property {Object} paused Whether the game is paused.
     * 
     * @fires start
     * @fires stop
     * @fires pause
     * @fires resume
     * @fires update
     */
    class GameLoop
    {
        constructor(context = {})
        {
            this.prevFrameTime = 0;
            this.animationFrameHandle = null;
            this.started = false;
            this.paused = false;
            this.deltaTimeFactor = 1 / 1000;

            this.gameContext = context;

            this.run = this.run.bind(this);
            this.start = this.start.bind(this);
            this.stop = this.stop.bind(this);
            this.pause = this.pause.bind(this);
            this.resume = this.resume.bind(this);

            // HACK: This overrides Eventable's callback context.
            this.__context = context;
        }

        setDeltaTimeFactor(value)
        {
            this.deltaTimeFactor = value;
            return this;
        }

        /** Runs the game loop. Will call itself. */
        run(now)
        {
            this.animationFrameHandle = requestAnimationFrame(this.run);
            const dt = (now - this.prevFrameTime) * this.deltaTimeFactor;
            this.prevFrameTime = now;

            if (typeof this.gameContext.update === 'function') this.gameContext.update.call(this.gameContext, dt);
            this.emit('update', dt);
        }

        /** Starts the game loop. Calls run(). */
        start()
        {
            if (this.started) throw new Error('Loop already started.');

            // If the window is out of focus, just ignore the time.
            window.addEventListener('focus', this.resume);
            window.addEventListener('blur', this.pause);

            this.prevFrameTime = performance.now();
            this.started = true;

            if (typeof this.gameContext.start === 'function') this.gameContext.start.call(this.gameContext);
            this.emit('start');

            this.run(this.prevFrameTime);
        }

        /** Stops the game loop. */
        stop()
        {
            if (!this.started) throw new Error('Loop not yet started.');

            // If the window is out of focus, just ignore the time.
            window.removeEventListener('focus', this.resume);
            window.removeEventListener('blur', this.pause);

            cancelAnimationFrame(this.animationFrameHandle);
            this.animationFrameHandle = null;
            this.started = false;

            if (typeof this.gameContext.stop === 'function') this.gameContext.stop.call(this.gameContext);
            this.emit('stop');
        }

        /** Pauses the game loop. */
        pause()
        {
            if (!this.started || this.paused) return;

            cancelAnimationFrame(this.animationFrameHandle);
            this.animationFrameHandle = null;
            this.paused = true;

            if (typeof this.gameContext.pause === 'function') this.gameContext.pause.call(this.gameContext);
            this.emit('pause');
        }

        /** Resumes the game loop. */
        resume()
        {
            if (!this.started || !this.pause) return;

            this.prevFrameTime = performance.now();
            this.paused = false;

            if (typeof this.gameContext.resume === 'function') this.gameContext.resume.call(this.gameContext);
            this.emit('resume');

            this.run(this.prevFrameTime);
        }
    }
    mixin(GameLoop);

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
    mixin(SceneManager);

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

    var audioContext = new AudioContext();

    function createSound(filepath, loop = false)
    {
        const result = {
            _playing: false,
            _data: null,
            _source: null,
            play()
            {
                if (!this._data) return;
                if (this._source) this.destroy();

                let source = audioContext.createBufferSource();
                source.loop = loop;
                source.buffer = this._data;
                source.addEventListener('ended', () => {
                    this._playing = false;
                });
                source.connect(audioContext.destination);
                source.start(0);

                this._source = source;
                this._playing = true;
            },
            pause()
            {
                this._source.stop();
                this._playing = false;
            },
            destroy()
            {
                if (this._source) this._source.disconnect();
                this._source = null;
            },
            isPaused()
            {
                return !this._playing;
            }
        };

        fetch(filepath)
            .then(response => response.arrayBuffer())
            .then(buffer => audioContext.decodeAudioData(buffer))
            .then(data => result._data = data);

        return result;
    }

    var Audio = /*#__PURE__*/Object.freeze({
        __proto__: null,
        createSound: createSound
    });

    const DEFAULT_RNG = new RandomGenerator();

    function createRandom(seed = 0)
    {
        return new SimpleRandomGenerator(seed);
    }

    function random()
    {
        return DEFAULT_RNG.random();
    }

    function randomRange(min, max)
    {
        return DEFAULT_RNG.randomRange(min, max);
    }

    function randomChoose(choices)
    {
        return DEFAULT_RNG.randomChoose(choices);
    }

    function randomSign()
    {
        return DEFAULT_RNG.randomSign();
    }

    var Random = /*#__PURE__*/Object.freeze({
        __proto__: null,
        createRandom: createRandom,
        random: random,
        randomRange: randomRange,
        randomChoose: randomChoose,
        randomSign: randomSign
    });

    const GAME_LOOPS = new Map();

    /**
     * Starts a game loop. This is not required to start a loop, but is
     * here for ease of use.
     * 
     * @example
     * let context = {
     *   start() {
     *     // Start code here...
     *   },
     *   update(dt) {
     *     // Update code here...
     *   }
     * };
     * GameLoop.start(context);
     * 
     * @example
     * GameLoop.start()
     *   .on('start', function start() {
     *     // Start code here...
     *   })
     *   .on('update', function update(dt) {
     *     // Update code here...
     *   });
     * 
     * @example
     * let gameLoop = new GameLoop();
     * gameLoop
     *   .on('start', ...)
     *   .on('update', ...)
     *   .on('stop', ...);
     * 
     * @param {Object} [handle] The handle that refers to the registered game
     * loop. If the handle has not been previously registered, it will
     * register the handle with a new game loop, with the handle serving as
     * both the new game loop's handle and context (only if the handle is
     * an object, otherwise, it will create an empty context).
     * 
     * @returns {GameLoop} The started game loop instance.
     */
    function start(handle = undefined)
    {
        let result;
        if (GAME_LOOPS.has(handle))
        {
            throw new Error('Cannot start game loop with duplicate handle.');
        }
        else
        {
            let context;
            if (typeof handle === 'object') context = handle;
            else context = {};

            result = new GameLoop(context);
        }
        GAME_LOOPS.set(handle, result);

        // Start the loop (right after any chained method calls, like event listeners)
        setTimeout(() => result.start(), 0);
        return result;
    }

    /**
     * Stops a game loop. This is not required to stop a loop, but is
     * here for ease of use.
     */
    function stop(handle)
    {
        if (GAME_LOOPS.has(handle))
        {
            let gameLoop = GAME_LOOPS.get(handle);
            gameLoop.stop();
            GAME_LOOPS.delete(handle);
            return gameLoop;
        }

        return null;
    }

    function createGameLoop(context = {})
    {
        return new GameLoop(context);
    }

    var Game = /*#__PURE__*/Object.freeze({
        __proto__: null,
        start: start,
        stop: stop,
        createGameLoop: createGameLoop
    });

    /**
     * @module DisplayPort
     * @version 1.4
     * 
     * # Changelog
     * ## 1.4
     * - Added "stretch" mode
     * 
     * ## 1.3
     * - Changed "topleft" to "noscale"
     * - Changed default size to 640 x 480
     * - Changed "center" and "fit" to fill container instead of viewport
     * - Added "full" property to override and fill viewport
     * 
     * ## 1.2
     * - Moved default values to the top
     * 
     * ## 1.1
     * - Fixed scaling issues when dimensions do not match
     * 
     * ## 1.0
     * - Created DisplayPort
     */

    const MODE_NOSCALE = 'noscale';
    const MODE_CENTER = 'center';
    const MODE_FIT = 'fit';
    const MODE_STRETCH = 'stretch';

    const DEFAULT_MODE = MODE_CENTER;
    const DEFAULT_WIDTH = 640;
    const DEFAULT_HEIGHT = 480;

    const INNER_HTML = `
<label class="hidden" id="title">display-port</label>
<label class="hidden" id="fps">00</label>
<label class="hidden" id="dimension">0x0</label>
<canvas></canvas>`;
    const INNER_STYLE = `
<style>
    :host {
        display: inline-block;
        color: #555555;
    }
    div {
        display: flex;
        position: relative;
        width: 100%;
        height: 100%;
    }
    canvas {
        background: #000000;
        margin: auto;
    }
    label {
        font-family: monospace;
        color: currentColor;
        position: absolute;
    }
    #title {
        left: 0.5rem;
        top: 0.5rem;
    }
    #fps {
        right: 0.5rem;
        top: 0.5rem;
    }
    #dimension {
        left: 0.5rem;
        bottom: 0.5rem;
    }
    .hidden {
        display: none;
    }
    :host([debug]) div {
        outline: 8px dashed rgba(0, 0, 0, 0.4);
        outline-offset: -4px;
        background-color: rgba(0, 0, 0, 0.1);
    }
    :host([mode="${MODE_NOSCALE}"]) canvas {
        margin: 0;
        top: 0;
        left: 0;
    }
    :host([mode="${MODE_FIT}"]), :host([mode="${MODE_CENTER}"]), :host([mode="${MODE_STRETCH}"]) {
        width: 100%;
        height: 100%;
    }
    :host([full]) {
        width: 100vw!important;
        height: 100vh!important;
    }
    :host([disabled]) {
        display: none;
    }
</style>`;

    class DisplayPort extends HTMLElement
    {
        /** @override */
        static get observedAttributes()
        {
            return [
                'width',
                'height',
                'disabled',
                // NOTE: For debuggin purposes...
                'debug',
                // ...listening for built-in attribs...
                'id',
                'class',
            ];
        }

        constructor()
        {
            super();

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = `<div>${INNER_STYLE}${INNER_HTML}</div>`;

            this._canvasElement = this.shadowRoot.querySelector('canvas');
            this._canvasContext = this._canvasElement.getContext('2d');
            this._canvasContext.imageSmoothingEnabled = false;

            this._titleElement = this.shadowRoot.querySelector('#title');
            this._fpsElement = this.shadowRoot.querySelector('#fps');
            this._dimensionElement = this.shadowRoot.querySelector('#dimension');

            this._animationRequestHandle = 0;
            this._prevAnimationFrameTime = 0;

            this._width = DEFAULT_WIDTH;
            this._height = DEFAULT_HEIGHT;

            this.update = this.update.bind(this);
        }

        /** @override */
        connectedCallback()
        {
            if (!this.hasAttribute('mode')) this.mode = DEFAULT_MODE;

            this.updateCanvasSize();
            this.resume();
        }

        /** @override */
        disconnectedCallback()
        {
            this.pause();
        } 

        /** @override */
        attributeChangedCallback(attribute, prev, value)
        {
            switch(attribute)
            {
                case 'width':
                    this._width = value;
                    break;
                case 'height':
                    this._height = value;
                    break;
                case 'disabled':
                    if (value)
                    {
                        this.update(0);
                        this.pause();
                    }
                    else
                    {
                        this.resume();
                    }
                    break;
                // NOTE: For debugging purposes...
                case 'id':
                case 'class':
                    this._titleElement.innerHTML = `display-port${this.className ? '.' + this.className : ''}${this.hasAttribute('id') ? '#' + this.getAttribute('id') : ''}`;
                    break;
                case 'debug':
                    this._titleElement.classList.toggle('hidden', value);
                    this._fpsElement.classList.toggle('hidden', value);
                    this._dimensionElement.classList.toggle('hidden', value);
                    break;
            }
        }

        update(now)
        {
            this._animationRequestHandle = requestAnimationFrame(this.update);

            this.updateCanvasSize();

            // NOTE: For debugging purposes...
            if (this.debug)
            {
                // Update FPS...
                const dt = now - this._prevAnimationFrameTime;
                const frames = dt <= 0 ? '--' : String(Math.round(1000 / dt)).padStart(2, '0');
                this._prevAnimationFrameTime = now;
                if (this._fpsElement.innerText !== frames)
                {
                    this._fpsElement.innerText = frames;
                }

                // Update dimensions...
                if (this.mode === MODE_NOSCALE)
                {
                    let result = `${this._width}x${this._height}`;
                    if (this._dimensionElement.innerText !== result)
                    {
                        this._dimensionElement.innerText = result;
                    }
                }
                else
                {
                    let result = `${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;
                    if (this._dimensionElement.innerText !== result)
                    {
                        this._dimensionElement.innerText = result;
                    }
                }
            }

            this.dispatchEvent(new CustomEvent('frame', { detail: { now, context: this._canvasContext }, bubbles: false, composed: true }));
        }

        pause()
        {
            cancelAnimationFrame(this._animationRequestHandle);
        }

        resume()
        {
            this._animationRequestHandle = requestAnimationFrame(this.update);
        }

        updateCanvasSize()
        {
            let clientRect = this.shadowRoot.host.getBoundingClientRect();
            const clientWidth = clientRect.width;
            const clientHeight = clientRect.height;

            let canvas = this._canvasElement;
            let canvasWidth = this._width;
            let canvasHeight = this._height;

            const mode = this.mode;

            if (mode === MODE_STRETCH)
            {
                canvasWidth = clientWidth;
                canvasHeight = clientHeight;
            }
            else if (mode !== MODE_NOSCALE)
            {
                let flag = clientWidth < canvasWidth || clientHeight < canvasHeight || mode === MODE_FIT;
                if (flag)
                {
                    let ratioX = clientWidth / canvasWidth;
                    let ratioY = clientHeight / canvasHeight;

                    if (ratioX < ratioY)
                    {
                        canvasWidth = clientWidth;
                        canvasHeight = canvasHeight * ratioX;
                    }
                    else
                    {
                        canvasWidth = canvasWidth * ratioY;
                        canvasHeight = clientHeight;
                    }
                }
            }

            canvasWidth = Math.floor(canvasWidth);
            canvasHeight = Math.floor(canvasHeight);

            if (canvas.width !== canvasWidth || canvas.height !== canvasHeight)
            {
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                canvas.style = `width: ${canvasWidth}px; height: ${canvasHeight}px`;

                this.dispatchEvent(new CustomEvent('resize', { detail: { width: canvasWidth, height: canvasHeight }, bubbles: false, composed: true }));
            }
        }

        getCanvas() { return this._canvasElement; }
        getContext() { return this._canvasContext; }

        get width() { return this._width; }
        set width(value) { this.setAttribute('width', value); }

        get height() { return this._height; }
        set height(value) { this.setAttribute('height', value); }

        get mode() { return this.getAttribute('mode'); }
        set mode(value) { this.setAttribute('mode', value); }

        get disabled() { return this.hasAttribute('disabled'); }
        set disabled(value) { if (value) this.setAttribute('disabled', ''); else this.removeAttribute('disabled'); }

        // NOTE: For debugging purposes...
        get debug() { return this.hasAttribute('debug'); }
        set debug(value) { if (value) this.setAttribute('debug', ''); else this.removeAttribute('debug'); }
    }
    window.customElements.define('display-port', DisplayPort);

    /**
     * @module Display
     */

    var canvas;
    var context;

    // Default setup...
    window.addEventListener('DOMContentLoaded', () => {
        if (!canvas)
        {
            let canvasElement = null;
            let canvasContext = null;

            // Try resolve to <display-port> if exists...
            let displayElement = document.querySelector('display-port');
            if (displayElement)
            {
                canvasElement = displayElement.getCanvas();
                canvasContext = displayElement.getContext();
            }
            // Otherwise, find a <canvas> element...
            else
            {
                canvasElement = document.querySelector('canvas');
            }

            if (canvasElement)
            {
                if (!canvasContext) canvasContext = canvasElement.getContext('2d');
                attachCanvas(canvasElement, canvasContext);
            }
        }
    });

    function createCanvas(width = 320, height = width, parentElement = document.body)
    {
        const canvasElement = document.createElement('canvas');
        parentElement.appendChild(canvasElement);
        attachCanvas(canvasElement, width, height);
    }

    function attachCanvas(canvasElement, canvasContext, width = 320, height = width)
    {
        canvas = canvasElement;
        context = canvasContext;
        canvas.width = width;
        canvas.height = height;
    }

    function drawBufferToScreen(ctx, viewportOffsetX = 0, viewportOffsetY = 0, viewportWidth = getClientWidth(), viewportHeight = getClientHeight())
    {
        getDrawContext().drawImage(ctx.canvas, viewportOffsetX, viewportOffsetY, viewportWidth, viewportHeight);
    }

    function getCanvas()
    {
        return canvas;
    }

    function getDrawContext()
    {
        return context;
    }

    function getClientWidth()
    {
        return canvas.clientWidth;
    }

    function getClientHeight()
    {
        return canvas.clientHeight;
    }

    function getClientOffsetX()
    {
        return canvas.offsetLeft;
    }

    function getClientOffsetY()
    {
        return canvas.offsetTop;
    }

    var _default = /*#__PURE__*/Object.freeze({
        __proto__: null,
        createCanvas: createCanvas,
        attachCanvas: attachCanvas,
        drawBufferToScreen: drawBufferToScreen,
        getCanvas: getCanvas,
        getDrawContext: getDrawContext,
        getClientWidth: getClientWidth,
        getClientHeight: getClientHeight,
        getClientOffsetX: getClientOffsetX,
        getClientOffsetY: getClientOffsetY
    });

    function getComponentTypeName$1(componentType)
    {
        return componentType.name || componentType.toString();
    }

    var ComponentHelper = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getComponentTypeName: getComponentTypeName$1
    });

    const OPERATOR$1 = Symbol('operator');
    const HANDLER$1 = Symbol('handler');

    /**
     * NOTE: Intentionally does not depend on the "entityManager" to exist in order to be created.
     */
    class EntityQuery
    {
        static select(entityManager, components)
        {
            return new EntityQuery(components, false).select(entityManager);
        }

        static computeKey(components)
        {
            let result = [];
            for(let component of components)
            {
                if (typeof component === 'object' && OPERATOR$1 in component)
                {
                    result.push(component[OPERATOR$1].toString() + getComponentTypeName$1(component));
                }
                else
                {
                    result.push(getComponentTypeName$1(component));
                }
            }
            return result.sort().join('-');
        }

        constructor(components, persistent = true)
        {
            this._included = [];
            this._operated = {};

            for(let component of components)
            {
                if (typeof component === 'object' && OPERATOR$1 in component)
                {
                    const operator = component[OPERATOR$1];
                    if (operator in this._operated)
                    {
                        this._operated[operator].components.push(component.component);
                    }
                    else
                    {
                        this._operated[operator] = {
                            components: [component.component],
                            handler: component[HANDLER$1],
                        };
                    }
                }
                else
                {
                    this._included.push(component);
                }
            }

            this.entityManager = null;
            this.persistent = persistent;
            this.entityIds = new Set();

            this.key = EntityQuery.computeKey(components);

            this.onEntityCreate = this.onEntityCreate.bind(this);
            this.onEntityDestroy = this.onEntityDestroy.bind(this);
            this.onComponentAdd = this.onComponentAdd.bind(this);
            this.onComponentRemove = this.onComponentRemove.bind(this);
        }

        matches(entityManager, entityId)
        {
            if (this.entityManager !== entityManager) return false;
            if (!entityManager.hasComponent(entityId, ...this._included)) return false;
            for(let operatedInfo of Object.getOwnPropertyNames(this._operated))
            {
                if (!operatedInfo[HANDLER$1].call(this, entityManager, entityId, operatedInfo.components))
                {
                    return false;
                }
            }
            return true;
        }

        select(entityManager)
        {
            let flag = this.entityManager === entityManager;
            if (this.persistent && flag) return this.entityIds;
            
            const prevEntityManager = this.entityManager;
            this.entityManager = entityManager;
            this.entityIds.clear();

            for(let entityId of entityManager.getEntityIds())
            {
                if (this.matches(entityManager, entityId))
                {
                    this.entityIds.add(entityId);
                }
            }

            if (this.persistent && !flag)
            {
                if (prevEntityManager)
                {
                    prevEntityManager.entityHandler.off('create', this.onEntityCreate);
                    prevEntityManager.entityHandler.off('destroy', this.onEntityDestroy);
                    prevEntityManager.componentHandler.off('add', this.onComponentAdd);
                    prevEntityManager.componentHandler.off('remove', this.onComponentRemove);
                }

                this.entityManager.entityHandler.on('create', this.onEntityCreate);
                this.entityManager.entityHandler.on('destroy', this.onEntityDestroy);
                this.entityManager.componentHandler.on('add', this.onComponentAdd);
                this.entityManager.componentHandler.on('remove', this.onComponentRemove);
            }

            return this.entityIds;
        }

        selectComponent(entityManager, component = this._included[0])
        {
            let result = this.select(entityManager);
            let dst = [];
            for(let entityId of result)
            {
                dst.push(entityManager.getComponent(entityId, component));
            }
            return dst;
        }

        clear()
        {
            if (this.persistent)
            {
                this.entityManager.entityHandler.off('create', this.onEntityCreate);
                this.entityManager.entityHandler.off('destroy', this.onEntityDestroy);
                this.entityManager.componentHandler.off('add', this.onComponentAdd);
                this.entityManager.componentHandler.off('remove', this.onComponentRemove);
            }

            this.entityIds.clear();
            this.entityManager = null;
        }

        onEntityCreate(entityId)
        {
            if (this.matches(this.entityManager, entityId))
            {
                this.entityIds.add(entityId);
            }
        }

        onEntityDestroy(entityId)
        {
            if (this.entityIds.has(entityId))
            {
                this.entityIds.delete(entityId);
            }
        }

        onComponentAdd(entityId, componentType, component, initialValues)
        {
            this.onComponentRemove(entityId, componentType, component);
        }
        
        // NOTE: Could be further optimized if we know it ONLY contains includes, etc.
        onComponentRemove(entityId, componentType, component)
        {
            if (this.matches(this.entityManager, entityId))
            {
                this.entityIds.add(entityId);
            }
            else if (this.entityIds.has(entityId))
            {
                this.entityIds.delete(entityId);
            }
        }
    }

    /**
     * @fires destroy
     */
    class EntityHandler
    {
        constructor()
        {
            this._entities = new Set();
            this._nextAvailableEntityId = 1;
            this._listeners = new Map();
        }

        /**
         * Adds a listener for entity events that occur for the passed-in id.
         * 
         * @param {EntityId} entityId The associated id for the entity to listen to.
         * @param {String} eventType The event type to listen for.
         * @param {Function} listener The listener function that will be called when the event occurs.
         * @param {Object} [opts] Additional options.
         * @param {Boolean} [opts.once=false] Whether the listener should be invoked at most once after being
         * added. If true, the listener would be automatically removed when invoked.
         * @param {Function|String|*} [opts.handle=listener] The handle to uniquely identify the listener. If set,
         * this will be used instead of the function instance. This is usful for anonymous functions, since
         * they are always unique and therefore cannot be removed, causing an unfortunate memory leak.
         */
        addEntityListener(entityId, eventType, listener, opts = undefined)
        {
            const handle = opts && typeof opts.handle !== 'undefined' ? opts.handle : listener;
            
            if (this._listeners.has(entityId))
            {
                let eventMap = this._listeners.get(entityId);
                if (eventType in eventMap)
                {
                    let listeners = eventMap[eventType];
                    listeners.set(handle, listener);
                }
                else
                {
                    let listeners = new Map();
                    listeners.set(handle, listener);
                    eventMap[eventType] = listeners;
                }
            }
            else
            {
                let onces = new Set();
                let listeners = new Map();
                listeners.set(handle, listener);
                if (opts.once) onces.add(handle);
                let eventMap = {
                    onces,
                    [eventType]: listeners
                };
                this._listeners.set(entityId, eventMap);
            }
        }

        /**
         * Removes the listener from the entity with the passed-in id.
         * 
         * @param {EntityId} entityId The associated id for the entity to remove from.
         * @param {String} eventType The event type to remove from.
         * @param {Function|String|*} handle The listener handle that will be called when the event occurs.
         * Usually, this is the function itself.
         * @param {Object} [opts] Additional options.
         */
        removeEntityListener(entityId, eventType, handle, opts = undefined)
        {
            if (this._listeners.has(entityId))
            {
                let eventMap = this._listeners.get(entityId);
                if (eventType in eventMap)
                {
                    eventMap[eventType].delete(handle);
                    if (eventMap.onces.has(handle))
                    {
                        eventMap.onces.delete(handle);
                    }
                }
            }
        }

        /**
         * Dispatches an event to all the entity's listeners.
         * 
         * @param {EntityId} entityId The id of the entity.
         * @param {String} eventType The type of the dispatched event.
         * @param {Array} [eventArgs] An array of arguments to be passed to the listeners.
         */
        dispatchEntityEvent(entityId, eventType, eventArgs = undefined)
        {
            if (this._listeners.has(entityId))
            {
                let eventMap = this._listeners.get(entityId);
                if (eventType in eventMap)
                {
                    let onces = eventMap.onces;
                    let listeners = eventMap[eventType];
                    for(let [handle, listener] of listeners.entries())
                    {
                        listener.apply(undefined, eventArgs);
                        if (onces.has(handle))
                        {
                            listeners.delete(handle);
                        }
                    }
                }
            }
        }

        addEntityId(entityId)
        {
            this._entities.add(entityId);
        }

        deleteEntityId(entityId)
        {
            this._entities.delete(entityId);
            this.dispatchEntityEvent(entityId, 'destroy', [ entityId ]);
        }
        
        getNextAvailableEntityId()
        {
            return this._nextAvailableEntityId++;
        }

        getEntityIds()
        {
            return this._entities;
        }
    }

    /** Cannot be directly added through world.addComponent(). Must be create with new EntityComponent(). */
    class EntityComponent$1
    {
        constructor(world)
        {
            if (!world)
            {
                throw new Error('Cannot create entity in null world.');
            }

            const id = world.createEntity();

            // Skip component creation, as we will be using ourselves :D
            world.componentHandler.putComponent(id, EntityComponent$1, this, undefined);
            
            this.id = id;
        }

        /** @override */
        copy(values) { throw new Error('Unsupported operation; cannot be initialized by existing values.'); }
        
        /** @override */
        reset() { return false; }
    }

    /**
     * @fires componentadd
     * @fires componentremove
     */
    class ComponentHandler
    {
        constructor(entityHandler)
        {
            this._entityHandler = entityHandler;
            this.componentTypeInstanceMap = new Map();
        }

        createComponent(componentType, initialValues)
        {
            let component;

            // Instantiate the component...
            let type = typeof componentType;
            if (type === 'object')
            {
                // NOTE: Although this checks the prototype chain on EVERY add, it only
                // checks on the class object, which should NOT have a chain.
                if (!('create' in componentType))
                {
                    throw new Error(`Instanced component class '${getComponentTypeName(componentType)}' must at least have a create() function.`);
                }

                component = componentType.create(this);
            }
            else if (type === 'function')
            {
                // HACK: This is a hack debugging tool to stop wrong use.
                if (componentType.prototype instanceof EntityComponent$1)
                {
                    throw new Error('This component cannot be added to an existing entity; it can only initialize itself.');
                }

                component = new componentType(this);
            }
            else if (type === 'symbol')
            {
                // NOTE: Symbols lose their immutability when converted into a component
                // (their equality is checked by their toString() when computing its key)
                throw new Error('Symbols are not yet supported as components.');
            }
            else
            {
                // NOTE: This means that these can be numbers and strings.
                // HOWEVER, I caution against using numbers. Numbers can often be confused
                // with other operations (particularly when computation is involved).
                component = componentType;
            }

            // Initialize the component...
            if (initialValues)
            {
                this.copyComponent(componentType, component, initialValues);
            }
            
            return component;
        }

        putComponent(entityId, componentType, component, initialValues)
        {
            let componentInstanceMap;
            if (this.componentTypeInstanceMap.has(componentType))
            {
                componentInstanceMap = this.componentTypeInstanceMap.get(componentType);
            }
            else
            {
                this.componentTypeInstanceMap.set(componentType, componentInstanceMap = new Map());
            }

            if (componentInstanceMap.has(entityId))
            {
                throw new Error(`Cannot add more than one instance of component class '${getComponentTypeName(componentType)}' for entity '${entityId}'.`);
            }

            componentInstanceMap.set(entityId, component);

            this._entityHandler.dispatchEntityEvent(entityId, 'componentadd', [entityId, componentType, component, initialValues]);
        }

        deleteComponent(entityId, componentType, component)
        {
            this.componentTypeInstanceMap.get(componentType).delete(entityId);
        
            let reusable;
            // It's a tag. No reuse.
            if (componentType === component)
            {
                reusable = false;
            }
            // Try user-defined static reset...
            else if ('reset' in componentType)
            {
                reusable = componentType.reset(component);
            }
            // Try user-defined instance reset...
            else if ('reset' in component)
            {
                reusable = component.reset();
            }
            // Try default reset...
            else
            {
                // Do nothing. It cannot be reset.
                reusable = false;
            }

            this._entityHandler.dispatchEntityEvent(entityId, 'componentremove', [entityId, componentType, component]);
            return component;
        }

        copyComponent(componentType, component, targetValues)
        {
            // It's a tag. No need to copy.
            if (componentType === component)
            {
                return;
            }
            // Try user-defined static copy...
            else if ('copy' in componentType)
            {
                componentType.copy(component, targetValues);
            }
            // Try user-defined instance copy...
            else if ('copy' in component)
            {
                component.copy(targetValues);
            }
            // Try default copy...
            else
            {
                for(let key of Object.getOwnPropertyNames(targetValues))
                {
                    component[key] = targetValues[key];
                }
            }
        }

        hasComponentType(componentType)
        {
            return this.componentTypeInstanceMap.has(componentType);
        }

        getComponentTypes()
        {
            return this.componentTypeInstanceMap.keys();
        }

        getComponentInstanceMapByType(componentType)
        {
            return this.componentTypeInstanceMap.get(componentType);
        }

        getComponentInstanceMaps()
        {
            return this.componentTypeInstanceMap.values();
        }
    }

    /**
     * @typedef EntityId
     * The unique id for every entity in a world.
     */

    /**
     * Manages all entities.
     */
    class EntityManager
    {
        constructor()
        {
            this.entityHandler = new EntityHandler();
            this.componentHandler = new ComponentHandler(this.entityHandler);
        }

        clear()
        {
            for(let entityId of this.entityHandler.getEntityIds())
            {
                this.destroyEntity(entityId);
            }
        }

        /** Creates a unique entity with passed-in components (without initial values). */
        createEntity(...components)
        {
            const entityId = this.entityHandler.getNextAvailableEntityId();
            this.entityHandler.addEntityId(entityId);

            for(let component of components)
            {
                this.addComponent(entityId, component);
            }
            return entityId;
        }

        /** Destroys the passed-in entity (and its components). */
        destroyEntity(entityId)
        {
            // Remove entity components from world
            for(let componentType of this.componentHandler.getComponentTypes())
            {
                if (this.componentHandler.getComponentInstanceMapByType(componentType).has(entityId))
                {
                    this.removeComponent(entityId, componentType);
                }
            }

            // Remove entity from world
            this.entityHandler.deleteEntityId(entityId);
        }

        getEntityIds()
        {
            return this.entityHandler.getEntityIds();
        }
        
        /**
         * 
         * @param {import('./Entity.js').EntityId} entityId The id of the entity to add to.
         * @param {FunctionConstructor|import('./Component.js').ComponentFactory|String|Number} componentType The component type.
         * Can either be a component class or a component factory.
         * @param {Object} [initialValues] The initial values for the component. Can be an object
         * map of all defined key-value pairs or another instance of the same component. This
         * must be undefined for tag-like components.
         */
        addComponent(entityId, componentType, initialValues = undefined)
        {
            try
            {
                let component = this.componentHandler.createComponent(componentType, initialValues);
                this.componentHandler.putComponent(entityId, componentType, component, initialValues);
                return component;
            }
            catch(e)
            {
                console.error(`Failed to add component '${getComponentTypeName$1(componentType)}' to entity '${entityId}'.`);
                console.error(e);
            }
        }
        
        removeComponent(entityId, componentType)
        {
            try
            {
                let component = this.getComponent(entityId, componentType);
                this.componentHandler.deleteComponent(entityId, componentType, component);
                return component;
            }
            catch(e)
            {
                console.error(`Failed to remove component '${getComponentTypeName$1(componentType)}' from entity '${entityId}'.`);
                console.error(e);
            }
        }

        clearComponents(entityId)
        {
            for(let componentInstanceMap of this.componentHandler.getComponentInstanceMaps())
            {
                if (componentInstanceMap.has(entityId))
                {
                    let component = componentInstanceMap.get(entityId);
                    this.componentHandler.deleteComponent(entityId, componentType, component);
                }
            }
        }

        getComponentTypesByEntityId(entityId)
        {
            let dst = [];
            for(let componentType of this.componentHandler.getComponentTypes())
            {
                let componentInstanceMap = this.componentHandler.getComponentInstanceMapByType(componentType);
                if (componentInstanceMap.has(entityId))
                {
                    dst.push(componentType);
                }
            }
            return dst;
        }

        getComponent(entityId, componentType)
        {
            return this.componentHandler.getComponentInstanceMapByType(componentType).get(entityId);
        }

        hasComponent(entityId, ...componentTypes)
        {
            for(let componentType of componentTypes)
            {
                if (!this.componentHandler.hasComponentType(componentType)) return false;
                if (!this.componentHandler.getComponentInstanceMapByType(componentType).has(entityId)) return false;
            }
            return true;
        }

        countComponents(entityId)
        {
            let count = 0;
            for(let componentInstanceMap of this.componentHandler.getComponentInstanceMaps())
            {
                if (componentInstanceMap.has(entityId))
                {
                    ++count;
                }
            }
            return count;
        }

        /**
         * Immediately find entity ids by its components. This is simply an alias for Query.select().
         * @param {Array<Component>} components The component list to match entities to.
         * @returns {Iterable<EntityId>} A collection of all matching entity ids.
         */
        find(components)
        {
            return EntityQuery.select(this, components);
        }

        [Symbol.iterator]()
        {
            return this.getEntityIds()[Symbol.iterator]();
        }
    }

    function createQueryOperator(handler, key = Symbol(handler.name))
    {
        let result = function(componentType) {
            return { [OPERATOR]: key, [HANDLER]: handler, component: componentType };
        };
        // Dynamic renaming of function for debugging purposes
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
        Object.defineProperty(result, 'name', {
            value: name,
            configurable: true,
        });
        return result;
    }

    const Not = createQueryOperator(
        function NotOperator(world, entityId, componentTypees)
        {
            return !(world.hasComponent(entityId, ...componentTypees));
        },
        Symbol('!')
    );

    var QueryOperator = /*#__PURE__*/Object.freeze({
        __proto__: null,
        createQueryOperator: createQueryOperator,
        Not: Not
    });

    /**
     * Creates a new component instance for this component type.
     * @callback create
     * @param {import('../World.js').World} world The world the component will be added to.
     * @param {import('../entity/Entity.js').EntityId} entityId The id of the entity this component is added to.
     */

    /**
     * Copies a component instance from values.
     * @callback copy
     * @param {Object} dst The target component instance to modify.
     * @param {Object} values The source values to copy from.
     */

    /**
     * Resets a component instance to be re-used or deleted.
     * @callback reset
     * @param {Object} dst The target component instance to reset.
     */

    /**
     * @typedef ComponentFactory
     * A component factory handles the creation, modification, and deletion of component instances.
     * 
     * @property {create} create Creates a new component instance for this type.
     * @property {copy} [copy] Copies a component instance from values.
     * @property {reset} [reset] Resets a component instance to be re-used or deleted.
     */

    /**
     * Creates a component factory given the passed-in handlers. This is not required
     * to create a component factory; any object with create(), copy(), and reset() can
     * be considered a component factory and used as is without this function. This
     * function is mostly for ease of use and readability.
     * 
     * @param {String} name The name of the component. This should be unique; it is used as its hash key.
     * @param {create} [create=defaultCreate] The function to create new components.
     * @param {copy} [copy=defaultCopy] The function to copy new components from values.
     * @param {reset} [reset=defaultReset] The function to reset a component to be re-used or deleted.
     * @returns {ComponentFactory} The created component factory.
     */
    function createComponentFactory(name, create = defaultCreate, copy = defaultCopy, reset = defaultReset)
    {
        return {
            name,
            create,
            copy,
            reset
        };
    }

    function defaultCreate(world, entityId) { return {}; }
    function defaultCopy(dst, values) { Object.assign(dst, values); }
    function defaultReset(dst) { Object.getOwnPropertyNames(dst).forEach(value => delete dst[value]); }

    var ComponentFactory = /*#__PURE__*/Object.freeze({
        __proto__: null,
        createComponentFactory: createComponentFactory
    });

    /**
     * A class to represent a component. This class is not required to
     * create a component; any class can be considered a component. To
     * override reset or copy behavior, simply implement the reset()
     * or copy() functions respectively for that class.
     * 
     * This class serves mostly as a quick and dirty default fallback. It
     * has defaults for all functionality except its properties (which are
     * usually unique to each component type).
     * 
     * Usually, you will use this class like so:
     * @example
     * class MyComponent extends ComponentBase
     * {
     *   constructor()
     *   {
     *     super();
     *     this.myValue = true;
     *     this.myString = 'Hello World';
     *   }
     * 
     *   // Feel free to override any default functionality when needed...
     * }
     */
    const DEFAULT_UNDEFINED = Symbol('defaultUndefined');
    class ComponentBase
    {
        static get defaultValues() { return null; }

        constructor(world, entityId, resetAsSelfConstructor = true)
        {
            if (!('defaultValues' in this.constructor))
            {
                if (resetAsSelfConstructor)
                {
                    // NOTE: Must make sure 'defaultValues' exists before recursing into the constructor.
                    this.constructor.defaultValues = null;
                    this.constructor.defaultValues = new (this.constructor)();
                }
                else
                {
                    this.constructor.defaultValues = DEFAULT_UNDEFINED;
                }
            }
        }
        
        copy(values)
        {
            for(let key of Object.getOwnPropertyNames(values))
            {
                this[key] = values[key];
            }
        }

        reset()
        {
            if ('defaultValues' in this.constructor)
            {
                let defaultValues = this.constructor.defaultValues;
                if (defaultValues === DEFAULT_UNDEFINED)
                {
                    for(let key of Object.getOwnPropertyNames(this))
                    {
                        this[key] = undefined;
                    }
                    return true;
                }
                else if (defaultValues)
                {
                    this.copy(this, this.constructor.defaultValues);
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
    }

    /**
     * A class to represent a component with no data, also known as a tag.
     * This class is not required to create a tag component; any class is
     * considered a tag, if:
     * 
     * - It does not implement reset() or reset() always returns false.
     * - And its instances do not own any properties.
     * 
     * This class is mostly for ease of use and readability.
     */
    class TagComponent {}

    class EntityBase extends EntityComponent$1
    {
        constructor(entityManager)
        {
            super(entityManager);

            this.entityManager = entityManager;
        }

        destroy()
        {
            this.entityManager.destroyEntity(this.entityId);
            this.entityManager = null;
        }

        addComponent(componentType, initialValues = undefined)
        {
            this.entityManager.addComponent(this.id, componentType, initialValues);
            return this;
        }

        removeComponent(componentType)
        {
            this.entityManager.removeComponent(this.id, componentType);
            return this;
        }

        hasComponent(componentType)
        {
            return this.entityManager.hasComponent(this.id, componentType);
        }

        getComponent(componentType)
        {
            return this.entityManager.getComponent(this.id, componentType);
        }
    }

    class HybridEntity extends EntityBase
    {
        constructor(entityManager)
        {
            super(entityManager);

            this.onComponentAdd = this.onComponentAdd.bind(this);
            this.onComponentRemove = this.onComponentRemove.bind(this);

            this.entityManager.entityHandler.addEntityListener(this.id, 'componentadd', this.onComponentAdd);
            this.entityManager.entityHandler.addEntityListener(this.id, 'componentremove', this.onComponentRemove);
        }
        
        /** @abstract */
        onDestroy() {}

        onComponentAdd(entityId, componentType, component, initialValues)
        {
            if (entityId === this.id)
            {
                // NOTE: Since this callback is connected only AFTER EntityComponent has been added
                // we can safely assume that it cannot be added again.
                addComponentProperties(this, componentType, component);
            }
        }

        onComponentRemove(entityId, componentType, component)
        {
            if (componentType === EntityComponent)
            {
                this.entityManager.entityHandler.removeEntityListener(this.id, 'componentadd', this.onComponentAdd);
                this.entityManager.entityHandler.removeEntityListener(this.id, 'componentremove', this.onComponentRemove);
                
                this.onDestroy();
            }
            else
            {
                removeComponentProperties(this, componentType, component);
            }
        }
    }

    function addComponentProperties(target, componentType, component)
    {
        if (typeof component === 'object')
        {
            let ownProps = Object.getOwnPropertyNames(target);
            let newProps = {};
            for(let prop of Object.getOwnPropertyNames(component))
            {
                if (ownProps.includes(prop))
                {
                    throw new Error(`Conflicting property names in entity for component '${getComponentTypeName(componentType)}'.`);
                }

                newProps[prop] = {
                    get() { return component[prop]; },
                    set(value) { component[prop] = value; },
                    configurable: true,
                };
            }
            Object.defineProperties(target, newProps);
        }
    }

    function removeComponentProperties(target, componentType, component)
    {
        if (typeof component === 'object')
        {
            for(let prop of Object.getOwnPropertyNames(component))
            {
                delete target[prop];
            }
        }
    }

    function getEntityById(world, entityId)
    {
        return getComponent(entityId, EntityComponent);
    }

    function getEntities(world)
    {
        let dst = [];
        let entityIds = world.query([EntityComponent]);
        for(let entityId of entityIds)
        {
            let component = world.getComponent(entityId, EntityComponent);
            dst.push(component);
        }
        return dst;
    }

    var EntityHelper = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getEntityById: getEntityById,
        getEntities: getEntities
    });

    class EntityWrapperBase
    {
        constructor(entityManager)
        {
            this.entityManager = entityManager;

            this.id = entityManager.createEntity();
        }

        add(componentType, initialValues = undefined)
        {
            this.entityManager.addComponent(this.id, componentType, initialValues);
            return this;
        }

        remove(componentType)
        {
            this.entityManager.removeComponent(this.id, componentType);
            return this;
        }

        has(...componentTypes)
        {
            return this.entityManager.hasComponent(this.id, ...componentTypes);
        }

        destroy()
        {
            this.entityManager.destroyEntity(this.id);
        }

        getEntityId() { return this.id; }
    }

    function create$1(entityManager)
    {
        return new EntityWrapperBase(entityManager);
    }

    var EntityWrapper = /*#__PURE__*/Object.freeze({
        __proto__: null,
        EntityWrapperBase: EntityWrapperBase,
        create: create$1
    });

    const FUNCTION_NAME = Symbol('functionName');
    const FUNCTION_ARGS = Symbol('functionArguments');

    function resolveObject(target, path = [])
    {
        let node = target;
        for(let p of path)
        {
            if (typeof p === 'object' && FUNCTION_NAME in p)
            {
                node = node[p[FUNCTION_NAME]](...p[FUNCTION_ARGS]);
            }
            else
            {
                node = node[p];
            }
        }
        return node;
    }

    function nextProperty(parentPath, nextKey)
    {
        return [
            ...parentPath,
            nextKey,
        ];
    }

    function nextFunction(parentPath, functionName, functionArguments = [])
    {
        return [
            ...parentPath,
            {
                [FUNCTION_NAME]: functionName,
                [FUNCTION_ARGS]: functionArguments,
            }
        ];
    }

    class DiffList extends Array
    {
        static createRecord(type, key, value = undefined, path = [])
        {
            return {
                type,
                path,
                key,
                value,
            };
        }

        addRecord(type, key, value = undefined, path = [])
        {
            let result = DiffList.createRecord(type, key, value, path);
            this.push(result);
            return result;
        }

        addRecords(records)
        {
            this.push(...records);
        }
    }

    function applyDiff(source, sourceProp, diff)
    {
        switch(diff.type)
        {
            case 'new':
            case 'edit':
                sourceProp[diff.key] = diff.value;
                return true;
            case 'delete':
                delete sourceProp[diff.key];
                return true;
        }
        return false;
    }

    function computeDiff(source, target, path = [], opts = {})
    {
        let dst = new DiffList();
        let sourceKeys = new Set(Object.getOwnPropertyNames(source));
        for(let key of Object.getOwnPropertyNames(target))
        {
            if (!sourceKeys.has(key))
            {
                dst.addRecord('new', key, target[key], path);
            }
            else
            {
                sourceKeys.delete(key);
                let result = computeDiff$4(source[key], target[key], nextProperty(path, key), opts);
                if (!result)
                {
                    dst.addRecord('edit', key, target[key], path);
                }
                else
                {
                    dst.addRecords(result);
                }
            }
        }
        if (!opts.preserveSource)
        {
            for(let sourceKey of sourceKeys)
            {
                dst.addRecord('delete', sourceKey, undefined, path);
            }
        }
        return dst;
    }

    function isType(arg)
    {
        return Array.isArray(arg);
    }

    function applyDiff$1(source, sourceProp, diff)
    {
        switch(diff.type)
        {
            case 'arrayObjectEdit':
                sourceProp[diff.key] = diff.value;
                return true;
            case 'arrayObjectAppend':
                ensureCapacity(diff.key);
                sourceProp[diff.key] = diff.value;
                return true;
            case 'arrayObjectSplice':
                sourceProp.splice(diff.key, diff.value);
                return true;
        }
        return false;
    }

    function computeDiff$1(source, target, path = [], opts = {})
    {
        let dst = new DiffList();
        const length = Math.min(source.length, target.length);
        for(let i = 0; i < length; ++i)
        {
            let result = computeDiff$4(source[i], target[i], nextProperty(path, i), opts);
            if (!result)
            {
                dst.addRecord('arrayObjectEdit', i, target[i], path);
            }
            else
            {
                dst.addRecords(result);
            }
        }

        if (!opts.preserveSource && source.length > target.length)
        {
            dst.addRecord('arrayObjectSplice', target.length, source.length - target.length, path);
        }
        else if (target.length > source.length)
        {
            for(let i = source.length; i < target.length; ++i)
            {
                dst.addRecord('arrayObjectAppend', i, target[i], path);
            }
        }
        return dst;
    }

    function ensureCapacity(array, capacity)
    {
        if (array.length < capacity)
        {
            array.length = capacity;
        }
    }

    var ArrayObjectDiff = /*#__PURE__*/Object.freeze({
        __proto__: null,
        isType: isType,
        applyDiff: applyDiff$1,
        computeDiff: computeDiff$1
    });

    function isType$1(arg)
    {
        return arg instanceof Set;
    }

    function applyDiff$2(source, sourceProp, diff)
    {
        switch(diff.type)
        {
            case 'setAdd':
                sourceProp.add(diff.key);
                return true;
            case 'setDelete':
                sourceProp.delete(diff.key);
                return true;
        }
        return false;
    }

    // NOTE: If the set's contents are objects, there is no way to "update" that object.
    // Therefore, this diff only works if NEW objects are added. This is the case for
    // any object with indexed with keys. Keys MUST be checked with '===' and CANNOT be diffed.
    function computeDiff$2(source, target, path = [], opts = {})
    {
        let dst = new DiffList();
        for(let value of target)
        {
            if (!source.has(value))
            {
                dst.addRecord('setAdd', value, undefined, path);
            }
        }
        if (!opts.preserveSource)
        {
            for(let value of source)
            {
                if (!target.has(value))
                {
                    dst.addRecord('setDelete', value, undefined, path);
                }
            }
        }
        return dst;
    }

    var SetDiff = /*#__PURE__*/Object.freeze({
        __proto__: null,
        isType: isType$1,
        applyDiff: applyDiff$2,
        computeDiff: computeDiff$2
    });

    function isType$2(arg)
    {
        return arg instanceof Map;
    }

    function applyDiff$3(source, sourceProp, diff)
    {
        switch(diff.type)
        {
            case 'mapNew':
            case 'mapSet':
                sourceProp.set(diff.key, diff.value);
                return true;
            case 'mapDelete':
                sourceProp.delete(diff.key);
                return true;
        }
        return false;
    }

    // NOTE: Same as set diffing, keys MUST be checked with '===' and CANNOT be diffed.
    // Although values can.
    function computeDiff$3(source, target, path = [], opts = {})
    {
        let dst = new DiffList();
        for(let [key, value] of target)
        {
            if (!source.has(key))
            {
                dst.addRecord('mapNew', key, value, path);
            }
            else
            {
                let result = computeDiff$4(source.get(key), value, nextFunction(path, 'get', [ key ]), opts);
                if (!result)
                {
                    dst.addRecord('mapSet', key, value, path);
                }
                else
                {
                    dst.addRecords(result);
                }
            }
        }
        if (!opts.preserveSource)
        {
            for(let key of source.keys())
            {
                if (!target.has(key))
                {
                    dst.addRecord('mapDelete', key, undefined, path);
                }
            }
        }
        return dst;
    }

    var MapDiff = /*#__PURE__*/Object.freeze({
        __proto__: null,
        isType: isType$2,
        applyDiff: applyDiff$3,
        computeDiff: computeDiff$3
    });

    const DEFAULT_HANDLERS = [
        ArrayObjectDiff,
        MapDiff,
        SetDiff,
    ];

    const DEFAULT_OPTS = {
        handlers: DEFAULT_HANDLERS,
        preserveSource: true,
        maxDepth: 1000,
    };

    function computeDiff$4(source, target, path = [], opts = DEFAULT_OPTS)
    {
        // Force replacement since we have reached maximum depth...
        if (path.length >= opts.maxDepth) return null;
        // Check if type at least matches...
        if (typeof source !== typeof target) return null;
        // If it's an object...(which there are many kinds)...
        if (typeof source === 'object')
        {
            for(let handler of opts.handlers)
            {
                let type = handler.isType(source);
                if (type ^ (handler.isType(target))) return null;
                if (type) return handler.computeDiff(source, target, path, opts);
            }

            // It's probably just a simple object...
            return computeDiff(source, target, path, opts);
        }
        else
        {
            // Any other primitive types...
            if (source === target) return [];
            else return null;
        }
    }

    function applyDiff$4(source, diffList, opts = DEFAULT_OPTS)
    {
        let sourceProp = source;
        for(let diff of diffList)
        {
            // Find property...
            sourceProp = resolveObject(source, diff.path);

            // Apply property diff...
            let flag = false;
            for(let handler of opts.handlers)
            {
                flag = handler.applyDiff(source, sourceProp, diff);
                if (flag) break;
            }

            // Apply default property diff...
            if (!flag)
            {
                applyDiff(source, sourceProp, diff);
            }
        }
        return source;
    }

    /**
     * Performs a fine diff on the entities and reconciles any changes with the current world state.
     * It respects the current world state with higher precedence over the modified changes. In other
     * words, any properties modified by the running program will be preserved. Only properties that
     * have not changed will be modified to reflect the new changes.
     * 
     * This assumes entity constructors are deterministic, non-reflexive, and repeatable in a blank
     * test world.
     * 
     * @param {HotEntityModule} prevHotEntityModule The old source hot entity module instance.
     * @param {HotEntityModule} nextHotEntityModule The new target hot entity module instance.
     * @param {Object} [opts] Any additional options.
     * @param {Function} [opts.worldObjectWrapper] If defined, the function will allow you wrap the create EntityManager
     * and specify the shape of the "world" parameter given to the entity constructors. The function takes in an instance
     * of EntityManager and returns an object to pass to the constructors.
     */
    function FineDiffStrategy(prevHotEntityModule, nextHotEntityModule, opts = undefined)
    {
        const prevEntityConstructor = prevHotEntityModule.entityConstructor;
        const prevEntityManagers = prevHotEntityModule.entityManagers;
        const nextEntityConstructor = nextHotEntityModule.entityConstructor;
        const nextEntityManagers = nextHotEntityModule.entityManagers;

        let cacheEntityManager = new EntityManager();
        let cacheWorld = (opts && opts.worldObjectWrapper)
            ? opts.worldObjectWrapper(cacheEntityManager)
            : cacheEntityManager;
        let oldEntity = prevEntityConstructor(cacheWorld);
        let newEntity = nextEntityConstructor(cacheWorld);

        // Diff the old and new components...only update what has changed...
        let componentValues = new Map();
        for(let componentType of cacheEntityManager.getComponentTypesByEntityId(newEntity))
        {
            let newComponent = cacheEntityManager.getComponent(newEntity, componentType);
            let oldComponent = cacheEntityManager.getComponent(oldEntity, componentType);

            if (!oldComponent)
            {
                // ...it's an addition!
                componentValues.set(componentType, true);
            }
            else
            {
                // ...it's an update!
                let result = computeDiff$4(oldComponent, newComponent);
                componentValues.set(componentType, result);
            }
        }
        for(let componentType of cacheEntityManager.getComponentTypesByEntityId(oldEntity))
        {
            if (!componentValues.has(componentType))
            {
                // ...it's a deletion!
                componentValues.set(componentType, false);
            }
        }

        // Clean up cache entity manager...
        cacheEntityManager.clear();

        // Update all existing entity managers to the new entities...
        for(let entityManager of prevEntityManagers)
        {
            // Update entities...
            for(let entity of prevHotEntityModule.entities.get(entityManager).values())
            {
                for(let [componentType, values] of componentValues.entries())
                {
                    if (typeof values === 'boolean')
                    {
                        if (values)
                        {
                            // Addition!
                            entityManager.addComponent(entity, componentType);
                        }
                        else
                        {
                            // Deletion!
                            entityManager.removeComponent(entity, componentType);
                        }
                    }
                    else
                    {
                        // Update!
                        let component = entityManager.getComponent(entity, componentType);
                        applyDiff$4(component, values);
                    }
                }
            }
        }
    }

    class HotEntityModule
    {
        constructor(entityModule, entityConstructor)
        {
            this.moduleId = entityModule.id;
            this.entityConstructor = entityConstructor;

            this.entities = new Map();
        }

        addEntity(entityManager, entityId)
        {
            if (this.entities.has(entityManager))
            {
                this.entities.get(entityManager).add(entityId);
            }
            else
            {
                let entitySet = new Set();
                entitySet.add(entityId);
                this.entities.set(entityManager, entitySet);
            }

            // Add listener...
            entityManager.entityHandler.addEntityListener(
                entityId,
                'destroy',
                this.removeEntity.bind(this, entityManager, entityId),
                { handle: `${this.moduleId}:${entityId}` }
            );
        }

        removeEntity(entityManager, entityId)
        {
            // Remove listener...(just in case this was not triggered by a destroy event)...
            entityManager.entityHandler.removeEntityListener(
                entityId,
                'destroy',
                `${this.moduleId}:${entityId}`);
            
            let entitySet = this.entities.get(entityManager);
            entitySet.delete(entityId);
            if (entitySet.size <= 0) this.entities.delete(entityManager);
        }

        /**
         * Replaces the current state of with the next one. This includes all entities and entity managers.
         * However, it assumes both hot entity replacements are for the same module.
         * 
         * @param {HotEntityModule} nextHotEntityModule The new hot entity module object to replace this with.
         * @param {Object} [opts] Any additional options.
         * @param {Function} [opts.replaceStrategy] If defined, replacement will be handled by the passed in
         * function. It takes 3 arguemtns: the hot entity replacement instance, the target instance, and the replaceOpts if defined.
         * @param {Object} [opts.replaceOpts] This is given to the replacement strategy function, if defined.
         */
        replaceWith(nextHotEntityModule, opts = undefined)
        {
            // NOTE: Assumes more than one instance can exist at the same time.
            // NOTE: Assumes components do not store self references (nor their own entity id).
            // NOTE: Assumes you don't use objects in sets (unless they are immutable)...cause those are evil.

            const replaceStrategy = (opts && opts.replaceStrategy) || FineDiffStrategy;
            replaceStrategy.call(
                undefined,
                this,
                nextHotEntityModule,
                opts && opts.replaceOpts,
            );

            // Copy the new constructor over...
            this.entityConstructor = nextHotEntityModule.entityConstructor;

            // Copy any new entities over...
            for(let entityManager of nextHotEntityModule.entityManagers)
            {
                for(let entity of nextHotEntityModule.entities.get(entityManager).values())
                {
                    nextHotEntityModule.removeEntity(entityManager, entity);
                    this.addEntity(entityManager, entity);
                }
            }
        }

        isEmpty()
        {
            return this.entities.size <= 0;
        }

        get entityManagers()
        {
            return this.entities.keys();
        }
    }

    const HOT_ENTITY_MODULES = new Map();

    function enableForEntity(entityModule, entityManager, entityId)
    {
        if (!HOT_ENTITY_MODULES.has(entityModule.id))
        {
            throw new Error('Module must be accepted first for HER to enable hot entity replacement.');
        }

        let hotEntityModule = HOT_ENTITY_MODULES.get(entityModule.id);
        hotEntityModule.addEntity(entityManager, entityId);
        return entityId;
    }

    function acceptForModule(entityModule, entityConstructor, worldConstructor = undefined)
    {
        let newHotEntityModule = new HotEntityModule(entityModule, entityConstructor);
        if (HOT_ENTITY_MODULES.has(entityModule.id))
        {
            console.log(`Reloading '${entityModule.id}'...`);
            let oldHotEntityModule = HOT_ENTITY_MODULES.get(entityModule.id);
            oldHotEntityModule.replaceWith(newHotEntityModule, worldConstructor);
        }
        else
        {
            console.log(`Preparing '${entityModule.id}'...`);
            HOT_ENTITY_MODULES.set(entityModule.id, newHotEntityModule);
        }

        return entityModule;
    }

    function getInstanceForModuleId(entityModuleId)
    {
        return HER_MODULES.get(entityModuleId);
    }

    var HotEntityReplacement = /*#__PURE__*/Object.freeze({
        __proto__: null,
        enableForEntity: enableForEntity,
        acceptForModule: acceptForModule,
        getInstanceForModuleId: getInstanceForModuleId
    });

    const ANY = Symbol('any');

    class EventKey
    {
        static parse(eventKeyString)
        {
            let startCodeIndex = eventKeyString.indexOf('[');
            let endCodeIndex = eventKeyString.indexOf(']');
            let modeIndex = eventKeyString.indexOf('.');
        
            let source = null;
            let code = null;
            let mode = null;
        
            // For ANY source, use `[code].mode` or `.mode`
            // For ONLY codes and modes from source, use `source`
            if (startCodeIndex <= 0 || modeIndex === 0) source = ANY;
            else source = eventKeyString.substring(0, startCodeIndex);
        
            // For ANY code, use `source.mode` or `source[].mode`
            // For ONLY sources and modes for code, use `[code]`
            if (startCodeIndex < 0 || endCodeIndex < 0 || startCodeIndex + 1 === endCodeIndex) code = ANY;
            else code = eventKeyString.substring(startCodeIndex + 1, endCodeIndex);
        
            // For ANY mode, use `source[code]` or `source[code].`
            // For ONLY sources and codes for mode, use `.mode`
            if (modeIndex < 0 || eventKeyString.trim().endsWith('.')) mode = ANY;
            else mode = eventKeyString.substring(modeIndex + 1);
        
            return new EventKey(
                source,
                code,
                mode
            );
        }

        constructor(source, code, mode)
        {
            this.source = source;
            this.code = code;
            this.mode = mode;

            this.string = `${this.source.toString()}[${this.code.toString()}].${this.mode.toString()}`;
        }

        matches(eventKey)
        {
            if (this.source === ANY || eventKey.source === ANY || this.source === eventKey.source)
            {
                if (this.code === ANY || eventKey.code === ANY || this.code === eventKey.code)
                {
                    if (this.mode === ANY || eventKey.mode === ANY || this.mode === eventKey.mode)
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        /** @override */
        toString() { return this.string; }
    }
    // NOTE: Exported as a static variable of EventKey
    EventKey.ANY = ANY;

    class AbstractInputAdapter
    {
        constructor(defaultValue)
        {
            this.prev = defaultValue;
            this.value = defaultValue;
            this.next = defaultValue;
        }

        update(eventKey, value) { return false; }
        consume() { return this.next; }

        poll()
        {
            this.prev = this.value;
            this.value = this.next;
            this.next = this.consume();
            return this;
        }
    }

    class ActionInputAdapter extends AbstractInputAdapter
    {
        constructor(eventKeyStrings)
        {
            super(false);

            this.eventKeys = [];
            for(let eventKeyString of eventKeyStrings)
            {
                this.eventKeys.push(EventKey.parse(eventKeyString));
            }
        }

        /** @override */
        consume() { return false; }

        /** @override */
        update(eventKey, value = true)
        {
            for(let targetEventKey of this.eventKeys)
            {
                if (targetEventKey.matches(eventKey))
                {
                    this.next = value;
                    return true;
                }
            }
            return false;
        }
    }

    class RangeInputAdapter extends AbstractInputAdapter
    {
        constructor(eventKeyString)
        {
            super(0);

            this.eventKey = EventKey.parse(eventKeyString);
        }

        /** @override */
        consume()
        {
            switch(this.eventKey.string)
            {
                case 'mouse[pos].dx':
                case 'mouse[pos].dy':
                    return 0;
                case 'mouse[pos].x':
                case 'mouse[pos].y':
                default:
                    return this.next;
            }
        }

        /** @override */
        update(eventKey, value = 1)
        {
            if (this.eventKey.matches(eventKey))
            {
                this.next = value;
                return true;
            }
            return false;
        }
    }

    class StateInputAdapter extends AbstractInputAdapter
    {
        constructor(eventKeyMap)
        {
            super(0);
            
            this.eventKeyEntries = [];
            for(let eventKey of Object.keys(eventKeyMap))
            {
                this.eventKeyEntries.push({
                    key: EventKey.parse(eventKey),
                    value: eventKeyMap[eventKey]
                });
            }
        }

        /** @override */
        update(eventKey, value = true)
        {
            if (value)
            {
                for(let eventKeyEntry of this.eventKeyEntries)
                {
                    if (eventKeyEntry.key.matches(eventKey))
                    {
                        this.next = eventKeyEntry.value;
                        return true;
                    }
                }
            }
            return false;
        }
    }

    const MIN_CONTEXT_PRIORITY = -100;
    const MAX_CONTEXT_PRIORITY = 100;

    function createContext()
    {
        return {
            _source: null,
            _priority: 0,
            _active: true,
            inputs: new Map(),
            get active() { return this._active; },
            get source() { return this._source; },
            get priority() { return this._priority; },
            attach(inputSource)
            {
                this._source = inputSource;
                this._source.addContext(this);
                return this;
            },
            detach()
            {
                this._source.removeContext(this);
                this._source = null;
                return this;
            },
            setPriority(priority)
            {
                if (priority > MAX_CONTEXT_PRIORITY || priority < MIN_CONTEXT_PRIORITY)
                {
                    throw new Error(`Context priority must be between [${MIN_CONTEXT_PRIORITY}, ${MAX_CONTEXT_PRIORITY}].`);
                }
                
                if (this._priority !== priority)
                {
                    if (this._source)
                    {
                        this._source.removeContext(this);
                        this._priority = priority;
                        this._source.addContext(this);
                    }
                    else
                    {
                        this._priority = priority;
                    }
                }
                return this;
            },
            registerInput(name, adapter)
            {
                this.inputs.set(name, adapter);
                return adapter;
            },
            registerAction(name, ...eventKeyStrings)
            {
                return this.registerInput(name, new ActionInputAdapter(eventKeyStrings));
            },
            registerRange(name, eventKeyString)
            {
                return this.registerInput(name, new RangeInputAdapter(eventKeyString));
            },
            registerState(name, eventKeyMap)
            {
                return this.registerInput(name, new StateInputAdapter(eventKeyMap));
            },
            toggle(force = undefined)
            {
                if (typeof force === 'undefined') force = !this._active;
                this._active = force;
                return this;
            },
            enable() { return this.toggle(true); },
            disable() { return this.toggle(false); },
            poll()
            {
                for(let adapter of this.inputs.values())
                {
                    adapter.poll();
                }
            },
            update(eventKey, value)
            {
                let result;
                for(let adapter of this.inputs.values())
                {
                    result |= adapter.update(eventKey, value);
                }
                return result;
            }
        };
    }

    var InputContext = /*#__PURE__*/Object.freeze({
        __proto__: null,
        MIN_CONTEXT_PRIORITY: MIN_CONTEXT_PRIORITY,
        MAX_CONTEXT_PRIORITY: MAX_CONTEXT_PRIORITY,
        createContext: createContext
    });

    class Mouse
    {
        constructor()
        {
            this.sourceElement = null;
            this.eventHandler = null;

            this.onMouseDown = this.onMouseDown.bind(this);
            this.onMouseUp = this.onMouseUp.bind(this);
            this.onMouseMove = this.onMouseMove.bind(this);
        }

        attach(sourceElement = document)
        {
            this.sourceElement = sourceElement;
            this.sourceElement.addEventListener('mousedown', this.onMouseDown);
            this.sourceElement.addEventListener('mouseup', this.onMouseUp);
            this.sourceElement.addEventListener('contextmenu', this.onContextMenu);
            document.addEventListener('mousemove', this.onMouseMove);
            return this;
        }

        detach()
        {
            this.sourceElement.removeEventListener('mousedown', this.onMouseDown);
            this.sourceElement.removeEventListener('mouseup', this.onMouseUp);
            this.sourceElement.removeEventListener('contextmenu', this.onContextMenu);
            document.removeEventListener('mousemove', this.onMouseMove);
            this.sourceElement = null;
            return this;
        }

        setEventHandler(eventHandler)
        {
            this.eventHandler = eventHandler;
            return this;
        }

        onMouseDown(e)
        {
            if (!this.eventHandler) return;

            let result;
            result = this.eventHandler.call(this, `mouse[${e.button}].down`, true);

            if (result)
            {
                e.preventDefault();
                e.stopPropagation();
            }
        }

        onMouseUp(e)
        {
            if (!this.eventHandler) return;

            e.preventDefault();
            e.stopPropagation();
            
            this.eventHandler.call(this, `mouse[${e.button}].up`, true);
        }

        onMouseMove(e)
        {
            if (!this.eventHandler) return;

            const clientCanvas = this.sourceElement;
            const clientWidth = clientCanvas.clientWidth;
            const clientHeight = clientCanvas.clientHeight;
            
            this.eventHandler.call(this, 'mouse[pos].x', (e.pageX - clientCanvas.offsetLeft) / clientWidth);
            this.eventHandler.call(this, 'mouse[pos].y', (e.pageY - clientCanvas.offsetTop) / clientHeight);
            this.eventHandler.call(this, 'mouse[pos].dx', e.movementX / clientWidth);
            this.eventHandler.call(this, 'mouse[pos].dy', e.movementY / clientHeight);
        }

        onContextMenu(e)
        {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    class Keyboard
    {
        constructor()
        {
            this.sourceElement = null;
            this.eventHandler = null;

            this.onKeyDown = this.onKeyDown.bind(this);
            this.onKeyUp = this.onKeyUp.bind(this);
        }

        attach(sourceElement = document)
        {
            this.sourceElement = sourceElement;
            this.sourceElement.addEventListener('keydown', this.onKeyDown);
            this.sourceElement.addEventListener('keyup', this.onKeyUp);
            return this;
        }

        detach()
        {
            this.sourceElement.removeEventListener('keydown', this.onKeyDown);
            this.sourceElement.removeEventListener('keyup', this.onKeyUp);
            this.sourceElement = null;
            return this;
        }

        setEventHandler(eventHandler)
        {
            this.eventHandler = eventHandler;
            return this;
        }

        onKeyDown(e)
        {
            if (!this.eventHandler) return;

            let result;
            if (e.repeat)
            {
                result = this.eventHandler.call(this, `key[${e.key}].repeat`, true);
            }
            else
            {
                result = this.eventHandler.call(this, `key[${e.key}].down`, true);
            }

            if (result)
            {
                e.preventDefault();
                e.stopPropagation();
            }
        }

        onKeyUp(e)
        {
            if (!this.eventHandler) return;

            let result;
            result = this.eventHandler.call(this, `key[${e.key}].up`, true);
            
            if (result)
            {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }

    /**
     * @module InputSource
     */

    function createSource()
    {
        let result = {
            _contexts: new Array(MAX_CONTEXT_PRIORITY - MIN_CONTEXT_PRIORITY),
            element: null,
            keyboard: new Keyboard(),
            mouse: new Mouse(),
            attach(element)
            {
                this.element = element;
                this.keyboard.attach();
                this.mouse.attach(element);
                return this;
            },
            detach()
            {
                this.element = null;
                this.keyboard.detach();
                this.mouse.detach();
                return this;
            },
            addContext(context)
            {
                const priority = context.priority - MIN_CONTEXT_PRIORITY;
                if (!this._contexts[priority]) this._contexts[priority] = [];
                this._contexts[priority].push(context);
                return this;
            },
            removeContext(context)
            {
                const priority = context.priority - MIN_CONTEXT_PRIORITY;
                let contexts = this._contexts[priority];
                if (contexts)
                {
                    contexts.splice(contexts.indexOf(context), 1);
                }
                return this;
            },
            poll()
            {
                for(let contexts of this._contexts)
                {
                    if (contexts)
                    {
                        for(let context of contexts)
                        {
                            if (context.active)
                            {
                                context.poll();
                            }
                        }
                    }
                }
            },
            handleEvent(eventKeyString, value)
            {
                const eventKey = EventKey.parse(eventKeyString);
                for(let contexts of this._contexts)
                {
                    if (contexts)
                    {
                        for(let context of contexts)
                        {
                            if (context.active)
                            {
                                let result;
                                result = context.update(eventKey, value);
                                if (result)
                                {
                                    return true;
                                }
                            }
                        }
                    }
                }
                return false;
            }
        };
        result.handleEvent = result.handleEvent.bind(result);
        result.keyboard.setEventHandler(result.handleEvent);
        result.mouse.setEventHandler(result.handleEvent);
        return result;
    }

    var InputSource = /*#__PURE__*/Object.freeze({
        __proto__: null,
        createSource: createSource
    });

    let DOUBLE_ACTION_TIME = 300;

    class DoubleActionInputAdapter extends ActionInputAdapter
    {
        constructor(eventKeyStrings)
        {
            super(eventKeyStrings);

            this.actionTime = 0;
        }

        /** @override */
        update(eventKey, value = true)
        {
            let currentTime = Date.now();
            for(let targetEventKey of this.eventKeys)
            {
                if (targetEventKey.matches(eventKey))
                {
                    if (value)
                    {
                        if (currentTime - this.actionTime <= DOUBLE_ACTION_TIME)
                        {
                            this.actionTime = 0;
                            this.next = true;
                            return true;
                        }
                        else
                        {
                            this.actionTime = currentTime;
                            return false;
                        }
                    }
                    else
                    {
                        this.next = false;
                        return true;
                    }
                }
            }
            return false;
        }
    }

    /**
     * @module Input
     */

    var source = createSource();
    var context$1 = createContext().attach(source);

    // Default setup...
    window.addEventListener('DOMContentLoaded', () => {
        if (!source.element)
        {
            let canvasElement = null;

            // Try resolve to <display-port> if exists...
            let displayElement = document.querySelector('display-port');
            if (displayElement)
            {
                canvasElement = displayElement.getCanvas();
            }
            // Otherwise, find a <canvas> element...
            else
            {
                canvasElement = document.querySelector('canvas');
            }

            if (canvasElement)
            {
                attachCanvas$1(canvasElement);
            }
        }
    });

    function attachCanvas$1(canvasElement)
    {
        if (source.element) source.detach();
        return source.attach(canvasElement);
    }

    function createContext$1(priority = 0, active = true)
    {
        return createContext().setPriority(priority).toggle(active).attach(source);
    }

    function createInput(adapter)
    {
        return context$1.registerInput(getNextInputName(), adapter);
    }

    function createAction(...eventKeyStrings)
    {
        return context$1.registerAction(getNextInputName(), ...eventKeyStrings);
    }

    function createRange(eventKeyString)
    {
        return context$1.registerRange(getNextInputName(), eventKeyString);
    }

    function createState(eventKeyMap)
    {
        return context$1.registerState(getNextInputName(), eventKeyMap);
    }

    function poll()
    {
        return source.poll();
    }

    function handleEvent(eventKeyString, value)
    {
        return source.handleEvent(eventKeyString, value);
    }

    var nextInputNameId = 1;
    function getNextInputName()
    {
        return `__input#${nextInputNameId++}`;
    }

    var _default$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        attachCanvas: attachCanvas$1,
        createContext: createContext$1,
        createInput: createInput,
        createAction: createAction,
        createRange: createRange,
        createState: createState,
        poll: poll,
        handleEvent: handleEvent
    });

    /**
     * Generates a uuid v4.
     * 
     * @param {number} a The placeholder (serves for recursion within function).
     * @returns {string} The universally unique id.
     */
    function uuid(a = undefined)
    {
        // https://gist.github.com/jed/982883
        return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid);
    }

    function clampRange(value, min, max)
    {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }

    function withinRadius(from, to, radius)
    {
        const dx = from.x - to.x;
        const dy = from.y - to.y;
        return dx * dx + dy * dy <= radius * radius
    }

    function lerp(a, b, dt)
    {
        return a + (b - a) * dt;
    }

    function distance2D(from, to)
    {
        let dx = to.x - from.x;
        let dy = to.y - from.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function direction2D(from, to)
    {
        let dx = to.x - from.x;
        let dy = to.y - from.y;
        return Math.atan2(dy, dx);
    }

    function lookAt2D(radians, target, dt)
    {
        let step = cycleRange(target - radians, -Math.PI, Math.PI);
        return clampRange(radians + step, radians - dt, radians + dt);
    }

    function cycleRange(value, min, max)
    {
        let range = max - min;
        let result = (value - min) % range;
        if (result < 0) result += range;
        return result + min;
    }

    function randomHexColor()
    {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    function loadImage(url)
    {
        let image = new Image();
        image.src = url;
        return image;
    }

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

    function drawBox(ctx, x, y, radians = 0, w = 16, h = w, color = 'white', outline = false)
    {
        ctx.translate(x, y);
        if (radians) ctx.rotate(radians);
        if (!outline)
        {
            ctx.fillStyle = color;
            ctx.fillRect(-w / 2, -h / 2, w, h);
        }
        else
        {
            ctx.strokeStyle = color;
            ctx.strokeRect(-w / 2, -h / 2, w, h);
        }
        if (radians) ctx.rotate(-radians);
        ctx.translate(-x, -y);
    }

    function intersectBox(a, b)
    {
        return (Math.abs(a.x - b.x) * 2 < (a.width + b.width)) &&
            (Math.abs(a.y - b.y) * 2 < (a.height + b.height));
    }

    function applyMotion(entity, inverseFrictionX = 1, inverseFrictionY = inverseFrictionX)
    {
        if (inverseFrictionX !== 1)
        {
            entity.dx *= inverseFrictionX;
        }
        if (inverseFrictionY !== 1)
        {
            entity.dy *= inverseFrictionY;
        }
        
        entity.x += entity.dx;
        entity.y += entity.dy;
    }

    function onDOMLoaded(listener)
    {
        window.addEventListener('DOMContentLoaded', listener);
    }

    function drawCircle(ctx, x, y, radius = 16, color = 'white', outline = false)
    {
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        if (outline) ctx.stroke();
        else ctx.fill();
    }

    /**
     * @module Util
     */

    var _default$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        uuid: uuid,
        clampRange: clampRange,
        withinRadius: withinRadius,
        lerp: lerp,
        distance2D: distance2D,
        direction2D: direction2D,
        lookAt2D: lookAt2D,
        cycleRange: cycleRange,
        randomHexColor: randomHexColor,
        loadImage: loadImage,
        clearScreen: clearScreen,
        drawText: drawText,
        drawBox: drawBox,
        intersectBox: intersectBox,
        applyMotion: applyMotion,
        onDOMLoaded: onDOMLoaded,
        drawCircle: drawCircle
    });



    exports.AbstractCamera = AbstractCamera;
    exports.AbstractInputAdapter = AbstractInputAdapter;
    exports.ActionInputAdapter = ActionInputAdapter;
    exports.Audio = Audio;
    exports.Component = ComponentHelper;
    exports.ComponentBase = ComponentBase;
    exports.ComponentFactory = ComponentFactory;
    exports.DOUBLE_ACTION_TIME = DOUBLE_ACTION_TIME;
    exports.Display = _default;
    exports.DisplayPort = DisplayPort;
    exports.DoubleActionInputAdapter = DoubleActionInputAdapter;
    exports.Entity = EntityHelper;
    exports.EntityBase = EntityBase;
    exports.EntityComponent = EntityComponent$1;
    exports.EntityManager = EntityManager;
    exports.EntityQuery = EntityQuery;
    exports.EntityWrapper = EntityWrapper;
    exports.EventKey = EventKey;
    exports.Eventable = Eventable$1;
    exports.FineDiffStrategy = FineDiffStrategy;
    exports.Game = Game;
    exports.GameLoop = GameLoop;
    exports.HotEntityModule = HotEntityModule;
    exports.HotEntityReplacement = HotEntityReplacement;
    exports.HybridEntity = HybridEntity;
    exports.Input = _default$1;
    exports.InputContext = InputContext;
    exports.InputSource = InputSource;
    exports.Keyboard = Keyboard;
    exports.MODE_CENTER = MODE_CENTER;
    exports.MODE_FIT = MODE_FIT;
    exports.MODE_NOSCALE = MODE_NOSCALE;
    exports.MODE_STRETCH = MODE_STRETCH;
    exports.Mouse = Mouse;
    exports.QueryOperator = QueryOperator;
    exports.Random = Random;
    exports.RandomGenerator = RandomGenerator;
    exports.RangeInputAdapter = RangeInputAdapter;
    exports.SceneBase = SceneBase;
    exports.SceneManager = SceneManager;
    exports.SimpleRandomGenerator = SimpleRandomGenerator;
    exports.StateInputAdapter = StateInputAdapter;
    exports.TagComponent = TagComponent;
    exports.Util = _default$2;
    exports.View = View;
    exports.ViewHelper = ViewHelper;
    exports.ViewPort = ViewPort;
    exports.default = self;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
