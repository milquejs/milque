import { DisplayPort } from '@milque/display';
import { InputPort } from '@milque/input';
import { AnimationFrameLoop, Topic, TopicManager, injectProviders, ejectProviders, useProvider, applyEffects, revertEffects, useEffect } from '@milque/scene';
import * as Toast from './Game.js';

/**
 * @typedef {object} M
 * 
 * @typedef ToastHandler
 * @property {(m: M) => Promise<void>} [load]
 * @property {(m: M) => Promise<void>} [unload]
 * @property {(m: M) => void} [init]
 * @property {(m: M) => void} [dead]
 * @property {(m: M) => void} [update]
 * @property {(m: M) => void} [draw]
 */

export async function main() {
    let providers = [
        TopicManagerProvider,
        AnimationFrameLoopProvider,
        DisplayProvider,
        InputProvider,
        Canvas2dProvider,
        ToastSystem,
    ];
    let m = {};
    try {
        injectProviders(m, providers);
        applyEffects(m, providers);
    } catch {
        revertEffects(m, providers);
        ejectProviders(m, providers);
    }
}

export function ToastSystem(m) {
    useEffect(m, async () => {
        if (Toast.load) await Toast.load(m);
        if (Toast.init) Toast.init(m);
        return async () => {
            if (Toast.dead) Toast.dead(m);
            if (Toast.unload) await Toast.unload(m);
        };
    });
    useTopic(m, UpdateTopic, 0, () => {
        if (Toast.update) Toast.update(m);
        if (Toast.draw) Toast.draw(m);
    });
}

/**
 * @type {Topic<AnimationFrameLoop>}
 */
export const UpdateTopic = new Topic('main.update');

/**
 * @template T
 * @param {M} m 
 * @param {Topic<T>} topic 
 * @param {number} priority 
 * @param {import('@milque/scene').TopicCallback<T>} callback 
 */
export function useTopic(m, topic, priority, callback) {
    const topics = useProvider(m, TopicManagerProvider);
    useEffect(m, () => {
        topic.on(topics, priority, callback);
        return () => {
            topic.off(topics, callback);
        };
    });
}

/**
 * @param {M} m
 */
export function TopicManagerProvider(m) {
    let topics = new TopicManager();
    useEffect(m, () => {
        let callback = () => {
            topics.flush();
        };
        UpdateTopic.on(topics, 0, callback);
        return () => {
            UpdateTopic.off(topics, callback);
        };
    });
    return topics;
}

/**
 * @param {M} m
 */
export function AnimationFrameLoopProvider(m) {
    let topics = useProvider(m, TopicManagerProvider);
    let loop = new AnimationFrameLoop((e) => {
        UpdateTopic.dispatchImmediately(topics, e);
    });
    useEffect(m, () => {
        loop.start();
    });
    return {
        loop,
    };
}

/**
 * @param {M} m
 */
export function Canvas2dProvider(m) {
    let { canvas } = useProvider(m, DisplayProvider);
    return {
        ctx: canvas.getContext('2d'),
    };
}

/**
 * @param {M} m
 */
export function DisplayProvider(m) {
    let display = DisplayPort.create({ id: 'display', debug: true });
    let canvas = display.canvas;
    return {
        display,
        canvas,
    };
}

/**
 * @param {M} m
 */
export function InputProvider(m) {
    let input = InputPort.create({ for: 'display' });
    let context = input.getContext('axisbutton');
    useTopic(m, UpdateTopic, -1, (e) => {
        context.poll(e.detail.currentTime);
    });
    return {
        axb: context,
    };
}
