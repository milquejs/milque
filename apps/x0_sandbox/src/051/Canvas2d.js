import { HEX } from '@milque/util';

/**
 * @param {CanvasRenderingContext2D} c2d
 */
export function clearScreen(c2d, color) {
    c2d.fillStyle = HEX.toCSSColor(color);
    c2d.fillRect(0, 0, c2d.canvas.width, c2d.canvas.height);
}

/**
 * @param {CanvasRenderingContext2D} c2d
 */
export function fillRect(c2d, x, y, w, h, color) {
    c2d.fillStyle = HEX.toCSSColor(color);
    c2d.fillRect(x, y, w, h);
}

/**
 * @param {CanvasRenderingContext2D} c2d
 */
export function fillCircle(c2d, x, y, radius, color) {
    c2d.fillStyle = HEX.toCSSColor(color);
    c2d.beginPath();
    c2d.arc(x, y, radius, 0, Math.PI * 2);
    c2d.fill();
}
