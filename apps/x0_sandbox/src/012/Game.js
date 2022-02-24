import { GameLoop, Input, Display, Utils } from './milque.js';
import * as View from './View.js';

var game;
var scenes = new Map();

export const DEFAULT_VIEW = View.createView();

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
        _renderTargets: new Map(),
        _transition: null,
        _nextTransition: null,
        _nextScene: scene,
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
                // TODO: Transitions should have their own methods and not just be tiny scenes...
                
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
            if (this._renderTargets.size <= 0)
            {
                this._renderStep(DEFAULT_VIEW,
                    this.scene ? this.scene.onRender : null,
                    null,
                    this._transition || this.world,
                    true);
            }
            else
            {
                // TODO: In the future, renderer should be completely separate from the scene.
                // Perhaps not even handled in Game.js ...
                let first = true;
                for(let renderTarget of this._renderTargets.values())
                {
                    let view = renderTarget.view;
                    let renderer = renderTarget.renderer || (this.scene ? this.scene.onRender : null);
                    let viewPort = renderTarget.viewPort;
                    let context = renderTarget.context || this._transition || this.world;
                    this._renderStep(view, renderer, viewPort, context, first);
                    first = false;
                }
            }
        },
        _renderStep(view, renderer = null, viewPort = null, context = null, first = true)
        {
            // Reset any transformations...
            view.context.setTransform(1, 0, 0, 1, 0, 0);

            // TODO: Something more elegant please? I don't think we need the flag.
            if (first)
            {
                Utils.clearScreen(view.context, view.width, view.height);
            }
            else
            {
                view.context.clearRect(0, 0, view.width, view.height);
            }
            
            if (renderer) renderer.call(context, view.context, view, this.world);

            // NOTE: The renderer can define a custom viewport to draw to
            if (viewPort)
            {
                View.drawBufferToCanvas(viewPort.getContext(), view.canvas, viewPort.getX(), viewPort.getY(), viewPort.getWidth(), viewPort.getHeight());
            }
            // TODO: Is there a way to get rid of this?
            else if (Display.getDrawContext())
            {
                View.drawBufferToCanvas(Display.getDrawContext(), view.canvas);
            }
        }
    };
    result.loop.on('update', result.update.bind(result));
    return result;
}
