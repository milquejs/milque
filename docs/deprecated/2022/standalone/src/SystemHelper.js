import { EntityManager } from './ecs/EntityManager.js';

export function createState(ctx) {
    return {
        nextHookId: 1,
        state: {},
        ...ctx,
    };
}

/**
 * @template T
 * @param {object} m 
 * @param {T|() => T} value 
 * @returns {T}
 */
export function useState(m, value) {
    let hookId = m.nextHookId++;
    if (hookId in state) {
        return state[hookId];
    }
    let result = value;
    if (typeof value === 'function') {
        result = value(m);
    }
    state[hookId] = result;
    return result;
}

export function useEntityManager(m) {
    return useState(m, () => new EntityManager());
}
