const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.style = 'width: 100%; image-rendering: pixelated;';
let prevFrameTime;
let scene;

function main()
{
    scene.load();
    run(prevFrameTime = performance.now());
}

function run(now)
{
    requestAnimationFrame(run);
    let dt = now - prevFrameTime;
    prevFrameTime = now;
    scene.update(dt);
    scene.render(ctx);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

scene = {
    load()
    {
    },
    update(dt)
    {
    },
    render(ctx)
    {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
};

function drawBox(ctx, x, y, r, w, h, color)
{
    ctx.translate(x, y);
    ctx.rotate(r);
    ctx.fillStyle = color;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

main();