import { CanvasView, Camera2D, Random, MathHelper } from './lib.js';
import { ChunkMap } from './ChunkMap.js';
import * as Blocks from './Blocks.js';
import * as Fluids from './Fluids.js';
import * as Placement from './Placement.js';
import * as BlockMapRenderer from './BlockMapRenderer.js';
import * as ChunkMapRenderer from './ChunkMapRenderer.js';

// TODO: Move the camera towards the placed block each time.
// TODO: Regionize the block maps.
// TODO: Multiple fluids?
// TODO: Sound?
// TODO: Trees? Plants?
// TODO: Sunlight? Light map.

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
    const Debug = input.getInput('debug');

    const ctx = display.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    await BlockMapRenderer.load();
    await ChunkMapRenderer.load();

    const view = new CanvasView();
    const camera = new Camera2D();

    const blockSize = 4;
    const blockMap = new ChunkMap();
    let blockTicks = 0;
    {
        let centerX = 0;
        let centerY = 0;
        blockMap.placeBlock(centerX, centerY, Blocks.GOLD);
        blockMap.placeBlock(centerX - 1, centerY, Blocks.GOLD);
        blockMap.placeBlock(centerX, centerY - 1, Blocks.GOLD);
        blockMap.placeBlock(centerX - 1, centerY - 1, Blocks.GOLD);
    }

    const cameraSpeed = 0.1;
    let nextCameraX = -display.width / 2;
    let nextCameraY = -display.height / 2;
    camera.moveTo(nextCameraX, nextCameraY);

    let placement = Placement.initialize();

    display.addEventListener('frame', e => {
        const dt = e.detail.deltaTime / 1000 * 60;
        ctx.clearRect(0, 0, display.width, display.height);

        // Update camera
        camera.moveTo(
            MathHelper.lerp(camera.x, nextCameraX, dt * cameraSpeed),
            MathHelper.lerp(camera.y, nextCameraY, dt * cameraSpeed)
        );

        let viewMatrix = camera.getViewMatrix();
        let projectionMatrix = camera.getProjectionMatrix();

        // Cursor worldPos
        const [cursorX, cursorY] = Camera2D.screenToWorld(CursorX.value * display.width, CursorY.value * display.height, viewMatrix, projectionMatrix);
        const nextPlaceX = Math.floor(cursorX / blockSize);
        const nextPlaceY = Math.floor(cursorY / blockSize);

        function onPlace(placeState, blockMap)
        {
            const [centerX, centerY] = Camera2D.screenToWorld(display.width / 2, display.height / 2, viewMatrix, projectionMatrix);
            const centerCoordX = Math.floor(centerX / blockSize);
            const centerCoordY = Math.floor(centerY / blockSize);
            let dx = Math.floor(Math.sign(placeState.placeX - centerCoordX));
            let dy = Math.floor(Math.sign(placeState.placeY - centerCoordY));
            nextCameraX += dx * blockSize;
            nextCameraY += dy * blockSize;
        }

        function onReset(placeState, blockMap)
        {
            let [resetPlaceX, resetPlaceY] = getPlacementSpawnPosition(
                CursorX.value, CursorY.value, blockSize,
                display.width, display.height,
                viewMatrix, projectionMatrix
            );
            placeState.placeX = resetPlaceX;
            placeState.placeY = resetPlaceY;
        }

        Placement.update(dt, placement, Place, Rotate, blockMap, nextPlaceX, nextPlaceY, onPlace, onReset);

        // Compute block physics
        if (blockTicks <= 0)
        {
            blockTicks = MAX_BLOCK_TICKS;

            // if (Debug.value)
            {
                Fluids.updateChunkMap(blockMap);
            }
        }
        else
        {
            blockTicks -= dt;
        }

        view.begin(ctx, viewMatrix, projectionMatrix);
        {
            ChunkMapRenderer.drawChunkMap(ctx, blockMap, blockSize);

            if (placement.placing)
            {
                ctx.fillStyle = Blocks.getBlockColor(placement.value);
                ctx.translate(placement.placeX * blockSize, placement.placeY * blockSize);
                {
                    BlockMapRenderer.drawPlacement(ctx, placement, blockSize);
                }
                ctx.translate(-placement.placeX * blockSize, -placement.placeY * blockSize);
            }
        }
        view.end(ctx);
    });
}

function getPlacementSpawnPosition(
    cursorX, cursorY, blockSize,
    displayWidth, displayHeight,
    viewMatrix, projectionMatrix)
{
    let resultX = 0;
    let resultY = 0;
    
    const quadIndex = (cursorX <= 0.5 ? 0 : 2) + (cursorY <= 0.5 ? 0 : 1);
    switch(quadIndex)
    {
        case 0: // TopLeft
        {
            let corner = Camera2D.screenToWorld(
                0, 0,
                viewMatrix, projectionMatrix
            );
            resultX = corner[0];
            resultY = corner[1];
        }
        break;
        case 1: // BottomLeft
        {
            let corner = Camera2D.screenToWorld(
                0, displayHeight,
                viewMatrix, projectionMatrix
            );
            resultX = corner[0];
            resultY = corner[1];
        }
        break;
        case 2: // TopRight
        {
            let corner = Camera2D.screenToWorld(
                displayWidth, 0,
                viewMatrix, projectionMatrix
            );
            resultX = corner[0];
            resultY = corner[1];
        }
        break;
        case 3: // BottomRight
        {
            let corner = Camera2D.screenToWorld(
                displayWidth, displayHeight,
                viewMatrix, projectionMatrix
            );
            resultX = corner[0];
            resultY = corner[1];
        }
        break;
    }

    return [
        Math.floor(resultX / blockSize),
        Math.floor(resultY / blockSize)
    ];
}
