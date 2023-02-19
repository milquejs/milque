import { AnimationFrameLoop } from './AnimationFrameLoop.js';
import { EventSource, EventSourceManager } from './EventSourceManager.js';
import { DrawLayerManager } from './DrawLayerManager.js';
import { EntityManager } from './EntityManager.js';

/**
 * @template T
 * @typedef {import('./system/SystemManager').System<T>} System<T>
 */
/** @typedef {import('./system/EffectManager').EffectHandler} EffectHandler */
/** @typedef {import('./system/EffectManager').AfterEffectHandler} AfterEffectHandler */
/** @typedef {import('./system/SystemContext').SystemContext<?>} M */
/** @typedef {import('./AnimationFrameLoop').AnimationFrameLoopCallback} AnimationFrameLoopCallback */

/**
 * @param {AnimationFrameLoopCallback} callback
 */
export function createAnimationFrameLoop(callback) {
    return new AnimationFrameLoop(callback).next;
}

/** @typedef {{ deltaTime: number }} UpdateEventAttachment */
/** @type {EventSource<UpdateEventAttachment>} */
export const UpdateEvent = new EventSource('update');

/** @typedef {CanvasRenderingContext2D} DrawEventAttachment */
/** @type {EventSource<DrawEventAttachment>} */
export const DrawEvent = new EventSource('draw');

/**
 * @param {import('./M').M} m
 */
export function EventSourceManagerSystem(m) {
    return new EventSourceManager();
}

/**
 * @param {import('./M').M} m
 */
export function DrawLayerManagerSystem(m) {
    let result = new DrawLayerManager();
    useEvent(m, DrawEvent, (ctx) => {
        result.drawLayers(ctx);
    });
    return result;
}

/**
 * @param {import('./M').M} m 
 */
export function EntityManagerSystem(m) {
    let result = new EntityManager();
    useEvent(m, UpdateEvent, () => {
        result.flush();
    });
    return result;
}

/**
 * @param {import('./M').M} m 
 * @param {number} layerIndex 
 * @param {import('./DrawLayerManager').DrawCallback} drawCallback
 */
export function useDraw(m, layerIndex, drawCallback) {
    const drawLayerManager = useSystem(m, DrawLayerManagerSystem);
    useEffect(m, () => {
        drawLayerManager.addLayer(layerIndex, drawCallback);
        return () => {
            drawLayerManager.removeLayer(layerIndex, drawCallback);
        };
    });
}

/**
 * @param {import('./M').M} m 
 * @param {import('./EventSourceManager').EventCallback<UpdateEventAttachment>} callback
 */
export function useUpdate(m, callback) {
    useEvent(m, UpdateEvent, callback);
}

/**
 * @template T
 * @param {import('./M').M} m 
 * @param {import('./EventSourceManager').EventSource<T>} eventSource 
 * @param {import('./EventSourceManager').EventCallback<T>} callback 
 */
export function useEvent(m, eventSource, callback) {
    let events = useSystem(m, EventSourceManagerSystem);
    // @ts-ignore
    eventSource.register(events);
    useEffect(m, () => {
        eventSource.on(callback);
        return () => {
            eventSource.off(callback);
        };
    });
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
