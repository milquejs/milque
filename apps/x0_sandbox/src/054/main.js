import { FlexCanvas } from '@milque/display';

export async function main() {
    let canvas = FlexCanvas.create({ sizing: 'viewport' }).canvas;
    const ctx = canvas.getContext('2d');

    function draw() {
        requestAnimationFrame(draw);
        ctx.resetTransform();
        ctx.translate(0.5, 0.5);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillRect(32, 32, 32, 32);
        ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height - 1);
    }

    requestAnimationFrame(draw);
}
