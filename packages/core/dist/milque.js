(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.Core = {}));
}(this, (function (exports) { 'use strict';

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

    exports.AbstractCamera = AbstractCamera;
    exports.Audio = Audio;
    exports.Eventable = Eventable$1;
    exports.GameLoop = GameLoop;
    exports.SceneBase = SceneBase;
    exports.SceneManager = SceneManager;
    exports.View = View;
    exports.ViewHelper = ViewHelper;
    exports.ViewPort = ViewPort;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
