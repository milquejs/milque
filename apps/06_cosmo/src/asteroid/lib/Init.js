import { Scene } from './Scene.js';
import { AnimationFrameLoop } from './AnimationFrameLoop.js';

/** @typedef {import('./lib/AnimationFrameLoop').AnimationFrameLoopCallback} AnimationFrameLoopCallback */
/** @typedef {import('./lib/Scene').SceneInitializationCallback} SceneInitializationCallback */

/**
 * @param {AnimationFrameLoopCallback} callback
 */
export function createAnimationFrameLoop(callback) {
    return new AnimationFrameLoop(callback).next;
}

export class SceneManager {

    /** @param {Array<SceneInitializationCallback>} scenes */
    constructor(scenes = []) {
        this.scenes = scenes.map(scene => new Scene(scene));
        this.first = false;
    }

    async initialize(m) {
        for (let scene of this.scenes) {
            let n = {
                ...m,
                currentScene: scene,
            };
            await scene.initialize(n);
        }
    }

    async terminate() {
        for (let scene of this.scenes.slice().reverse()) {
            await scene.terminate();
        }
    }

    dispatchUpdate(e) {
        if (!this.first) {
            this.first = true;
            for (let scene of this.scenes) {
                scene.dispatchEvent('first', e.detail);
            }
        } else {
            for (let scene of this.scenes) {
                scene.dispatchEvent('update', e.detail);
            }
        }
    }
}
