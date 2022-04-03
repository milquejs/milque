import { nextAvailableHookHandle } from '../SystemManager.js';

/**
 * @typedef {import('../SystemManager.js').SystemContext} SystemContext
 * @typedef {import('../SystemManager.js').SystemHandler} SystemHandler
 */

/**
 * @param {SystemContext} m
 * @param {SystemHandler} handler
 */
export function useEffect(m, handler) {
    let handle = nextAvailableHookHandle(m);
    m.__manager__.systems.get(m.name).handlers.pending[handle] = handler;
}

export class EffectManager {
    constructor(systems) {
        this.systems = systems;
    }

    onSystemInitialize(context) {
        
    }

    onSystemTerminate(context) {
        
    }
}
