import { InputContext, lerp, mat4 } from './lib.js';
import { SceneGraph, SceneNode } from './SceneGraph.js';

document.addEventListener('DOMContentLoaded', main);

// TODO: Should print the key code of any key somewhere, so we know what to use.
// NOTE: https://keycode.info/
const INPUT_MAPPING = {
    moveUp: [{key: 'keyboard:ArrowUp', scale: 1}, {key: 'keyboard:KeyW', scale: 1}],
    moveDown: [{key: 'keyboard:ArrowDown', scale: 1}, {key: 'keyboard:KeyS', scale: 1}],
    moveLeft: [{key: 'keyboard:ArrowLeft', scale: 1}, {key: 'keyboard:KeyA', scale: 1}],
    moveRight: [{key: 'keyboard:ArrowRight', scale: 1}, {key: 'keyboard:KeyD', scale: 1}],
    mainAction: [{key: 'keyboard:KeyE', scale: 1}, {key: 'keyboard:Space', scale: 1}],
    inventory: [{key: 'keyboard:KeyF', event: 'up' }, {key: 'keyboard:KeyI', event: 'up'}],
    sprint: [{key: 'keyboard:ShiftLeft', scale: 1}, {key: 'keyboard:ShiftRight', scale: 1}],
    sneak: [{key: 'keyboard:ControlLeft', scale: 1}, {key: 'keyboard:ControlRight', scale: 1}],
};

class SceneTransformNode extends SceneNode
{
    constructor(sceneGraph, owner, parent, children)
    {
        super(sceneGraph, owner, parent, children);

        this.worldTransformation = mat4.create();
        this.localTransformation = mat4.create();
    }
}

export async function main()
{
    const display = document.querySelector('display-port');
    const input = new InputContext(INPUT_MAPPING);
    document.body.appendChild(input);

    const ctx = display.canvas.getContext('2d');
    display.canvas.style.imageRendering = 'crisp-edges';

    const scene = new SceneGraph({ nodeConstructor: SceneTransformNode });

    const camera = {
        x: 0,
        y: 0,
        speed: 4,
        lookAt(x, y, dt)
        {
            this.x = lerp(this.x, x, dt * this.speed);
            this.y = lerp(this.y, y, dt * this.speed);
        }
    };

    const view = {
        get x() { return display.width / 2 - camera.x; },
        get y() { return display.height / 2 - camera.y; },
    };

    const player = {
        x: 0,
        y: 0,
        speed: 2,
        renderType: 'player',
    };
    const playerAABB = {
        x: 0,
        y: 0,
        rx: 8,
        ry: 8,
    };
    scene.add(player);
    scene.add(playerAABB, player);

    const walls = [
        createWall(0, 0, 4, 64),
        createWall(0, 0, 64, 4),
        createWall(64, 0, 4, 16),
    ];
    walls.forEach(wall => scene.add(wall));

    display.addEventListener('frame', e => {
        // Update
        {
            const dt = e.detail.deltaTime / 1000;
            input.poll();

            // Player
            let dx = input.getInputValue('moveRight') - input.getInputValue('moveLeft');
            let dy = input.getInputValue('moveDown') - input.getInputValue('moveUp');
            if (dx || dy)
            {
                let dr = Math.atan2(dy, dx);
                player.x += Math.cos(dr) * player.speed;
                player.y += Math.sin(dr) * player.speed;
            }

            // Camera
            camera.lookAt(player.x, player.y, dt);
        }

        // Render
        {
            ctx.clearRect(0, 0, display.width, display.height);

            renderSceneGraph(ctx, scene, view, (ctx, child, node) => {
                if ('renderType' in child)
                {
                    switch(child.renderType)
                    {
                        case 'player':
                            ctx.fillStyle = 'blue';
                            ctx.fillRect(-8, -8, 16, 16);
                            break;
                        case 'wall':
                            ctx.fillStyle = 'white';
                            ctx.fillRect(0, 0, child.width, child.height);
                            break;
                    }
                }
                else
                {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(-1, -1, 2, 2);
                }
            });
        }
    });
}

function renderSceneGraph(ctx, sceneGraph, view, renderer)
{
    let rootNode = sceneGraph.get(null);
    mat4.fromTranslation(rootNode.localTransformation, [view.x, view.y, 0]);
    mat4.copy(rootNode.worldTransformation, rootNode.localTransformation);

    let domMatrix = new DOMMatrix();
    sceneGraph.forEach((child, node) => {
        if (!child) return;

        let { localTransformation, worldTransformation } = node;
        let parentWorldTransformation = node.parent.worldTransformation;
        mat4.fromTranslation(localTransformation, [child.x, child.y, 0]);
        mat4.multiply(worldTransformation, parentWorldTransformation, localTransformation);
        
        setDOMMatrix(domMatrix, worldTransformation);
        ctx.setTransform(domMatrix);

        renderer(ctx, child, node);
    });

    ctx.setTransform();
}

function createWall(x = 0, y = 0, width = 16, height = 16)
{
    return {
        x,
        y,
        width,
        height,
        renderType: 'wall',
    };
}

function createAABB(owner, opts = {})
{
    return {
        owner,
        x: 0,
        y: 0,
        rx: 0,
        ry: 0,
    };
}

function setDOMMatrix(domMatrix, glMatrix)
{
    domMatrix.a = glMatrix[0];
    domMatrix.b = glMatrix[1];
    domMatrix.c = glMatrix[4];
    domMatrix.d = glMatrix[5];
    domMatrix.e = glMatrix[12];
    domMatrix.f = glMatrix[13];
    return domMatrix;
}
