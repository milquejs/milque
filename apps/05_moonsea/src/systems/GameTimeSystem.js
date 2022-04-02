import { getSystemState } from '../SystemManager.js';
import { useDisplayPortFrame } from './DisplayPortSystem.js';

/** @typedef {import('../SystemManager.js').SystemContext} SystemContext */

export function useGameTime(m) {
    const { time } = getSystemState(m, GameTimeSystem);
    return time;
}

export function useGameTimeChanger(m) {
    function multiplyGameTime(multiplier) {
        let n = getSystemState(m, GameTimeSystem);
        n.multiplier = multiplier;
    }
    return [multiplyGameTime];
}

/**
 * @template {SystemContext} T
 * @param {T} m
 */
export function GameTimeSystem(m) {
    const state = {
        time: {
            now: performance.now(),
            deltaTime: 0,
        },
        multiplier: 1,
    };
    useDisplayPortFrame(m, (e) => {
        state.time.now = e.detail.now * state.multiplier;
        state.time.deltaTime = e.detail.deltaTime * state.multiplier;
    });
    return state;
}
