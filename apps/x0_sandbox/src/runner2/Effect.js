import { useCurrentProvider, using, whenInstalled, whenUninstalled } from './Provider';
import { RunningTopic, StartingTopic, StoppingTopic, TopicProvider } from './Runner';

/**
 * @typedef {() => Promise<() => void>|(() => void)|Promise<void>|void} ProviderEffectHandler
 * @typedef {(frameDetail: import('@milque/scene').AnimationFrameDetail) => Promise<(frameDetail: import('@milque/scene').AnimationFrameDetail) => void>|((frameDetail: import('@milque/scene').AnimationFrameDetail) => void)|Promise<void>|void} FrameEffectHandler
 * @typedef {() => Promise<() => void>|(() => void)|Promise<void>|void} RunnerEffectHandler
 */

/**
 * @param {object} m 
 * @param {ProviderEffectHandler} handler
 */
export function useProviderEffect(m, handler) {
    const provider = useCurrentProvider(m);
    const ref = { current: null };
    whenInstalled(m, provider)
        .then(handler)
        .then(result => ref.current = result);
    whenUninstalled(m, provider)
        .then(() => typeof ref.current === 'function' && ref.current());
}

/**
 * @param {object} m 
 * @param {number} priority 
 * @param {FrameEffectHandler} handler 
 */
export function useFrameEffect(m, priority, handler) {
    const topics = using(m, TopicProvider);
    const ref = { current: null };
    if (priority >= Number.POSITIVE_INFINITY) {
        throw new Error('useFrameEffect() priority must be less than positive infinity.');
    }
    /**
     * @param {import('@milque/scene').AnimationFrameDetail} frameDetail 
     */
    function beforeCallback(frameDetail) {
        const after = handler(frameDetail);
        ref.current = after;
    }
    /**
     * @param {import('@milque/scene').AnimationFrameDetail} frameDetail 
     */
    function afterCallback(frameDetail) {
        const after = ref.current;
        ref.current = null;
        if (typeof after === 'function') {
            after(frameDetail);
        }
    }
    useProviderEffect(m, () => {
        RunningTopic.on(topics, priority, beforeCallback);
        RunningTopic.on(topics, Number.POSITIVE_INFINITY, afterCallback);
        return () => {
            RunningTopic.off(topics, beforeCallback);
            RunningTopic.off(topics, afterCallback);
        };
    });
}

/**
 * @param {object} m 
 * @param {number} priority 
 * @param {RunnerEffectHandler} handler 
 */
export function useRunnerEffect(m, priority, handler) {
    const topics = using(m, TopicProvider);
    const ref = { current: null };
    if (!Number.isFinite(priority)) {
        throw new Error('useFrameEffect() priority must be finite.');
    }
    async function beforeCallback() {
        const after = await handler();
        ref.current = after;
    }
    async function afterCallback() {
        const after = ref.current;
        ref.current = null;
        if (typeof after === 'function') {
            await after();
        }
    }
    useProviderEffect(m, () => {
        StartingTopic.on(topics, priority, beforeCallback);
        StoppingTopic.on(topics, priority, afterCallback);
        return () => {
            StartingTopic.off(topics, beforeCallback);
            StoppingTopic.off(topics, afterCallback);
        };
    });
}
