import { mat4, quat, vec3 } from 'gl-matrix';
import {
    InputContext,
    SceneGraph,
    EntityManager,
    AxisAlignedBoundingBoxGraph,
    CanvasView2D,
    setDOMMatrix,
    AssetLoader
} from 'milque';

import { World } from './World.js';

import { Transform } from './components/Transform.js';
import { Renderable } from './components/Renderable.js';
import { Collidable } from './components/Collidable.js';
import { Motion } from './components/Motion.js';

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

import { TextureAtlas, Sprite } from './sprite.js';

document.addEventListener('DOMContentLoaded', main);

const PlayerControlled = {};

const ENTITY_COMPONENT_FACTORY_MAP = {
    Transform,
    Renderable,
    Motion,
    PlayerControlled,
    Collidable,
    GameObject,
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
        sceneGraph: scene,
        aabbGraph: aabbs,
        input,
        display,
        view,
        assets,
    } = world;
    
    const systems = [
        new MotionSystem(entityManager, input),
        new CameraSystem(entityManager, view, 4),
        new PhysicsSystem(entityManager, aabbs),
    ];

    const textureAtlas = TextureAtlas.from(assets.player, assets.playerAtlas);
    const sprite = new Sprite(textureAtlas.getSubTexture('elf_m_run_anim'), 4, 1);
    const player = new Player();
    let renderable = player.get('Renderable');
    renderable.sprite = sprite;
    renderable.renderType = 'sprite';
    const walls = [
        new Wall(0, 0, 8, 64),
        new Wall(0, 0, 64, 8),
        new Wall(64, 0, 72, 16),
    ];

    display.addEventListener('frame', e => {
        // Update
        {
            const dt = e.detail.deltaTime / 1000;
            input.poll();

            for(let system of systems)
            {
                system.update(dt);
            }
        }

        // Render
        {
            const ctx = e.detail.context;
            ctx.clearRect(0, 0, display.width, display.height);

            renderView(ctx, view,
                function renderScene(ctx)
                {
                    // Render scene objects...
                    renderSceneGraph(ctx, scene, entityManager,
                        function renderNode(ctx, owner)
                        {
                            if (entityManager.has('Renderable', owner))
                            {
                                const renderable = entityManager.get('Renderable', owner);
                                switch(renderable.renderType)
                                {
                                    case 'sprite':
                                        if (entityManager.has('Motion', owner))
                                        {
                                            let motion = entityManager.get('Motion', owner);
                                            if (motion.moving)
                                            {
                                                renderable.sprite.next(0.1);
                                            }
                                            else
                                            {
                                                renderable.sprite.spriteIndex = 0;
                                            }
                                            if (motion.facing < 0)
                                            {
                                                ctx.scale(-1, 1);
                                                renderable.sprite.draw(ctx);
                                                ctx.scale(-1, 1);
                                            }
                                            else
                                            {
                                                renderable.sprite.draw(ctx);
                                            }
                                        }
                                        else
                                        {
                                            renderable.sprite.next(0.3);
                                            renderable.sprite.draw(ctx);
                                        }
                                        break;
                                    case 'player':
                                        ctx.fillStyle = 'blue';
                                        ctx.fillRect(-8, -8, 16, 16);
                                        break;
                                    case 'wall':
                                        ctx.fillStyle = 'white';
                                        let halfWidth = renderable.width / 2;
                                        let halfHeight = renderable.height / 2;
                                        ctx.fillRect(-halfWidth, -halfHeight, renderable.width, renderable.height);
                                        break;
                                }
                            }
                            else
                            {
                                ctx.fillStyle = 'red';
                                ctx.fillRect(-1, -1, 2, 2);
                            }
                        });
                    
                    // Render collision masks...
                    renderAxisAlignedBoundingBoxGraph(ctx, aabbs, entityManager);
                });
        }
    });
}

function renderView(ctx, view, renderCallback)
{
    let viewProjectionMatrix = view.getViewProjectionMatrix(mat4.create());
    let domMatrix = new DOMMatrix();
    setDOMMatrix(domMatrix, viewProjectionMatrix);
    let prevMatrix = ctx.getTransform();
    ctx.setTransform(domMatrix);
    {
        renderCallback(ctx);
    }
    ctx.setTransform(prevMatrix);
}

function renderSceneGraph(ctx, sceneGraph, entityManager, renderCallback)
{
    let q = quat.create();
    let v = vec3.create();
    let s = vec3.create();
    let domMatrix = new DOMMatrix();
    sceneGraph.walk(null, (child, childNode) => {
        let transform = entityManager.get('Transform', child);
        let { localTransformation, worldTransformation } = transform;
        quat.fromEuler(q, transform.pitch, transform.yaw, transform.roll);
        vec3.set(v, transform.x, transform.y, transform.z);
        vec3.set(s, transform.scaleX, transform.scaleY, transform.scaleZ);
        mat4.fromRotationTranslationScale(localTransformation, q, v, s);

        if (childNode.parentNode)
        {
            let parent = childNode.parentNode.owner;
            let { worldTransformation: parentWorldTransformation } = entityManager.get('Transform', parent);
            mat4.multiply(worldTransformation, parentWorldTransformation, localTransformation);
        }
        else
        {
            mat4.copy(worldTransformation, localTransformation);
        }

        setDOMMatrix(domMatrix, worldTransformation);

        let prevMatrix = ctx.getTransform();
        ctx.transform(domMatrix.a, domMatrix.b, domMatrix.c, domMatrix.d, domMatrix.e, domMatrix.f);
        {
            renderCallback(ctx, child, childNode);
        }
        ctx.setTransform(prevMatrix);
    });
}

function renderAxisAlignedBoundingBoxGraph(ctx, aabbGraph, entityManager)
{
    for (let entityId of entityManager.getComponentEntityIds('Collidable'))
    {
        let collidable = entityManager.get('Collidable', entityId);
        if (collidable.collided)
        {
            ctx.strokeStyle = 'red';
        }
        else
        {
            ctx.strokeStyle = 'limegreen';
        }
        for(let maskName in collidable.masks)
        {
            let mask = aabbGraph.get(entityId, maskName);
            if (mask)
            {
                let box = mask.box;
                ctx.strokeRect(box.x - box.rx, box.y - box.ry, box.rx * 2, box.ry * 2);
            }
        }
    }
}
