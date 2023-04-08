import { AnimationFrameLoop, AsyncTopic, Topic, TopicManager } from '@milque/scene';
import { install, preinstall, useCurrentProvider, using, whenInstalled, whenUninstalled } from './Provider';

/** @type {Topic<import('@milque/scene').AnimationFrameDetail>} */
export const AnimationFrameTopic = new Topic('animationframe');

export async function RunModule(m) {
    await install(m, TopicProvider, AnimationFrameProvider);
    await install(m, Runner);
}

export async function TopicProvider(m) {
    const topics = new TopicManager();
    await preinstall(m, topics);
    when(m, AnimationFrameTopic, Number.POSITIVE_INFINITY, () => topics.flush());
    return topics;
}

export function AnimationFrameProvider(m) {
    const topics = using(m, TopicProvider);
    return new AnimationFrameLoop(
        (loop) => AnimationFrameTopic.dispatchImmediately(topics, loop.detail));
}

/**
 * @template T
 * @param {object} m 
 * @param {Topic<T>} topic 
 * @param {number} priority 
 * @param {(attachment: T) => any} callback 
 */
export function when(m, topic, priority, callback) {
    const topics = using(m, TopicProvider);
    const provider = useCurrentProvider(m);
    whenInstalled(m, provider).then(() => topic.on(topics, priority, callback));
    whenUninstalled(m, provider).then(() => topic.off(topics, callback));
}

/**
 * @template T
 * @param {object} m 
 * @param {AsyncTopic<T>} topic 
 * @param {number} priority 
 * @param {(attachment: T) => Promise<any>} callback 
 */
export function whenAsync(m, topic, priority, callback) {
    const topics = using(m, TopicProvider);
    const provider = useCurrentProvider(m);
    whenInstalled(m, provider).then(() => topic.on(topics, priority, callback));
    whenUninstalled(m, provider).then(() => topic.off(topics, callback));
}

/** @type {AsyncTopic<import('@milque/scene').AnimationFrameDetail>} */
export const RunFirstTopic = new AsyncTopic('run.first');
/** @type {AsyncTopic<import('@milque/scene').AnimationFrameDetail>} */
export const RunLastTopic = new AsyncTopic('run.last');
/** @type {Topic<import('@milque/scene').AnimationFrameDetail>} */
export const RunStepTopic = new Topic('run.step');

/**
 * @param {object} m
 */
export function Runner(m) {
    const loop = using(m, AnimationFrameProvider);
    const topics = using(m, TopicProvider);

    when(m, AnimationFrameTopic, 0,
        (frameDetail) => RunStepTopic.dispatchImmediately(topics, frameDetail));
    
    return {
        async start() {
            if (loop.handle) {
                return;
            }
            await RunFirstTopic.dispatchImmediately(topics, loop.detail);
            loop.start();
        },
        async stop() {
            if (!loop.handle) {
                return;
            }
            loop.cancel();
            await RunLastTopic.dispatchImmediately(topics, loop.detail);
        },
    };
}
