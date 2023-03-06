import { AnimationFrameLoop } from '../loop/AnimationFrameLoop';
import { applyEffects, revertEffects, useEffect } from './EffectHook';
import { ejectProviders, injectProviders, useProvider } from './ProviderHook';
import { TopicsProvider } from './TopicHook';
import { SystemUpdateTopic, useSystemUpdate } from './SystemUpdateHook';

/**
 * @template M
 * @typedef ToastHandler
 * @property {(m: M) => Promise<void>} [load]
 * @property {(m: M) => Promise<void>} [unload]
 * @property {(m: M) => void} init
 * @property {(m: M) => void} [dead]
 * @property {(m: M) => void} update
 * @property {(m: M) => void} [draw]
 */

/**
 * @template M
 * @param {M} m
 * @param {ToastHandler<M>} handler
 */
export function toast(m, handler, providers = []) {
    function GameSystem(m) {
        const topics = useProvider(m, TopicsProvider);
        useEffect(m, async () => {
            if (handler.load) await handler.load(m);
            if (handler.init) handler.init(m);
            return async () => {
                if (handler.dead) handler.dead(m);
                if (handler.unload) await handler.unload(m);
            };
        });
        useSystemUpdate(m, topics, () => {
            if (handler.update) handler.update(m);
            if (handler.draw) handler.draw(m);
        });
    }
    const result = [
        TopicsProvider,
        AnimationFrameLoopProvider,
        ...providers,
        GameSystem,
    ];
    return {
        async start() {
            injectProviders(m, result);
            await applyEffects(m, result);
            return this;
        },
        async stop() {
            await revertEffects(m, result);
            ejectProviders(m, result);
            return this;
        },
    }
}

/**
 * @template M
 * @param {M} m
 */
export function AnimationFrameLoopProvider(m) {
    const topics = useProvider(m, TopicsProvider);
    const loop = new AnimationFrameLoop((e) => {
        SystemUpdateTopic.dispatchImmediately(topics, e);
    });
    useEffect(m, () => {
        loop.start();
    });
    return loop;
}
