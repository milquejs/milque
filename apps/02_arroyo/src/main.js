import '@milque/display';
import '@milque/input';

import { Random } from '@milque/random';
import {
    Eventable,
    Downloader,
    Uploader,
    distance2,
    lerp
} from '@milque/util';

import * as Audio from './Audio.js';

import { CanvasView } from './view/CanvasView.js';
import { Camera2D } from './view/Camera2D.js';

import { ChunkMap } from './chunk/ChunkMap.js';
import * as ChunkMapRenderer from './chunk/ChunkMapRenderer.js';

import * as Blocks from './block/Blocks.js';
import * as WorldEvents from './block/WorldEvents.js';
import * as FluidSystem from './block/fluid/FluidSystem.js';
import * as PlacementSystem from './block/placement/PlacementSystem.js';
import * as GrassSystem from './block/grass/GrassSystem.js';
import * as HydrateSystem from './block/hydrate/HydrateSystem.js';
import * as MaterialSystem from './block/material/MaterialSystem.js';
import * as FallingSystem from './block/falling/FallingSystem.js';

import * as Placement from './tetromino/Placement.js';

import * as WorldLoader from './WorldLoader.js';

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
const BLOCK_SIZE = 4;

const SOUNDS = {};

async function load(assets)
{
    const assetsDir = '../../../res/';
    SOUNDS.flick = await Audio.loadAudio(assetsDir + 'arroyo/flick.wav');
    SOUNDS.melt = await Audio.loadAudio(assetsDir + 'arroyo/melt.mp3');

    SOUNDS.reset = SOUNDS.flick;
    SOUNDS.background = SOUNDS.melt;

    await ChunkMapRenderer.load();
}

async function main()
{
    const display = document.querySelector('display-port');
    const input = document.querySelector('input-port');

    const CursorX = input.context.getInput('cursorX');
    const CursorY = input.context.getInput('cursorY');
    const Place = input.context.getInput('place');
    const Rotate = input.context.getInput('rotate');
    const Debug = input.context.getInput('debug');
    const Reset = input.context.getInput('reset');
    const Save = input.context.getInput('save');
    const Load = input.context.getInput('load');

    const ctx = display.canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const assets = {};
    await load(assets);
    await MaterialSystem.load(assets);

    const view = new CanvasView();
    const camera = new Camera2D();

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
    GrassSystem.initialize(world);
    HydrateSystem.initialize(world);
    MaterialSystem.initialize(world);
    FallingSystem.initialize(world);

    let worldData = localStorage.getItem('worldData');
    if (!worldData || !WorldLoader.loadWorld(world, JSON.parse(worldData)))
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
            let worldData = WorldLoader.saveWorld(world, {});
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
                    if (!worldData || !WorldLoader.loadWorld(world, worldData))
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
            let distance = distance2(0, 0, cx, cy);
            let clampDist = distance < 0.3 ? 0 : distance - 0.3;
            let cameraOffsetX = Math.cos(radian) * clampDist * BLOCK_SIZE * world.map.chunkWidth * cw * cameraOffsetAmount;
            let cameraOffsetY = Math.sin(radian) * clampDist * BLOCK_SIZE * world.map.chunkWidth * ch * cameraOffsetAmount;
            camera.moveTo(
                lerp(camera.x, world.cameraX + cameraOffsetX, dt * cameraSpeed),
                lerp(camera.y, world.cameraY + cameraOffsetY, dt * cameraSpeed)
            );
        }

        let viewMatrix = camera.getViewMatrix();
        let projectionMatrix = camera.getProjectionMatrix();

        // Cursor worldPos
        const [cursorX, cursorY] = Camera2D.screenToWorld(CursorX.value * display.width, CursorY.value * display.height, viewMatrix, projectionMatrix);
        const nextPlaceX = Math.floor(cursorX / BLOCK_SIZE);
        const nextPlaceY = Math.floor(cursorY / BLOCK_SIZE);

        function onPlace(placeState)
        {
            // Move towards placement
            const [centerX, centerY] = Camera2D.screenToWorld(display.width / 2, display.height / 2, viewMatrix, projectionMatrix);
            const centerCoordX = Math.floor(centerX / BLOCK_SIZE);
            const centerCoordY = Math.floor(centerY / BLOCK_SIZE);
            let dx = Math.ceil((placeState.placeX - centerCoordX) / 4);
            let dy = Math.ceil((placeState.placeY - centerCoordY) / 4);
            world.cameraX += dx * BLOCK_SIZE;
            world.cameraY += dy * BLOCK_SIZE;
            world.score += 1;

            MaterialSystem.playPlaceSound(placeState.value);

            if (world.firstPlace)
            {
                world.firstPlace = false;
                SOUNDS.background.play();
            }
        }

        function onReset(placeState)
        {
            let [resetPlaceX, resetPlaceY] = Placement.getPlacementSpawnPosition(
                CursorX.value, CursorY.value, BLOCK_SIZE,
                display.width, display.height,
                viewMatrix, projectionMatrix
            );
            placeState.placeX = resetPlaceX;
            placeState.placeY = resetPlaceY;
            SOUNDS.reset.play({ pitch: Random.range(-5, 5) });
        }

        Placement.update(dt, placement, Place, Rotate, world, nextPlaceX, nextPlaceY, onPlace, onReset);

        WorldEvents.emitUpdateEvent(world);

        // Compute block physics
        if (blockTicks <= 0)
        {
            blockTicks = MAX_BLOCK_TICKS;

            // if (Debug.value)
            {
                WorldEvents.emitWorldUpdateEvent(world);

                const chunks = world.map.getLoadedChunks();
                const chunkWidth = world.map.chunkWidth;
                const chunkHeight = world.map.chunkHeight;
                
                let blockPos = world.map.at(0, 0);
                for(let chunk of chunks)
                {
                    const chunkX = chunk.chunkCoordX * chunkWidth;
                    const chunkY = chunk.chunkCoordY * chunkHeight;
                    WorldEvents.emitChunkUpdateEvent(world, chunk);
                    
                    for(let y = 0; y < chunkHeight; ++y)
                    {
                        for(let x = 0; x < chunkWidth; ++x)
                        {
                            blockPos.set(x + chunkX, y + chunkY);
                            WorldEvents.emitBlockUpdateEvent(world, chunk, blockPos);
                        }
                    }
                }
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
            let worldData = WorldLoader.saveWorld(world, {});
            localStorage.setItem('worldData', JSON.stringify(worldData));
        }
        else
        {
            autoSaveTicks -= dt;
        }

        ctx.clearRect(0, 0, display.width, display.height);
        view.begin(ctx, viewMatrix, projectionMatrix);
        {
            ChunkMapRenderer.drawChunkMap(ctx, world.map, BLOCK_SIZE);

            if (placement.placing)
            {
                ctx.translate(placement.placeX * BLOCK_SIZE, placement.placeY * BLOCK_SIZE);
                {
                    ChunkMapRenderer.drawPlacement(ctx, placement, BLOCK_SIZE);
                }
                ctx.translate(-placement.placeX * BLOCK_SIZE, -placement.placeY * BLOCK_SIZE);
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
