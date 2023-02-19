import { useSystem } from './M';

/**
 * @param {import('./M').M} m
 */
export function DisplayPortSystem(m) {
    /** @type {import('@milque/display').DisplayPort} */
    const display = document.querySelector('#display');
    const canvas = display.canvas;
    const ctx = canvas.getContext('2d');

    this.display = display;
    this.canvas = canvas;
    this.ctx = ctx;

    return this;
}

/**
 * @param {import('./M').M} m
 */
export function useCanvas(m) {
    const { canvas } = useSystem(m, DisplayPortSystem);
    return canvas;
}
