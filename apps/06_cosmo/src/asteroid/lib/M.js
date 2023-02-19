import { AnimationFrameLoop } from '@milque/scene';

/**
 * @template T
 * @typedef {import('./system/SystemManager').System<T>} System<T>
 */
/** @typedef {import('./system/EffectManager').EffectHandler} EffectHandler */
/** @typedef {import('./system/EffectManager').AfterEffectHandler} AfterEffectHandler */
/** @typedef {import('./system/SystemContext').SystemContext<?>} M */
/** @typedef {import('@milque/scene').AnimationFrameLoopCallback} AnimationFrameLoopCallback */

/**
 * @param {AnimationFrameLoopCallback} callback
 */
export function createAnimationFrameLoop(callback) {
    return new AnimationFrameLoop(callback).next;
}

/**
 * @template T
 * @param {M} m 
 * @param {System<T>} system
 * @returns {T}
 */
export function useSystem(m, system) {
    return m.use(system);
}

/**
 * @param {M} m
 * @param {EffectHandler} callback
 */
export function useEffect(m, callback) {
    m.before(callback);
}

/**
 * @param {M} m 
 * @param {AfterEffectHandler} callback 
 */
export function useAfterEffect(m, callback) {
    m.after(callback);
}
