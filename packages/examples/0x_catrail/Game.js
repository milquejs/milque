import { GameLoop, Input, Viewport, Display, Utils } from './milque.js';
import { Transform } from './Transform.js';

var game;
var scenes = new Map();

export function registerScene(name, scene)
{
    scenes.set(name, scene);
}

export function start(scene, width = 640, height = 480, context = {})
{
    return game = createGame(scene, Viewport.createView(width, height), context).start();
}

export function nextScene(scene, transition = undefined)
{
    if (typeof scene === 'string') scene = scenes.get(scene);

    game.nextScene(scene, transition);
}

export function stop()
{
    game.stop();
}

export function getScene()
{
    return game.scene;
}

const NO_TRANSITION = {};
export function createGame(scene, view = Viewport.createView(640, 480), context = {})
{
    view.transform = new Transform();
    view.x = 0;
    view.y = 0;

    let result = {
        world: context,
        view: view,
        loop: GameLoop.createGameLoop(context),
        scene: null,
        _transition: null,
        _nextTransition: null,
        _nextScene: scene,
        nextScene(scene, transition = undefined)
        {
            if (!this._nextScene)
            {
                this._nextScene = scene;

                // NOTE: Transition MUST NEVER be null while switching scenes as it
                // also serves as the flag to stop scene updates.
                this._nextTransition = transition || NO_TRANSITION;
            }
            else
            {
                throw new Error('Cannot change scenes while in the middle of a scene transition');
            }
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
            if (this._transition)
            {
                // Waiting for scene load...
                this._updateStep(dt, this._transition);
            }
            else if (this._nextScene)
            {
                // Starting next scene request...
                const nextScene = this._nextScene;
                const nextTransition = this._nextTransition;
                this._nextScene = null;
                this._nextTransition = null;

                this._transition = nextTransition;

                let result = Promise.resolve();
                if (this.scene)
                {
                    if ('onStop' in this.scene) this.scene.onStop.call(this.world);
                    if ('unload' in this.scene) result = result.then(() => this.scene.unload.call(this.world));
                }
                if ('load' in nextScene) result = result.then(() => nextScene.load.call(this.world));
                result = result.then(() => {
                    this.scene = nextScene;
                    this._transition = null;

                    if ('onStart' in this.scene) this.scene.onStart.call(this.world);
                });
            }
            else if (this.scene)
            {
                this._updateStep(dt, this.scene);
            }
        },
        _updateStep(dt, target)
        {
            if ('onPreUpdate' in target) target.onPreUpdate.call(this.world, dt);

            Input.poll();

            if ('onUpdate' in target) target.onUpdate.call(this.world, dt);
            if ('onPostUpdate' in target) target.onPostUpdate.call(this.world, dt);
            
            Utils.clearScreen(this.view.context, this.view.width, this.view.height);
            this.view.context.setTransform(this.view.transform.matrix);
            if ('onRender' in target) target.onRender.call(this.world, this.view.context, this.view, this.world);
            this.view.context.setTransform(1, 0, 0, 1, 0, 0);
            Display.drawBufferToScreen(this.view.context, this.view.x, this.view.y);
        }
    };
    result.loop.on('update', result.update.bind(result));
    return result;
}
