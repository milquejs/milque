import { Topic } from '../topic/Topic';
import { useEffect } from './EffectHook';

/**
 * @type {Topic<import('../loop/AnimationFrameLoop').AnimationFrameLoop>}
 */
export const SystemUpdateTopic = new Topic('main.update');

/**
 * @template M
 * @param {M} m 
 * @param {import('../topic/TopicManager').TopicManager} topics 
 * @param {import('../topic/TopicManager').TopicCallback<import('../loop/AnimationFrameLoop').AnimationFrameLoop>} callback 
 */
export function useSystemUpdate(m, topics, callback) {
    useEffect(m, () => {
        SystemUpdateTopic.on(topics, 0, callback);
        return () => {
            SystemUpdateTopic.off(topics, callback);
        };
    });
}
