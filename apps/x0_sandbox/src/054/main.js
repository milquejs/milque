import { FlexCanvas } from '@milque/display';

export async function main() {
    FlexCanvas.define();
    let canvas = FlexCanvas.create({ scaling: 'scale', sizing: 'viewport' });
    const ctx = canvas.getContext('2d');
    function draw() {
        requestAnimationFrame(draw);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillRect(32, 32, 32, 32);
        ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    requestAnimationFrame(draw);
}
