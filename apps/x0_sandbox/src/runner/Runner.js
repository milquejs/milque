import { AnimationFrameLoop, Topic, TopicManager } from '@milque/scene';

import { injectProviders, ejectProviders, getProviderState, getCurrentProvider, setCurrentProvider, createOverrideProvider, hasProviderState } from './Provider';
import { applyEffects, revertEffects, registerAfterEffect, registerEffect } from './Effect';
import { getRunConfiguration, setRunConfiguration } from './RunConfiguration';

const SystemPreload = new Topic('system.preload');

/** @type {Topic<null>} */
const SystemInit = new Topic('system.init');
/** @type {Topic<null>} */
const SystemDead = new Topic('system.dead');
/**
 * @type {Topic<AnimationFrameLoop>}
 */
const SystemUpdate = new Topic('system.update');
/**
 * @type {Topic<AnimationFrameLoop>}
 */
const SystemDraw = new Topic('system.draw');

/**
 * @template M
 * @param {import('./RunConfiguration').Runner<M>|((m: M) => Promise<void>|void)} handler
 * @param {import('./Provider').Provider<?, ?>[]} [dependencies]
 * @param {M} [initial]
 */
export async function run(handler, dependencies = [], initial = undefined) {
    const runner = typeof handler === 'function' ? { init: () => {}, main: handler } : handler;
    const state = initial || {};
    const providers = [
        __RUNNER__,
        ...dependencies,
        __END__,
    ];
    setRunConfiguration(state, runner, providers.slice(1, providers.length - 1));
    await startRunner(state, providers);
}

/**
 * @template M
 * @param {M} m
 */
function __RUNNER__(m) {
    const topics = new TopicManager();
    const loop = new AnimationFrameLoop((e) => {
        SystemUpdate.dispatchImmediately(topics, e);
        topics.flush();
        SystemDraw.dispatchImmediately(topics, e);
    });
    const { id, runner, providers } = getRunConfiguration(m);

    registerSystemTopic(m, topics, SystemUpdate, () => {
        setCurrentProvider(m, __RUNNER__);
        if (runner.update) runner.update(m);
        setCurrentProvider(m, null);
    });
    registerSystemTopic(m, topics, SystemDraw, () => {
        setCurrentProvider(m, __RUNNER__);
        if (runner.draw) runner.draw(m);
        setCurrentProvider(m, null);
    });
    registerSystemTopic(m, topics, SystemPreload, async () => {
        setCurrentProvider(m, __RUNNER__);
        if (runner.preload) await runner.preload(m);
        setCurrentProvider(m, null);
    });
    registerSystemTopic(m, topics, SystemInit, () => {
        setCurrentProvider(m, __RUNNER__);
        if (runner.init) runner.init(m);
        setCurrentProvider(m, null);
    });
    registerSystemTopic(m, topics, SystemDead, () => {
        setCurrentProvider(m, __RUNNER__);
        if (runner.dead) runner.dead(m);
        setCurrentProvider(m, null);
    });

    registerEffect(m, async () => {
        await SystemPreload.dispatchImmediatelyAndWait(topics, null);
        SystemInit.dispatchImmediately(topics, null);
        setCurrentProvider(m, __RUNNER__);
        if (runner.main) await runner.main(m);
        setCurrentProvider(m, null);
        return async () => {
            await SystemDead.dispatchImmediatelyAndWait(topics, null);
        };
    });

    return {
        id,
        runner,
        providers,
        topics,
        loop,
        async stop() {
            await stopRunner(m, providers);
        },
        async restart() {
            await restartRunner(m, providers);
        },
    };
}

/**
 * @template M
 * @param {M} m
 */
function __END__(m) {
    // NOTE: A placeholder for the end of the dependency list.
}

function registerSystemTopic(m, topics, topic, callback) {
    topic.on(topics, 0, callback);
    registerAfterEffect(m, () => {
        topic.off(topics, callback);
    });
}

async function startRunner(state, providers) {
    injectProviders(state, providers);
    await applyEffects(state, providers);

    const { loop } = getProviderState(state, __RUNNER__);
    loop.start();
}

async function stopRunner(state, providers) {
    const { loop } = getProviderState(state, __RUNNER__);
    loop.cancel();

    await revertEffects(state, providers);
    ejectProviders(state, providers);
}

async function restartRunner(state, providers) {
    await stopRunner(state, providers);
    await startRunner(state, providers);
}

/**
 * @template M
 * @param {M} m
 */
export function useCurrentRunner(m) {
    return getProviderState(m, __RUNNER__);
}

/**
 * @template M
 * @param {M} m
 */
export function useCurrentProvider(m) {
    return getCurrentProvider(m);
}

/**
 * @template M
 * @param {M} m
 */
export function useCurrentAnimationFrameDetail(m) {
    const { loop } = useCurrentRunner(m);
    return loop.detail;
}

/**
 * @template M, T
 * @param {M} m 
 * @param {Topic<T>} topic 
 * @param {number} priority 
 * @param {import('@milque/scene').TopicCallback<T>} callback 
 */
export function useWhen(m, topic, priority, callback) {
    const { topics } = useCurrentRunner(m);
    topic.on(topics, priority, callback);
    registerAfterEffect(m, () => {
        topic.off(topics, callback);
    });
    return topic;
}

/**
 * @template M
 * @param {M} m
 * @param {number} priority
 * @param {(attachment: null) => Promise<void>} callback
 */
export function useWhenSystemPreload(m, priority, callback) {
    if (getCurrentProvider(m) === __RUNNER__) {
        throw new Error('Cannot use system topics from runner - use preload() instead.');
    }
    return useWhen(m, SystemPreload, priority, /** @type {?} */ (callback));
}

/**
 * @template M
 * @param {M} m
 * @param {number} priority
 * @param {import('@milque/scene').TopicCallback<null>} callback
 */
export function useWhenSystemInit(m, priority, callback) {
    if (getCurrentProvider(m) === __RUNNER__) {
        throw new Error('Cannot use system topics from runner - use init() instead.');
    }
    return useWhen(m, SystemInit, priority, callback);
}

/**
 * @template M
 * @param {M} m
 * @param {number} priority
 * @param {import('@milque/scene').TopicCallback<null>} callback
 */
export function useWhenSystemDead(m, priority, callback) {
    if (getCurrentProvider(m) === __RUNNER__) {
        throw new Error('Cannot use system topics from runner - use dead() instead.');
    }
    return useWhen(m, SystemDead, priority, callback);
}

/**
 * @template M
 * @param {M} m
 * @param {number} priority
 * @param {import('@milque/scene').TopicCallback<AnimationFrameLoop>} callback
 */
export function useWhenSystemUpdate(m, priority, callback) {
    if (getCurrentProvider(m) === __RUNNER__) {
        throw new Error('Cannot use system topics from runner - use update() instead.');
    }
    return useWhen(m, SystemUpdate, priority, callback);
}

/**
 * @template M
 * @param {M} m
 * @param {number} priority
 * @param {import('@milque/scene').TopicCallback<AnimationFrameLoop>} callback
 */
export function useWhenSystemDraw(m, priority, callback) {
    if (getCurrentProvider(m) === __RUNNER__) {
        throw new Error('Cannot use system topics from runner - use draw() instead.');
    }
    return useWhen(m, SystemDraw, priority, callback);
}

/**
 * @template M, T
 * @param {M} m 
 * @param {import('./Provider').Provider<M, T>} provider
 * @param {any} [defaultValue]
 * @returns {T}
 */
export function useOptionalContext(m, provider, defaultValue = null) {
    if (hasProviderState(m, provider)) {
        return getProviderState(m, provider);
    } else {
        return defaultValue;
    }
}

export const useContext = getProviderState;
export const useEffect = registerEffect;
export const useAfterEffect = registerAfterEffect;
export const Override = createOverrideProvider;
