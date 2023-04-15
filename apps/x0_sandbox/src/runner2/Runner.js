import { AnimationFrameLoop, AsyncTopic, Topic, TopicManager } from '@milque/scene';
import { install, preinstall, using } from './Provider';

import { useProviderEffect } from './Effect';

/** @type {Topic<import('@milque/scene').AnimationFrameDetail>} */
export const AnimationFrameTopic = new Topic('animationframe');

export async function RunModule(m) {
    await install(m, TopicProvider, AnimationFrameProvider);
    await install(m, Runner);
}

export async function TopicProvider(m) {
    const topics = new TopicManager();
    await preinstall(m, topics);

    const callback = () => topics.flush();
    useProviderEffect(m, () => {
        AnimationFrameTopic.on(topics, Number.POSITIVE_INFINITY, callback);
        return () => AnimationFrameTopic.off(topics, callback);
    });
    return topics;
}

export function AnimationFrameProvider(m) {
    const topics = using(m, TopicProvider);
    return new AnimationFrameLoop(
        (loop) => AnimationFrameTopic.dispatchImmediately(topics, loop.detail));
}

/** @type {Topic<import('@milque/scene').AnimationFrameDetail>} */
export const RunningTopic = new Topic('runner.run');
export const StartingTopic = new AsyncTopic('runner.start');
export const StoppingTopic = new AsyncTopic('runner.start');

/**
 * @param {object} m
 */
export function Runner(m) {
    const loop = using(m, AnimationFrameProvider);
    const topics = using(m, TopicProvider);

    const callback = (frameDetail) => RunningTopic.dispatchImmediately(topics, frameDetail);
    useProviderEffect(m, () => {
        AnimationFrameTopic.on(topics, 0, callback);
        return () => AnimationFrameTopic.off(topics, callback);
    });

    return {
        async start() {
            if (loop.handle) {
                return;
            }
            await StartingTopic.dispatchImmediately(topics);
            loop.start();
        },
        async stop() {
            if (!loop.handle) {
                return;
            }
            await StoppingTopic.dispatchImmediately(topics);
            loop.cancel();
        },
    };
}
