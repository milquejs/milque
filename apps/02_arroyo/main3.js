import { CanvasView, Camera2D } from './lib.js';
import { BlockMap } from './BlockMap.js';
import * as Blocks from './Blocks.js';
import * as Fluids from './Fluids.js';
import * as Placement from './Placement.js';
import * as BlockRenderer from './BlockRenderer.js';

document.addEventListener('DOMContentLoaded', main);

const MAX_BLOCK_TICKS = 10;

async function main()
{
    const display = document.querySelector('display-port');
    const input = document.querySelector('input-context');

    const CursorX = input.getInput('cursorX');
    const CursorY = input.getInput('cursorY');
    const Place = input.getInput('place');
    const Rotate = input.getInput('rotate');

    const ctx = display.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    await BlockRenderer.load();

    const view = new CanvasView();
    const camera = new Camera2D();

    const blockSize = 4;
    const blockMap = new BlockMap(30, 36);
    let blockTicks = 0;
    {
        let centerX = Math.floor(blockMap.width / 2);
        let centerY = Math.floor(blockMap.height / 2);
        blockMap.placeBlock(centerX, centerY, Blocks.GOLD);
        blockMap.placeBlock(centerX - 1, centerY + 0, Blocks.DIRT);
        blockMap.placeBlock(centerX + 1, centerY + 0, Blocks.DIRT);
        blockMap.placeBlock(centerX + 0, centerY - 1, Blocks.GRASS);
        blockMap.placeBlock(centerX + 0, centerY + 1, Blocks.DIRT);

        blockMap.placeBlock(centerX - 1, centerY - 1, Blocks.GRASS);
        blockMap.placeBlock(centerX + 1, centerY - 1, Blocks.GRASS);
        blockMap.placeBlock(centerX + 1, centerY + 1, Blocks.DIRT);
        blockMap.placeBlock(centerX - 1, centerY + 1, Blocks.DIRT);
    }

    camera.moveTo(-display.width / 2 + (blockSize * blockMap.width / 2), 0);

    let placement = Placement.initialize();

    display.addEventListener('frame', e => {
        const dt = e.detail.deltaTime / 1000 * 60;
        ctx.clearRect(0, 0, display.width, display.height);

        let viewMatrix = camera.getViewMatrix();
        let projectionMatrix = camera.getProjectionMatrix();

        // Cursor worldPos
        const cursorPos = Camera2D.screenToWorld(CursorX.value * display.width, CursorY.value * display.height, viewMatrix, projectionMatrix);
        const nextPlaceX = Math.floor(cursorPos[0] / blockSize);
        const nextPlaceY = Math.floor(cursorPos[1] / blockSize);

        Placement.update(dt, placement, Place, Rotate, blockMap, nextPlaceX, nextPlaceY);

        // Compute block physics
        if (blockTicks <= 0)
        {
            blockTicks = MAX_BLOCK_TICKS;

            Fluids.update(blockMap);
        }
        else
        {
            blockTicks -= dt;
        }

        view.begin(ctx, viewMatrix, projectionMatrix);
        {
            BlockRenderer.drawBlockMap(ctx, blockMap, blockSize);

            if (placement.placing)
            {
                ctx.fillStyle = Blocks.getBlockColor(placement.value);
                ctx.translate(placement.placeX * blockSize, placement.placeY * blockSize);
                BlockRenderer.drawPlacement(ctx, placement, blockSize);
                ctx.translate(-placement.placeX * blockSize, -placement.placeY * blockSize);
            }
        }
        view.end(ctx);
    });
}
