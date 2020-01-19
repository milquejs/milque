import { GameLoop, Input, Display, Utils, View, EntityManager, SceneManager } from './milque.js';

var game;

export const DEFAULT_VIEW = View.createView();

export function registerScene(name, scene)
{
    if (!game) game = createGame(scene);
    game.scenes.register(name, scene);
}

export function start(scene = undefined)
{
    if (!game) game = createGame(scene);
    return game.start();
}

export function nextScene(scene, transition = null, loadOpts = {})
{
    game.nextScene(scene, transition, loadOpts);
}

export function stop()
{
    game.stop();
}

export function getScene()
{
    return game.scenes.getCurrentScene();
}

export function createGame(scene)
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
                    let renderer = renderTarget.renderer || (scene ? scene.onRender : null);
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
                Utils.clearScreen(view.context, view.width, view.height);
            }
            else
            {
                view.context.clearRect(0, 0, view.width, view.height);
            }
            
            if (renderer) renderer.call(renderContext, view.context, view, this.scenes.getCurrentScene());

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
    result.scenes.on('preupdate', () => Input.poll());
    result.scenes.setSharedContext(result);
    result.scenes.nextScene(scene);
    return result;
}
