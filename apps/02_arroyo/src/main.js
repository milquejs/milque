import '@milque/display';
import '@milque/input';
import './ErrorBoundary.js';

import { Random } from '@milque/random';
import {
    Eventable,
    Downloader,
    Uploader,
    distance2,
    lerp
} from '@milque/util';

import { Camera2D } from './view/Camera2D.js';

import { ChunkMap } from './chunk/ChunkMap.js';

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

import { GameRenderer } from './GameRenderer.js';
import { BLOCK_SIZE, MAX_BLOCK_TICKS, MAX_AUTO_SAVE_TICKS, CAMERA_SPEED } from './Config.js';
import { ASSETS } from './asset/Assets.js';

// TODO: Move the camera towards the placed block each time.
// TODO: Regionize the block maps.
// TODO: Multiple fluids?
// TODO: Sound?
// TODO: Trees? Plants?
// TODO: Sunlight? Light map.

/**
 * @typedef {import('@milque/display').DisplayPort} DisplayPort
 * @typedef {import('@milque/display').FrameEvent} FrameEvent
 * @typedef {import('@milque/input').InputPort} InputPort
 */

document.addEventListener('DOMContentLoaded', main);

async function load(assets)
{
    // Load all assets
    assets.registerAsset('audio', 'flick', 'arroyo/flick.wav');
    assets.registerAsset('audio', 'melt', 'arroyo/melt.mp3');
    assets.registerAsset('audio', 'reset', 'arroyo/flick.wav');
    assets.registerAsset('audio', 'background', 'arroyo/melt.mp3');
    await MaterialSystem.load(assets);
    await assets.loadAssets();
}

async function main()
{
    /** @type {DisplayPort} */
    const display = document.querySelector('#display');
    /** @type {InputPort} */
    const input = document.querySelector('#input');
    input.src = {
        PointerX: 'Mouse:PosX',
        PointerY: 'Mouse:PosY',
        Place: 'Mouse:Button0',
        Change: { key: 'Mouse:Button2', event: 'down' },
        Reset: 'Keyboard:KeyR',
        Save: 'Keyboard:KeyS',
        Load: 'Keyboard:KeyL',
    };

    await load(ASSETS);

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
    let placement = Placement.initialize();

    const camera = new Camera2D();
    camera.moveTo(world.cameraX, world.cameraY);

    const game = {
        display,
        input,
        world,
        camera,
        placement,
        blockTicks: 0,
        autoSaveTicks: 0,
    };
    const renderer = await GameRenderer(game);

    display.addEventListener('frame', e => {
        const frameEvent = /** @type {FrameEvent} */ (e);
        const dt = frameEvent.detail.deltaTime / 1000 * 60;

        if (updateWorldControls(game)) return;
        
        world.time += dt;

        updateCamera(game, dt, camera);
        updatePlacement(game, dt);
        simulateWorld(game, dt);
        updateAutoSave(game, dt);

        renderer();
    });
}

function updatePlacement(game, dt)
{
    let world = game.world;
    const display = game.display;
    const input = game.input;
    const camera = game.camera;
    const placement = game.placement;

    let viewMatrix = camera.getViewMatrix();
    let projectionMatrix = camera.getProjectionMatrix();

    // Cursor worldPos
    const [cursorX, cursorY] = Camera2D.screenToWorld(
        input.getInputState('PointerX') * display.width,
        input.getInputState('PointerY') * display.height,
        viewMatrix, projectionMatrix);
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
            ASSETS.getAsset('audio', 'background').play();
        }
    }

    function onReset(placeState)
    {
        let [resetPlaceX, resetPlaceY] = Placement.getPlacementSpawnPosition(
            input.getInputState('PointerX'),
            input.getInputState('PointerY'),
            BLOCK_SIZE,
            display.width, display.height,
            viewMatrix, projectionMatrix
        );
        placeState.placeX = resetPlaceX;
        placeState.placeY = resetPlaceY;
        ASSETS.getAsset('audio', 'reset').play({ pitch: Random.range(-5, 5) });
    }

    Placement.update(
        dt, placement,
        input.getInput('Place'),
        input.getInput('Rotate'),
        world,
        nextPlaceX, nextPlaceY,
        onPlace, onReset);
}

function updateWorldControls(game)
{
    const world = game.world;
    const display = game.display;
    const input = game.input;

    // Reset world
    if (input.getInputState('Reset'))
    {
        localStorage.removeItem('worldData');
        world.map.clear();
        initializeWorld(world, display);
        return true;
    }
    // Save world
    else if (input.getInputState('Save'))
    {
        let worldData = WorldLoader.saveWorld(world, {});
        Downloader.downloadText('worldData.json', JSON.stringify(worldData));
        return true;
    }
    // Load world
    else if (input.getInputState('Load'))
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
        return true;
    }

    return false;
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

function simulateWorld(game, dt)
{
    let blockTicks = game.blockTicks || 0;
    const world = game.world;

    WorldEvents.emitUpdateEvent(world);

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

    // Update blockTicks
    game.blockTicks = blockTicks;
}

function updateAutoSave(game, dt)
{
    let autoSaveTicks = game.autoSaveTicks || 0;
    let world = game.world;

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

    // Update autoSaveTicks
    game.autoSaveTicks = autoSaveTicks;
}

function updateCamera(game, dt, camera)
{
    const display = game.display;
    const input = game.input;
    const world = game.world;

    const CursorX = input.getInput('PointerX');
    const CursorY = input.getInput('PointerY');

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
        lerp(camera.x, world.cameraX + cameraOffsetX, dt * CAMERA_SPEED),
        lerp(camera.y, world.cameraY + cameraOffsetY, dt * CAMERA_SPEED));
}
