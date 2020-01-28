(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@milque/input')) :
    typeof define === 'function' && define.amd ? define(['exports', '@milque/input'], factory) :
    (global = global || self, factory(global.Core = {}, global.Input));
}(this, (function (exports, input) { 'use strict';

    var self = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get Display () { return Display; },
        get Audio () { return Audio; },
        get Input () { return Input; },
        get Random () { return Random; },
        get Utils () { return Utils; },
        get Game () { return Game; },
        get default () { return self; },
        get RandomGenerator () { return RandomGenerator; },
        get SimpleRandomGenerator () { return SimpleRandomGenerator; },
        get Eventable () { return Eventable$1; },
        get View () { return View; },
        get ViewHelper () { return ViewHelper; },
        get ViewPort () { return ViewPort; },
        get AbstractCamera () { return AbstractCamera; },
        get GameLoop () { return GameLoop; },
        get SceneManager () { return SceneManager; },
        get SceneBase () { return SceneBase; }
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

    /**
     * @module Utils
     * @version 1.0.2
     * 
     * # Changelog
     * ## 1.0.2
     * - Added outline parameter for drawBox()
     * - Added uuid()
     */

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

    function clampRange(value, min, max)
    {
        if (value < min) return min;
        if (value > max) return max;
        return value;
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

    function withinRadius(from, to, radius)
    {
        const dx = from.x - to.x;
        const dy = from.y - to.y;
        return dx * dx + dy * dy <= radius * radius
    }

    function onDOMLoaded(listener)
    {
        window.addEventListener('DOMContentLoaded', listener);
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

    var Utils = /*#__PURE__*/Object.freeze({
        __proto__: null,
        randomHexColor: randomHexColor,
        loadImage: loadImage,
        clampRange: clampRange,
        clearScreen: clearScreen,
        drawText: drawText,
        drawBox: drawBox,
        intersectBox: intersectBox,
        applyMotion: applyMotion,
        withinRadius: withinRadius,
        onDOMLoaded: onDOMLoaded,
        lerp: lerp,
        distance2D: distance2D,
        direction2D: direction2D,
        lookAt2D: lookAt2D,
        cycleRange: cycleRange,
        drawCircle: drawCircle,
        uuid: uuid
    });

    /**
     * @module Display
     * @version 1.0.1
     */

    var canvas;
    var context;

    // Default setup...
    onDOMLoaded(() => {
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

    var Display = /*#__PURE__*/Object.freeze({
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

    /**
     * @module Input
     * @version 1.0.1
     */

    var source = input.InputSource.createSource();
    var context$1 = input.InputContext.createContext().attach(source);

    // Default setup...
    onDOMLoaded(() => {
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

    function createContext(priority = 0, active = true)
    {
        return input.InputContext.createContext().setPriority(priority).toggle(active).attach(source);
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

    var Input = /*#__PURE__*/Object.freeze({
        __proto__: null,
        attachCanvas: attachCanvas$1,
        createContext: createContext,
        createInput: createInput,
        createAction: createAction,
        createRange: createRange,
        createState: createState,
        poll: poll,
        handleEvent: handleEvent
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



    exports.AbstractCamera = AbstractCamera;
    exports.Audio = Audio;
    exports.Display = Display;
    exports.Eventable = Eventable$1;
    exports.Game = Game;
    exports.GameLoop = GameLoop;
    exports.Input = Input;
    exports.Random = Random;
    exports.RandomGenerator = RandomGenerator;
    exports.SceneBase = SceneBase;
    exports.SceneManager = SceneManager;
    exports.SimpleRandomGenerator = SimpleRandomGenerator;
    exports.Utils = Utils;
    exports.View = View;
    exports.ViewHelper = ViewHelper;
    exports.ViewPort = ViewPort;
    exports.default = self;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
