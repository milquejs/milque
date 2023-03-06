import { useProvider } from './ProviderHook';
import { useEffect } from './EffectHook';
import { TopicManager } from '../topic/TopicManager';
import { useSystemUpdate } from './SystemUpdateHook';

/**
 * @template M, T
 * @param {M} m 
 * @param {import('../topic/Topic').Topic<T>} topic 
 * @param {number} priority 
 * @param {import('../topic/Topic').TopicCallback<T>} callback 
 */
export function useTopic(m, topic, priority, callback) {
    const topics = useProvider(m, TopicsProvider);
    useEffect(m, () => {
        topic.on(topics, priority, callback);
        return () => {
            topic.off(topics, callback);
        };
    });
}

/**
 * @template M
 * @param {M} m
 */
export function TopicsProvider(m) {
    const topics = new TopicManager();
    useSystemUpdate(m, topics, () => {
        topics.flush();
    });
    return topics;
}
