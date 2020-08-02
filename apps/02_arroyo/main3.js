import { CanvasView, Camera2D, MathHelper } from './lib.js';
import { Chunk, ChunkData, toChunkCoords } from './Chunk.js';
import { ChunkMap } from './ChunkMap.js';
import * as Blocks from './Blocks.js';
import * as Fluids from './Fluids.js';
import * as Placement from './Placement.js';
import * as ChunkMapRenderer from './ChunkMapRenderer.js';

// TODO: Move the camera towards the placed block each time.
// TODO: Regionize the block maps.
// TODO: Multiple fluids?
// TODO: Sound?
// TODO: Trees? Plants?
// TODO: Sunlight? Light map.

document.addEventListener('DOMContentLoaded', main);

const MAX_BLOCK_TICKS = 10;
const MAX_AUTO_SAVE_TICKS = 100;

async function main()
{
    const display = document.querySelector('display-port');
    const input = document.querySelector('input-context');

    const CursorX = input.getInput('cursorX');
    const CursorY = input.getInput('cursorY');
    const Place = input.getInput('place');
    const Rotate = input.getInput('rotate');
    const Debug = input.getInput('debug');
    const Reset = input.getInput('reset');

    const ctx = display.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    await ChunkMapRenderer.load();

    const view = new CanvasView();
    const camera = new Camera2D();

    const blockSize = 4;
    const world = {
        map: new ChunkMap(),
        score: 0,
        cameraX: 0,
        cameraY: 0,
        time: 0,
    };

    let worldData = localStorage.getItem('worldData');
    if (!worldData || !loadWorld(world, JSON.parse(worldData)))
    {
        initializeWorld(world, display);
    }

    let blockTicks = 0;
    let autoSaveTicks = 0;

    const cameraSpeed = 0.1;
    camera.moveTo(world.cameraX, world.cameraY);

    let placement = Placement.initialize();

    display.addEventListener('frame', e => {
        const dt = e.detail.deltaTime / 1000 * 60;
        ctx.clearRect(0, 0, display.width, display.height);
        
        // Reset world
        if (Reset.value)
        {
            localStorage.removeItem('worldData');
            world.score = 0;
            world.map.clear();
            initializeWorld(world, display);
            return;
        }
        else
        {
            world.time += dt;
        }

        // Update camera
        camera.moveTo(
            MathHelper.lerp(camera.x, world.cameraX, dt * cameraSpeed),
            MathHelper.lerp(camera.y, world.cameraY, dt * cameraSpeed)
        );

        let viewMatrix = camera.getViewMatrix();
        let projectionMatrix = camera.getProjectionMatrix();

        // Cursor worldPos
        const [cursorX, cursorY] = Camera2D.screenToWorld(CursorX.value * display.width, CursorY.value * display.height, viewMatrix, projectionMatrix);
        const nextPlaceX = Math.floor(cursorX / blockSize);
        const nextPlaceY = Math.floor(cursorY / blockSize);

        function onPlace(placeState, worldMap)
        {
            const [centerX, centerY] = Camera2D.screenToWorld(display.width / 2, display.height / 2, viewMatrix, projectionMatrix);
            const centerCoordX = Math.floor(centerX / blockSize);
            const centerCoordY = Math.floor(centerY / blockSize);
            let dx = Math.floor(Math.sign(placeState.placeX - centerCoordX));
            let dy = Math.floor(Math.sign(placeState.placeY - centerCoordY));
            world.cameraX += dx * blockSize;
            world.cameraY += dy * blockSize;
            world.score += 1;
        }

        function onReset(placeState, worldMap)
        {
            let [resetPlaceX, resetPlaceY] = Placement.getPlacementSpawnPosition(
                CursorX.value, CursorY.value, blockSize,
                display.width, display.height,
                viewMatrix, projectionMatrix
            );
            placeState.placeX = resetPlaceX;
            placeState.placeY = resetPlaceY;
        }

        Placement.update(dt, placement, Place, Rotate, world.map, nextPlaceX, nextPlaceY, onPlace, onReset);

        // Compute block physics
        if (blockTicks <= 0)
        {
            blockTicks = MAX_BLOCK_TICKS;

            // if (Debug.value)
            {
                Fluids.updateChunkMap(world.map);
            }
        }
        else
        {
            blockTicks -= dt;
        }

        // AutoSave
        if (autoSaveTicks <= 0)
        {
            autoSaveTicks = MAX_AUTO_SAVE_TICKS;
            let worldData = saveWorld(world, {});
            localStorage.setItem('worldData', JSON.stringify(worldData));
        }
        else
        {
            autoSaveTicks -= dt;
        }

        view.begin(ctx, viewMatrix, projectionMatrix);
        {
            ChunkMapRenderer.drawChunkMap(ctx, world.map, blockSize);

            if (placement.placing)
            {
                ctx.fillStyle = Blocks.getBlockColor(placement.value);
                ctx.translate(placement.placeX * blockSize, placement.placeY * blockSize);
                {
                    ChunkMapRenderer.drawPlacement(ctx, placement, blockSize);
                }
                ctx.translate(-placement.placeX * blockSize, -placement.placeY * blockSize);
            }
        }
        view.end(ctx);

        ctx.fillStyle = 'white';
        ctx.fillText(world.score, 4, 12);
    });
}

function initializeWorld(world, display)
{
    // Initialize new world
    world.score = 0;

    let centerX = 0;
    let centerY = 0;
    world.map.placeBlock(centerX, centerY, Blocks.STONE);
    world.map.placeBlock(centerX - 1, centerY, Blocks.STONE);
    world.map.placeBlock(centerX, centerY - 1, Blocks.STONE);
    world.map.placeBlock(centerX - 1, centerY - 1, Blocks.STONE);

    world.cameraX = -display.width / 2;
    world.cameraY = -display.height / 2;
}

function loadWorld(world, worldData)
{
    const chunkWidth = world.map.chunkWidth;
    const chunkHeight = world.map.chunkHeight;
    if (chunkWidth !== worldData.chunkWidth || chunkHeight !== worldData.chunkHeight) return null;

    world.score = worldData.score || 0;
    world.cameraX = worldData.cameraX || 0;
    world.cameraY = worldData.cameraY || 0;

    const length = chunkWidth * chunkHeight;
    for(let chunkId of Object.keys(worldData.chunks))
    {
        const chunkData = worldData.chunks[chunkId];
        const [chunkCoordX, chunkCoordY] = toChunkCoords(chunkId);

        let data = new ChunkData(chunkWidth, chunkHeight);
        for(let i = 0; i < length; ++i)
        {
            data.block[i] = chunkData.block[i];
            data.meta[i] = chunkData.meta[i];
            data.neighbor[i] = chunkData.neighbor[i];
        }
        let chunk = new Chunk(this, chunkId, chunkCoordX, chunkCoordY, data);
        world.map.chunks[chunkId] = chunk;
    }

    return world;
}

function saveWorld(world, worldData)
{
    const chunkWidth = world.map.chunkWidth;
    const chunkHeight = world.map.chunkHeight;

    worldData.score = world.score;
    worldData.cameraX = world.cameraX;
    worldData.cameraY = world.cameraY;
    worldData.chunkWidth = chunkWidth;
    worldData.chunkHeight = chunkHeight;
    
    let chunks = {};
    const length = chunkWidth * chunkHeight;
    for(let chunk of world.map.getLoadedChunks())
    {
        const chunkId = chunk.chunkId;
        let data = {
            block: new Array(length),
            meta: new Array(length),
            neighbor: new Array(length),
        };
        for(let i = 0; i < length; ++i)
        {
            data.block[i] = chunk.data.block[i];
            data.meta[i] = chunk.data.meta[i];
            data.neighbor[i] = chunk.data.neighbor[i];
        }
        chunks[chunkId] = data;
    }

    worldData.chunks = chunks;
    return worldData;
}
