import { AssetLoader, BoxRenderer, SpriteRenderer, CanvasView, Camera2D } from './lib.js';

document.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('display-port');
    const input = document.querySelector('input-context');
    const ctx = display.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    
    const sprite = await AssetLoader.loadAsset('image:sprite/smile.png', undefined, '../../res');
    const view = new CanvasView();
    const camera = new Camera2D();

    const CursorX = input.getInput('cursorX');
    const CursorY = input.getInput('cursorY');
    const Grabbing = input.getInput('grabbing');

    const player = {
        x: 0, y: 0,
        [SpriteRenderer.Info]: {
            spriteImage: sprite,
        },
    };
    const ball = {
        x: 0, y: 0,
    };
    const entities = [
        player,
        ball
    ];
    display.addEventListener('frame', e => {
        const dt = e.detail.deltaTime / 1000;

        camera.moveTo(player.x - display.width / 2, player.y - display.height / 2, 0, dt);

        if (Grabbing.value)
        {
            const cursorWorldPos = Camera2D.screenToWorld(CursorX.value * display.width, CursorY.value * display.height, camera.getViewMatrix(), camera.getProjectionMatrix());
            player.x = cursorWorldPos[0];
            player.y = cursorWorldPos[1];
        }

        ctx.clearRect(0, 0, display.width, display.height);
        view.begin(ctx, camera.getViewMatrix(), camera.getProjectionMatrix());
        {
            BoxRenderer.draw(ctx, entities, { width: 16, height: 16 });
            SpriteRenderer.draw(ctx, entities);
        }
        view.end(ctx);
    });
}

