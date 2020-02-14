(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@milque/input'), require('@milque/game'), require('@milque/display'), require('@milque/util'), require('@milque/math')) :
    typeof define === 'function' && define.amd ? define(['exports', '@milque/input', '@milque/game', '@milque/display', '@milque/util', '@milque/math'], factory) :
    (global = global || self, factory(global.Lib = {}, global.input, global.game, global.display, global.util, global.math));
}(this, (function (exports, input, game, display, util, math) { 'use strict';

    const CONTEXT = input.Input.createContext().disable();
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

    const CONTEXT$1 = input.Input.createContext().disable();
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

    const GAME_INFO_PROPERTY = Symbol('gameInfo');

    function getGameInfo(instance)
    {
        return instance[GAME_INFO_PROPERTY];
    }

    async function begin(game)
    {
        let instance = await loadGame(game);
        return startGame(instance);
    }

    async function end(instance)
    {
        stopGame(instance);
        await unloadGame(instance);
        return instance;
    }

    async function loadGame(game)
    {
        if (!game) game = {};

        let instance = (game.load && await game.load(game))
            || (Object.isExtensible(game) && game)
            || {};
        
        let gameInfo = {
            game,
            view: null,
            viewport: null,
            display: null,
            loop: null,
            onframe: onFrame.bind(undefined, instance),
            onpreupdate: onPreUpdate.bind(undefined, instance),
            onupdate: onUpdate.bind(undefined, instance),
            onfixedupdate: onFixedUpdate.bind(undefined, instance),
            onpostupdate: onPostUpdate.bind(undefined, instance),
            onfirstupdate: onFirstUpdate.bind(undefined, instance),
        };
        
        Object.defineProperty(instance, GAME_INFO_PROPERTY, {
            value: gameInfo,
            enumerable: false,
            configurable: true,
        });
        
        return instance;
    }

    function startGame(instance)
    {
        let displayPort = document.querySelector('display-port');
        if (!displayPort)
        {
            displayPort = new display.DisplayPort();
            displayPort.toggleAttribute('full');
            displayPort.toggleAttribute('debug');
            document.body.appendChild(displayPort);
        }
        
        let view = instance.view || new display.View();
        let viewport = instance.viewport || {
            x: 0, y: 0,
            get width() { return displayPort.getCanvas().clientWidth; },
            get height() { return displayPort.getCanvas().clientHeight; },
        };

        let applicationLoop = new game.ApplicationLoop();

        let gameInfo = instance[GAME_INFO_PROPERTY];
        gameInfo.view = view;
        gameInfo.viewport = viewport;
        gameInfo.display = displayPort;
        gameInfo.loop = applicationLoop;
        
        applicationLoop.addEventListener('update', gameInfo.onfirstupdate, { once: true });
        applicationLoop.start();

        return instance;
    }

    function onFirstUpdate(instance, e)
    {
        let { game, display, loop, onpreupdate, onupdate, onpostupdate, onfixedupdate, onframe } = instance[GAME_INFO_PROPERTY];

        if (game.start) game.start.call(instance);

        onpreupdate.call(instance,e);
        onupdate.call(instance, e);
        onfixedupdate.call(instance, e);
        onpostupdate.call(instance, e);

        loop.addEventListener('preupdate', onpreupdate);
        loop.addEventListener('update', onupdate);
        loop.addEventListener('fixedupdate', onfixedupdate);
        loop.addEventListener('postupdate', onpostupdate);
        display.addEventListener('frame', onframe);
    }

    function onPreUpdate(instance, e)
    {
        let { game } = instance[GAME_INFO_PROPERTY];
        let dt = e.detail.delta;
        if (game.preupdate) game.preupdate.call(instance, dt);
    }

    function onUpdate(instance, e)
    {
        let { game } = instance[GAME_INFO_PROPERTY];
        let dt = e.detail.delta;
        if (game.update) game.update.call(instance, dt);
    }

    function onFixedUpdate(instance, e)
    {
        let { game } = instance[GAME_INFO_PROPERTY];
        if (game.fixedupdate) game.fixedupdate.call(instance);
    }

    function onPostUpdate(instance, e)
    {
        let { game } = instance[GAME_INFO_PROPERTY];
        let dt = e.detail.delta;
        if (game.postupdate) game.postupdate.call(instance, dt);
    }

    function onFrame(instance, e)
    {
        let { game, display, view, viewport } = instance[GAME_INFO_PROPERTY];
        let ctx = e.detail.context;

        // Reset any transformations...
        view.context.setTransform(1, 0, 0, 1, 0, 0);
        view.context.clearRect(0, 0, view.width, view.height);

        if (game.render) game.render.call(instance, view, instance);

        display.clear('black');
        view.drawBufferToCanvas(
            ctx,
            viewport.x,
            viewport.y,
            viewport.width,
            viewport.height
        );
    }

    async function pauseGame(instance)
    {
        let { loop } = instance[GAME_INFO_PROPERTY];
        loop.pause();
    }

    async function resumeGame(instance)
    {
        let { loop } = instance[GAME_INFO_PROPERTY];
        loop.resume();
    }

    function stopGame(instance)
    {
        let { game, loop, display, onframe, onpreupdate, onupdate, onfixedupdate, onpostupdate, onfirstupdate } = instance[GAME_INFO_PROPERTY];

        loop.removeEventListener('update', onfirstupdate);
        loop.removeEventListener('preupdate', onpreupdate);
        loop.removeEventListener('update', onupdate);
        loop.removeEventListener('fixedupdate', onfixedupdate);
        loop.removeEventListener('postupdate', onpostupdate);
        display.removeEventListener('frame', onframe);

        loop.stop();
        if (game.stop) game.stop.call(instance);
        return instance;
    }

    async function unloadGame(instance)
    {
        let { game } = instance[GAME_INFO_PROPERTY];
        if (game.unload) await game.unload(instance);
        return instance;
    }

    async function nextGame(fromInstance, toGame)
    {
        await end(fromInstance);
        let result = await begin(toGame);
        return result;
    }

    var Game = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getGameInfo: getGameInfo,
        begin: begin,
        end: end,
        loadGame: loadGame,
        startGame: startGame,
        pauseGame: pauseGame,
        resumeGame: resumeGame,
        stopGame: stopGame,
        unloadGame: unloadGame,
        nextGame: nextGame
    });

    const LOAD_TIME = 250;
    const FADE_IN_TIME = LOAD_TIME * 0.3;
    const FADE_OUT_TIME = LOAD_TIME * 0.9;

    const CONTEXT$2 = input.Input.createContext().disable();
    const ANY_KEY = CONTEXT$2.registerAction('continue', 'key.down', 'mouse.down');

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
            CONTEXT$2.enable();
        }

        /** @override */
        async unload(game)
        {
            CONTEXT$2.disable();
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
            if (this.time > LOAD_TIME) undefined(this.nextScene);
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

    const GAME_INFO_PROPERTY$1 = Symbol('gameInfo');

    function getGameInfo$1(instance)
    {
        return instance[GAME_INFO_PROPERTY$1];
    }

    async function load(game)
    {
        if (!game) game = {};

        let instance = (game.load && await game.load(game))
            || (Object.isExtensible(game) && game)
            || {};
        
        let gameInfo = {
            game,
            view: null,
            viewport: null,
            display: null,
            loop: null,
            onframe: onFrame$1.bind(undefined, instance),
            onpreupdate: onPreUpdate$1.bind(undefined, instance),
            onupdate: onUpdate$1.bind(undefined, instance),
            onfixedupdate: onFixedUpdate$1.bind(undefined, instance),
            onpostupdate: onPostUpdate$1.bind(undefined, instance),
            onfirstupdate: onFirstUpdate$1.bind(undefined, instance),
        };
        
        Object.defineProperty(instance, GAME_INFO_PROPERTY$1, {
            value: gameInfo,
            enumerable: false,
            configurable: true,
        });
        
        return instance;
    }

    function start(instance)
    {
        let displayPort = document.querySelector('display-port');
        if (!displayPort)
        {
            displayPort = new display.DisplayPort();
            displayPort.toggleAttribute('full');
            displayPort.toggleAttribute('debug');
            document.body.appendChild(displayPort);
        }
        
        let view = instance.view || new display.View();
        let viewport = instance.viewport || {
            x: 0, y: 0,
            get width() { return displayPort.getCanvas().clientWidth; },
            get height() { return displayPort.getCanvas().clientHeight; },
        };

        let applicationLoop = new game.ApplicationLoop();

        let gameInfo = instance[GAME_INFO_PROPERTY$1];
        gameInfo.view = view;
        gameInfo.viewport = viewport;
        gameInfo.display = displayPort;
        gameInfo.loop = applicationLoop;
        
        applicationLoop.addEventListener('update', gameInfo.onfirstupdate, { once: true });
        applicationLoop.start();

        return instance;
    }

    function onFirstUpdate$1(instance, e)
    {
        let { game, display, loop, onpreupdate, onupdate, onpostupdate, onfixedupdate, onframe } = instance[GAME_INFO_PROPERTY$1];

        if (game.start) game.start.call(instance);

        onpreupdate.call(instance,e);
        onupdate.call(instance, e);
        onfixedupdate.call(instance, e);
        onpostupdate.call(instance, e);

        loop.addEventListener('preupdate', onpreupdate);
        loop.addEventListener('update', onupdate);
        loop.addEventListener('fixedupdate', onfixedupdate);
        loop.addEventListener('postupdate', onpostupdate);
        display.addEventListener('frame', onframe);
    }

    function onPreUpdate$1(instance, e)
    {
        let { game } = instance[GAME_INFO_PROPERTY$1];
        let dt = e.detail.delta;
        if (game.preupdate) game.preupdate.call(instance, dt);
    }

    function onUpdate$1(instance, e)
    {
        let { game } = instance[GAME_INFO_PROPERTY$1];
        let dt = e.detail.delta;
        if (game.update) game.update.call(instance, dt);
    }

    function onFixedUpdate$1(instance, e)
    {
        let { game } = instance[GAME_INFO_PROPERTY$1];
        if (game.fixedupdate) game.fixedupdate.call(instance);
    }

    function onPostUpdate$1(instance, e)
    {
        let { game } = instance[GAME_INFO_PROPERTY$1];
        let dt = e.detail.delta;
        if (game.postupdate) game.postupdate.call(instance, dt);
    }

    function onFrame$1(instance, e)
    {
        let { game, display, view, viewport } = instance[GAME_INFO_PROPERTY$1];
        let ctx = e.detail.context;

        // Reset any transformations...
        view.context.setTransform(1, 0, 0, 1, 0, 0);
        view.context.clearRect(0, 0, view.width, view.height);

        if (game.render) game.render.call(instance, view, instance);

        display.clear('black');
        view.drawBufferToCanvas(
            ctx,
            viewport.x,
            viewport.y,
            viewport.width,
            viewport.height
        );
    }

    async function pause(instance)
    {
        let { loop } = instance[GAME_INFO_PROPERTY$1];
        loop.pause();
    }

    async function resume(instance)
    {
        let { loop } = instance[GAME_INFO_PROPERTY$1];
        loop.resume();
    }

    function stop(instance)
    {
        let { game, loop, display, onframe, onpreupdate, onupdate, onfixedupdate, onpostupdate, onfirstupdate } = instance[GAME_INFO_PROPERTY$1];

        loop.removeEventListener('update', onfirstupdate);
        loop.removeEventListener('preupdate', onpreupdate);
        loop.removeEventListener('update', onupdate);
        loop.removeEventListener('fixedupdate', onfixedupdate);
        loop.removeEventListener('postupdate', onpostupdate);
        display.removeEventListener('frame', onframe);

        loop.stop();
        if (game.stop) game.stop.call(instance);
        return instance;
    }

    async function unload(instance)
    {
        let { game } = instance[GAME_INFO_PROPERTY$1];
        if (game.unload) await game.unload(instance);
        return instance;
    }

    var GameInterface = /*#__PURE__*/Object.freeze({
        __proto__: null,
        getGameInfo: getGameInfo$1,
        load: load,
        start: start,
        pause: pause,
        resume: resume,
        stop: stop,
        unload: unload
    });

    async function startUp(game)
    {
        let instance = await load(game);
        return start(instance);
    }

    async function nextUp(instance, nextGame)
    {
        await shutDown(instance);
        return await startUp(nextGame);
    }

    async function shutDown(instance)
    {
        stop(instance);
        await unload(instance);
        return instance;
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
    util.Eventable.mixin(SceneManager);

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
                camera.transform.x = math.lerp(camera.transform.x, target.x, speed);
                camera.transform.y = math.lerp(camera.transform.y, target.y, speed);
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

    const CONTEXT$3 = input.Input.createContext().disable();
    const UP$1 = CONTEXT$3.registerState('up', {
        'key[ArrowUp].up': 0,
        'key[ArrowUp].down': 1,
        'key[w].up': 0,
        'key[w].down': 1
    });
    const DOWN$1 = CONTEXT$3.registerState('down', {
        'key[ArrowDown].up': 0,
        'key[ArrowDown].down': 1,
        'key[s].up': 0,
        'key[s].down': 1
    });
    const LEFT$1 = CONTEXT$3.registerState('left', {
        'key[ArrowLeft].up': 0,
        'key[ArrowLeft].down': 1,
        'key[a].up': 0,
        'key[a].down': 1
    });
    const RIGHT$1 = CONTEXT$3.registerState('right', {
        'key[ArrowRight].up': 0,
        'key[ArrowRight].down': 1,
        'key[d].up': 0,
        'key[d].down': 1
    });
    const ZOOM_IN = CONTEXT$3.registerState('zoomin', {
        'key[z].up': 0,
        'key[z].down': 1
    });
    const ZOOM_OUT = CONTEXT$3.registerState('zoomout', {
        'key[x].up': 0,
        'key[x].down': 1
    });
    const ROLL_LEFT = CONTEXT$3.registerState('rollleft', {
        'key[q].up': 0,
        'key[q].down': 1
    });
    const ROLL_RIGHT = CONTEXT$3.registerState('rollright', {
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
        CONTEXT: CONTEXT$3,
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

    exports.AbstractCamera = AbstractCamera;
    exports.Camera2D = Camera2D;
    exports.Camera2DControls = Camera2DControls;
    exports.CameraHelper = CameraHelper;
    exports.EntitySpawner = EntitySpawner;
    exports.GameInterface = GameInterface;
    exports.MouseControls = MouseControls;
    exports.MoveControls = MoveControls;
    exports.SceneBase = SceneBase;
    exports.SceneManager = SceneManager;
    exports.SplashScene = SplashScene;
    exports.Transform2D = Transform2D;
    exports.nextUp = nextUp;
    exports.shutDown = shutDown;
    exports.startUp = startUp;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
