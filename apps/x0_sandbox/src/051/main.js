import { DisplayPort } from '@milque/display';
import { InputPort } from '@milque/input';
import { Toaster } from '@milque/scene';
import * as Toast from './Game.js';

/** @typedef {object} M */

export async function main() {
    let toast = Toaster.toast({}, Toast, [
        DisplayProvider,
        InputProvider,
        Canvas2dProvider,
    ]);
    await toast.start();
}

/**
 * @param {M} m
 */
export function Canvas2dProvider(m) {
    let { canvas } = Toaster.useProvider(m, DisplayProvider);
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
    const topics = Toaster.useProvider(m, Toaster.TopicsProvider);
    Toaster.useSystemUpdate(m, topics, (e) => {
        context.poll(e.detail.currentTime);
    });
    return {
        axb: context,
    };
}
