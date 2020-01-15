import { GameLoop, Input, Display, Utils } from './milque.js';
import * as View from './View.js';

var game;
var scenes = new Map();

export function registerScene(name, scene)
{
    scenes.set(name, scene);
}

export function start(scene, context = {})
{
    return game = createGame(scene, context).start();
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
export function createGame(scene, context = {})
{
    let result = {
        world: context,
        loop: GameLoop.createGameLoop(context),
        scene: null,
        _renders: new Map(),
        _transition: null,
        _nextTransition: null,
        _nextScene: scene,
        registerView(view, target = null, renderer = null)
        {
            this._renders.set(view, { view, target, renderer });
            return this;
        },
        unregisterView(view)
        {
            this._renders.delete(view);
            return this;
        },
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
                    if ('unload' in this.scene) result = result.then(() => this.scene.unload.call(this.world, this));
                }

                if ('load' in nextScene) result = result.then(() => nextScene.load.call(this.world, this));

                result = result.then(() => {
                    // Create a default view if there wasn't one created already...
                    if (this._renders.size <= 0) this.registerView(View.createView(), nextScene);

                    this.scene = nextScene;
                    this._transition = null;

                    if ('onStart' in this.scene) this.scene.onStart.call(this.world);
                });
            }
            else if (this.scene)
            {
                this._updateStep(dt, this.scene);
            }

            // Do render regardless of loading...
            this.render();
        },
        _updateStep(dt, target)
        {
            if ('onPreUpdate' in target) target.onPreUpdate.call(this.world, dt);

            Input.poll();

            if ('onUpdate' in target) target.onUpdate.call(this.world, dt);
            if ('onPostUpdate' in target) target.onPostUpdate.call(this.world, dt);
        },
        render()
        {
            let first = true;
            for(let renderInfo of this._renders.values())
            {
                let target = renderInfo.target || this._transition || this.world;
                let renderer = renderInfo.renderer || (target ? target.onRender : null) || (this.scene ? this.scene.onRender : null);
                this._renderStep(renderInfo.view, target, renderer, first);
                first = false;
            }
        },
        _renderStep(view, target, renderer = null, first = true)
        {
            // TODO: Something more elegant please? I don't think we need the flag.
            if (first)
            {
                Utils.clearScreen(view.context, view.width, view.height);
            }
            else
            {
                view.context.clearRect(0, 0, view.width, view.height);
            }

            View.applyViewTransform(view);
            if (renderer) renderer.call(target, view.context, view, this.world);
            View.resetViewTransform(view);

            // NOTE: The renderer can define a custom viewport to draw to
            if (renderer && renderer.viewPort)
            {
                View.drawBufferToCanvas(renderer.viewPort.context, view.canvas, renderer.viewPort.x, renderer.viewPort.y, renderer.viewPort.width, renderer.viewPort.height);
            }
            else
            {
                View.drawBufferToCanvas(Display.getDrawContext(), view.canvas);
            }
        }
    };
    result.loop.on('update', result.update.bind(result));
    return result;
}
