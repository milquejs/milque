import { AssetManager } from '@milque/asset';

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/input').InputContext} InputContext
 * @typedef {import('@milque/input').InputPort} InputPort
 */

export function game() {
    /** @type {DisplayPort} */
    const display = document.querySelector('#display');
    /** @type {InputContext} */
    const inputs = /** @type {InputPort} */
        (document.querySelector('#inputs')).getContext('axisbutton');
    return {
        display,
        inputs,
        assets: AssetManager,
        now: 0,
        deltaTime: 0,
    };
}