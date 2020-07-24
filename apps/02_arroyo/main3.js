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

    const view = new CanvasView();
    const camera = new Camera2D();

    const blockSize = 5;
    const blockMap = new BlockMap(20, 30);
    let blockTicks = 0;
    {
        let centerX = Math.floor(blockMap.width / 2);
        let centerY = Math.floor(blockMap.height / 2);
        blockMap.at(centerX, centerY).block = Blocks.GOLD.blockId;
        blockMap.at(centerX - 1, centerY + 0).block = Blocks.DIRT.blockId;
        blockMap.at(centerX + 1, centerY + 0).block = Blocks.DIRT.blockId;
        blockMap.at(centerX + 0, centerY - 1).block = Blocks.GRASS.blockId;
        blockMap.at(centerX + 0, centerY + 1).block = Blocks.DIRT.blockId;

        blockMap.at(centerX - 1, centerY - 1).block = Blocks.GRASS.blockId;
        blockMap.at(centerX + 1, centerY - 1).block = Blocks.GRASS.blockId;
        blockMap.at(centerX + 1, centerY + 1).block = Blocks.DIRT.blockId;
        blockMap.at(centerX - 1, centerY + 1).block = Blocks.DIRT.blockId;
    }

    camera.moveTo(-display.width / 2 + (blockSize * blockMap.width / 2), 0);

    let placement = Placement.initialize();

    display.addEventListener('frame', e => {
        const dt = e.detail.deltaTime / 1000 * 60;
        ctx.clearRect(0, 0, display.width, display.height);

        let viewMatrix = camera.getViewMatrix();
        let projectionMatrix = camera.getProjectionMatrix();

        // Cursor worldPos
        let [ cx, cy ] = Camera2D.screenToWorld(CursorX.value * display.width, CursorY.value * display.height, viewMatrix, projectionMatrix);
        cx = Math.floor(cx / blockSize) * blockSize;
        cy = Math.floor(cy / blockSize) * blockSize;

        Placement.update(dt, placement, Place, Rotate, blockMap, blockSize, cx, cy);

        // Compute block physics
        if (blockTicks <= 0)
        {
            blockTicks = MAX_BLOCK_TICKS;

            // Do water physics.
            for(let y = blockMap.height - 1; y >= 0; --y)
            {
                for(let x = 0; x < blockMap.width; ++x)
                {
                    let i = x + y * blockMap.width;
                    let block = blockMap.data[i];

                    if (Blocks.isBlockFluid(block))
                    {
                        Fluids.update(blockMap, x, y, i, block);
                    }
                }
            }
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
                BlockRenderer.drawBlock(ctx, placement.shape, blockSize);
                ctx.translate(-placement.placeX * blockSize, -placement.placeY * blockSize);
            }
        }
        view.end(ctx);
    });
}
