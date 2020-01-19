import { Eventable } from './milque.js';

const NO_TRANSITION = {};

export class SceneManager
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
            else
            {
                // It's all good.
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
}
Eventable.mixin(SceneManager);

function createExtensibleSceneFromModule(sceneModule)
{
    return {
        ...sceneModule
    };
}
