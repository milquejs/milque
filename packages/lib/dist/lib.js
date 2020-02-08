(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@milque/input'), require('@milque/game'), require('@milque/display'), require('@milque/util')) :
    typeof define === 'function' && define.amd ? define(['exports', '@milque/input', '@milque/game', '@milque/display', '@milque/util'], factory) :
    (global = global || self, factory(global.Lib = {}, global.input, global.game$1, global.display, global.util));
}(this, (function (exports, input, game$1, display, util) { 'use strict';

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

    async function startGame(game)
    {
        if (!game) game = {};

        let displayPort = document.querySelector('display-port');
        if (!displayPort)
        {
            displayPort = new display.DisplayPort();
            displayPort.toggleAttribute('full');
            displayPort.toggleAttribute('debug');
            document.body.appendChild(displayPort);
        }

        let instance = (game.load && await game.load(game))
            || (Object.isExtensible(game) && game)
            || {};
        
        let view = instance.view || display.View.createView();
        let viewport = instance.viewport || {
            x: 0, y: 0,
            get width() { return displayPort.getCanvas().clientWidth; },
            get height() { return displayPort.getCanvas().clientHeight; },
        };

        let gameLoop = new game$1.GameLoop();

        let gameInfo = {
            game,
            view,
            viewport,
            display: displayPort,
            loop: gameLoop,
            fixed: {
                time: 0,
                step: instance.fixedStep || 0.016667,
            },
            onframe: onFrame.bind(undefined, instance),
            onupdate: onUpdate.bind(undefined, instance),
            onfirstupdate: onFirstUpdate.bind(undefined, instance),
        };
        
        Object.defineProperty(instance, GAME_INFO_PROPERTY, {
            value: gameInfo,
            enumerable: false,
            configurable: true,
        });
        
        gameLoop.addEventListener('update', gameInfo.onfirstupdate, { once: true });
        gameLoop.start();

        return instance;
    }

    function onFirstUpdate(instance, e)
    {
        let { display, loop, onupdate, onframe } = instance[GAME_INFO_PROPERTY];
        console.log('FIRST');
        if (game.start) game.start.call(instance);

        onupdate.call(instance, e);
        loop.addEventListener('update', onupdate);
        display.addEventListener('frame', onframe);
    }

    function onUpdate(instance, e)
    {
        let { game, fixed } = instance[GAME_INFO_PROPERTY];
        let dt = e.detail.delta;

        if (game.preupdate) game.preupdate.call(instance, dt);
        if (game.update) game.update.call(instance, dt);

        if (game.fixedupdate)
        {
            let timeStep = fixed.step;
            let maxTime = timeStep * 250;
            if (fixed.time > maxTime) fixed.time = maxTime;
            else fixed.time += dt;
            while (fixed.time >= timeStep)
            {
                fixed.time -= timeStep;
                game.fixedupdate.call(instance);
            }
        }

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

    async function stopGame(instance)
    {
        let { game, onframe, onupdate, onfirstupdate } = instance[GAME_INFO_PROPERTY];

        game.loop.removeEventListener('update', onfirstupdate);
        game.loop.removeEventListener('update', onupdate);
        game.display.removeEventListener('frame', onframe);

        return await new Promise(resolve => {
            game.loop.addEventListener('stop', async () => {
                if (game.stop) game.stop();
                if (game.unload) await game.unload(instance);
                resolve(instance);
            }, { once: true });
            game.loop.stop();
        });
    }

    async function nextGame(fromInstance, toGame)
    {
        await stopGame(fromInstance);
        let result = await startGame(toGame);
        return result;
    }

    var Game = /*#__PURE__*/Object.freeze({
        __proto__: null,
        startGame: startGame,
        pauseGame: pauseGame,
        resumeGame: resumeGame,
        stopGame: stopGame,
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

    exports.EntitySpawner = EntitySpawner;
    exports.Game = Game;
    exports.MouseControls = MouseControls;
    exports.MoveControls = MoveControls;
    exports.SceneBase = SceneBase;
    exports.SceneManager = SceneManager;
    exports.SplashScene = SplashScene;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
