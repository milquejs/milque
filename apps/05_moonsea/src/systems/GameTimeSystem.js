import { getSystemContext } from '../SystemManager.js';
import { useDisplayPortFrame } from './DisplayPortSystem.js';

/** @typedef {import('../SystemManager.js').SystemContext} SystemContext */

export function useGameTime(m) {
    const { time } = getSystemContext(m, GameTimeSystem);
    return time;
}

export function useGameTimeChanger(m) {
    function multiplyGameTime(multiplier) {
        let n = getSystemContext(m, GameTimeSystem);
        n.multiplier = multiplier;
    }
    return [multiplyGameTime];
}

/**
 * @template {SystemContext} T
 * @param {T} m
 */
export function GameTimeSystem(m) {
    m.time = {
        now: performance.now(),
        deltaTime: 0,
    };
    m.multiplier = 1;
    useDisplayPortFrame(m, (e) => {
        m.time.now = e.detail.now * m.multiplier;
        m.time.deltaTime = e.detail.deltaTime * m.multiplier;
    });
    return /** @type {T&{ time: { now: number, deltaTime: number } }} */ (m);
}
