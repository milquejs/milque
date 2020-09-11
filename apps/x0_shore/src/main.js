import {
    InputContext,
    SceneGraph,
    EntityManager,
    AxisAlignedBoundingBoxGraph,
    CanvasView2D,
    AssetLoader,
} from 'milque';

import { World } from './World.js';

import { Transform } from './components/Transform.js';
import { Renderable } from './components/Renderable.js';
import { Collidable } from './components/Collidable.js';
import { Motion } from './components/Motion.js';
import { Sprite } from './components/Sprite.js';

// TODO: Should print the key code of any key somewhere, so we know what to use.
// NOTE: https://keycode.info/
import INPUT_MAP from '@app/assets/inputmap.json';
import ASSET_MAP from '@app/assets/assetmap.json';

import { GameObject } from './entities/GameObject.js';
import { Player } from './entities/Player.js';
import { Wall } from './entities/Wall.js';

import { MotionSystem } from './systems/MotionSystem.js';
import { CameraSystem } from './systems/CameraSystem.js';
import { PhysicsSystem } from './systems/PhysicsSystem.js';

import * as TextureAtlasLoader from './texture/TextureAtlasLoader.js';
import { RenderSystem } from './systems/RenderSystem.js';

import { SpriteRenderer } from './systems/render/SpriteRenderer.js';
import { WallRenderer } from './systems/render/WallRenderer.js';
import { Door } from './entities/Door.js';

document.addEventListener('DOMContentLoaded', main);

const PlayerControlled = {};

const ENTITY_COMPONENT_FACTORY_MAP = {
    Transform,
    Renderable,
    Motion,
    PlayerControlled,
    Collidable,
    GameObject,
    Sprite,
};

async function setup()
{
    const display = document.querySelector('display-port');
    const input = new InputContext(INPUT_MAP);
    document.body.appendChild(input);
    const view = new CanvasView2D(display);

    const sceneGraph = new SceneGraph();
    const aabbGraph = new AxisAlignedBoundingBoxGraph();
    const entityManager = new EntityManager({
        componentFactoryMap: ENTITY_COMPONENT_FACTORY_MAP,
    });
    AssetLoader.defineAssetLoader('atlas', TextureAtlasLoader.loadTextureAtlas);
    const assets = await AssetLoader.loadAssetMap(ASSET_MAP);

    return {
        display,
        input,
        view,
        sceneGraph,
        aabbGraph,
        entityManager,
        assets,
    };
}

async function main()
{
    const world = World.provide(await setup());

    const {
        entityManager,
        sceneGraph,
        aabbGraph: aabbs,
        input,
        display,
        view,
        assets,
    } = world;
    
    let renderSystem;
    const systems = [
        new MotionSystem(entityManager, input),
        new CameraSystem(entityManager, view, 4),
        new PhysicsSystem(entityManager, aabbs),
        renderSystem = new RenderSystem(entityManager, sceneGraph, view),
    ];

    renderSystem.registerRenderer('sprite', SpriteRenderer);
    renderSystem.registerRenderer('wall', WallRenderer);

    const walls = [
        new Wall(0, 0, 8, 64),
        new Wall(0, 0, 64, 8),
        new Wall(64, 0, 72, 16),
    ];
    const door = [
        new Door(32, 64),
    ];
    const player = new Player();

    display.addEventListener('frame', e => {
        // Update
        {
            const dt = e.detail.deltaTime / 1000;
            input.poll();

            for(let system of systems)
            {
                if ('update' in system)
                {
                    system.update(dt);
                }
            }
        }

        // Render
        {
            const ctx = e.detail.context;
            ctx.clearRect(0, 0, display.width, display.height);

            for(let system of systems)
            {
                if ('render' in system)
                {
                    system.render(ctx);
                }
            }
        }
    });
}
