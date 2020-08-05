import { CanvasView, Camera2D, MathHelper, Audio, Random, Downloader, Uploader, Eventable } from './lib.js';

import { Chunk, ChunkData, toChunkCoords } from './chunk/Chunk.js';
import { ChunkMap } from './chunk/ChunkMap.js';
import * as ChunkMapRenderer from './chunk/ChunkMapRenderer.js';

import * as WorldEvents from './block/WorldEvents.js';
import * as FluidSystem from './block/fluid/FluidSystem.js';
import * as PlacementSystem from './block/placement/PlacementSystem.js';
import * as Blocks from './block/Blocks.js';

import * as Placement from './Placement.js';

// TODO: Move the camera towards the placed block each time.
// TODO: Regionize the block maps.
// TODO: Multiple fluids?
// TODO: Sound?
// TODO: Trees? Plants?
// TODO: Sunlight? Light map.

document.addEventListener('DOMContentLoaded', main);

const MAX_BLOCK_TICKS = 10;
const MAX_AUTO_SAVE_TICKS = 100;
const MAX_FADE_IN_TICKS = 300;

const SOUNDS = {};

async function load()
{
    SOUNDS.flick = await Audio.loadAudio('../../res/arroyo/flick.wav');
    SOUNDS.melt = await Audio.loadAudio('../../res/arroyo/melt.mp3');

    SOUNDS.dirt = await Audio.loadAudio('../../res/arroyo/dirt.wav');
    SOUNDS.ding = await Audio.loadAudio('../../res/arroyo/ding.wav');
    SOUNDS.waterpop = await Audio.loadAudio('../../res/arroyo/waterpop.wav');
    SOUNDS.stone = await Audio.loadAudio('../../res/arroyo/stone.wav');

    SOUNDS.place = SOUNDS.dirt;
    SOUNDS.reset = SOUNDS.flick;
    SOUNDS.background = SOUNDS.melt;

    await ChunkMapRenderer.load();
}

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
    const Save = input.getInput('save');
    const Load = input.getInput('load');

    const ctx = display.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    await load();

    const view = new CanvasView();
    const camera = new Camera2D();

    const blockSize = 4;

    // Initialize world
    const world = {
        map: new ChunkMap(),
        score: 0,
        cameraX: 0,
        cameraY: 0,
        time: 0,
        firstPlace: true,
    };
    Eventable.assign(world);

    // Initialize systems
    FluidSystem.initialize(world);
    PlacementSystem.initialize(world);

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
        
        // Reset world
        if (Reset.value)
        {
            localStorage.removeItem('worldData');
            world.map.clear();
            initializeWorld(world, display);
            return;
        }
        // Save world
        else if (Save.value)
        {
            let worldData = saveWorld(world, {});
            Downloader.downloadText('worldData.json', JSON.stringify(worldData));
        }
        // Load world
        else if (Load.value)
        {
            Uploader.uploadFile(['.json'], false)
                .then(fileBlob => fileBlob.text())
                .then(textData => {
                    let worldData = JSON.parse(textData);
                    world.map.clear();
                    if (!worldData || !loadWorld(world, worldData))
                    {
                        initializeWorld(world, display);
                    }
                });
        }
        else
        {
            world.time += dt;
        }

        // Update camera
        {
            let aspectRatio = display.width / display.height;
            let cw = aspectRatio <= 1 ? aspectRatio : 1;
            let ch = aspectRatio <= 1 ? 1 : 1 / aspectRatio;
            let cx = (CursorX.value - 0.5);
            let cy = (CursorY.value - 0.5);

            const cameraOffsetAmount = 4;
            let radian = Math.atan2(cy, cx);
            let distance = MathHelper.distance2(0, 0, cx, cy);
            let clampDist = distance < 0.3 ? 0 : distance - 0.3;
            let cameraOffsetX = Math.cos(radian) * clampDist * blockSize * world.map.chunkWidth * cw * cameraOffsetAmount;
            let cameraOffsetY = Math.sin(radian) * clampDist * blockSize * world.map.chunkWidth * ch * cameraOffsetAmount;
            camera.moveTo(
                MathHelper.lerp(camera.x, world.cameraX + cameraOffsetX, dt * cameraSpeed),
                MathHelper.lerp(camera.y, world.cameraY + cameraOffsetY, dt * cameraSpeed)
            );
        }

        let viewMatrix = camera.getViewMatrix();
        let projectionMatrix = camera.getProjectionMatrix();

        // Cursor worldPos
        const [cursorX, cursorY] = Camera2D.screenToWorld(CursorX.value * display.width, CursorY.value * display.height, viewMatrix, projectionMatrix);
        const nextPlaceX = Math.floor(cursorX / blockSize);
        const nextPlaceY = Math.floor(cursorY / blockSize);

        function onPlace(placeState)
        {
            // Move towards placement
            const [centerX, centerY] = Camera2D.screenToWorld(display.width / 2, display.height / 2, viewMatrix, projectionMatrix);
            const centerCoordX = Math.floor(centerX / blockSize);
            const centerCoordY = Math.floor(centerY / blockSize);
            let dx = Math.ceil((placeState.placeX - centerCoordX) / 4);
            let dy = Math.ceil((placeState.placeY - centerCoordY) / 4);
            world.cameraX += dx * blockSize;
            world.cameraY += dy * blockSize;
            world.score += 1;

            if (placeState.value === Blocks.DIRT.blockId)
            {
                SOUNDS.dirt.play({ pitch: Random.range(-5, 5) });
            }
            else if (placeState.value === Blocks.WATER.blockId)
            {
                SOUNDS.waterpop.play({ pitch: Random.range(-5, 5) });
            }
            else if (placeState.value === Blocks.GOLD.blockId)
            {
                SOUNDS.ding.play({ gain: 4, pitch: Random.range(-5, 5) });
            }
            else if (placeState.value === Blocks.STONE.blockId)
            {
                SOUNDS.stone.play({ gain: 1.5, pitch: Random.range(-5, 5) });
            }
            else
            {
                SOUNDS.place.play({ pitch: Random.range(-5, 5) });
            }

            if (world.firstPlace)
            {
                world.firstPlace = false;
                SOUNDS.background.play();
            }
        }

        function onReset(placeState)
        {
            let [resetPlaceX, resetPlaceY] = Placement.getPlacementSpawnPosition(
                CursorX.value, CursorY.value, blockSize,
                display.width, display.height,
                viewMatrix, projectionMatrix
            );
            placeState.placeX = resetPlaceX;
            placeState.placeY = resetPlaceY;
            SOUNDS.reset.play({ pitch: Random.range(-5, 5) });
        }

        Placement.update(dt, placement, Place, Rotate, world, nextPlaceX, nextPlaceY, onPlace, onReset);

        // Compute block physics
        if (blockTicks <= 0)
        {
            blockTicks = MAX_BLOCK_TICKS;

            // if (Debug.value)
            {
                WorldEvents.emitUpdateEvent(world);
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

        ctx.clearRect(0, 0, display.width, display.height);
        view.begin(ctx, viewMatrix, projectionMatrix);
        {
            ChunkMapRenderer.drawChunkMap(ctx, world.map, blockSize);

            if (placement.placing)
            {
                ctx.translate(placement.placeX * blockSize, placement.placeY * blockSize);
                {
                    ChunkMapRenderer.drawPlacement(ctx, placement, blockSize);
                }
                ctx.translate(-placement.placeX * blockSize, -placement.placeY * blockSize);
            }
        }
        view.end(ctx);

        if (world.time < MAX_FADE_IN_TICKS)
        {
            ctx.fillStyle = `rgba(0, 0, 0, ${1 - (world.time / MAX_FADE_IN_TICKS)})`;
            ctx.fillRect(0, 0, display.width, display.height);
        }

        ctx.fillStyle = 'white';
        ctx.fillText(world.score, 4, 12);
    });
}

function initializeWorld(world, display)
{
    // Initialize new world
    world.score = 0;
    world.time = 0;
    world.firstPlace = true;
    
    let blockPos = world.map.at(0, 0);
    let out = blockPos.clone();
    PlacementSystem.placeBlock(world, blockPos, Blocks.GOLD.blockId);
    PlacementSystem.placeBlock(world, blockPos.offset(out, -1, 0), Blocks.GOLD.blockId);
    PlacementSystem.placeBlock(world, blockPos.offset(out, 0, -1), Blocks.GOLD.blockId);
    PlacementSystem.placeBlock(world, blockPos.offset(out, -1, -1), Blocks.GOLD.blockId);

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
