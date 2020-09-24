import { AxisAlignedBoundingBoxGraph, CanvasView2D } from 'milque';

import { World } from './World.js';

import { InputSource } from './input/source/InputSource.js';
import { InputContext } from './input/InputContext.js';
import INPUT_MAP from './assets/input.json';

import { EntityManager } from './entity/EntityManager.js';
import { GameObject } from './entity/GameObject.js';

import { Transform } from './systems/Transform.js';

import { CollisionSystem } from './systems/CollisionSystem.js';
import { CollisionMask } from './systems/CollisionMask.js';
import { Collidable } from './systems/Collidable.js';
import { MotionSystem } from './systems/MotionSystem.js';
import { Motion } from './systems/Motion.js';

window.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('display-port');
    const ctx = display.canvas.getContext('2d');
    const inputSource = InputSource.from(display);
    const input = new InputContext()
        .setInputMap(INPUT_MAP)
        .attach(inputSource);
    const view = new CanvasView2D(display);

    const entityManager = new EntityManager({ strictMode: true })
        .register('Player')
        .register('Wall')
        .register(Collidable)
        .register(GameObject)
        .register(Transform)
        .register(Motion)
        .register(CollisionMask);

    const systems = {
        collision: new CollisionSystem(entityManager),
        motion: new MotionSystem(entityManager),
    };

    const player = new GameObject(
        entityManager, ['Player', CollisionMask, Transform, Motion, Collidable]);

    const wall = new GameObject(
        entityManager, ['Wall', CollisionMask, Transform]);
    
    const world = World.provide({
        display,
        input,
        view,
        entityManager,
        player,
        systems,
    });

    display.addEventListener('frame', ({ detail: { deltaTime } }) => {
        const dt = deltaTime / 1000;
        inputSource.poll();

        updateWorld(dt, world);
        renderWorld(ctx, world);
    });
}

function updateWorld(dt, world)
{
    const { input, player, view } = world;
    
    const moveSpeed = 1;
    let dx = input.getInputValue('MoveRight') - input.getInputValue('MoveLeft');
    let dy = input.getInputValue('MoveDown') - input.getInputValue('MoveUp');

    let motion = player.get(Motion);
    motion.motionX += dx * moveSpeed;
    motion.motionY += dy * moveSpeed;
    
    let transform = player.get(Transform);
    view.camera.moveTo(transform.x, transform.y, 0, dt);

    const { systems } = world;
    for(let system of Object.values(systems))
    {
        if ('update' in system)
        {
            system.update(dt);
        }
    }
}

function renderWorld(ctx, world)
{
    const { systems, view } = world;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    view.transformCanvas(ctx);
    {
        for(let system of Object.values(systems))
        {
            if ('render' in system)
            {
                system.render(ctx);
            }
        }

        const { player } = world;
        let transform = player.get(Transform);
        ctx.fillStyle = 'red';
        ctx.fillRect(transform.x - 8, transform.y - 8, 16, 16);
    }
    ctx.setTransform();
}
