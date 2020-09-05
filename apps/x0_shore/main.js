import { InputContext, mat4, IntersectionHelper, IntersectionResolver } from './lib.js';
import { SceneGraph, SceneNode } from './SceneGraph.js';
import { CanvasView2D, setDOMMatrix } from './CanvasView2D.js';
import { EntityManager } from './Entity.js';

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

const ENTITY_COMPONENT_FACTORY_MAP = {
    transform: props => ({ node: props }),
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

const Transform = {
    create(props, componentName, entityId, sceneGraph)
    {

    },
    destroy()
    {

    }
}

export async function main()
{
    const display = document.querySelector('display-port');
    const input = new InputContext(INPUT_MAPPING);
    document.body.appendChild(input);

    const ctx = display.canvas.getContext('2d');
    const view = new CanvasView2D(display);
    const cameraSpeed = 4;

    const scene = new SceneGraph({
        nodeConstructor: SceneTransformNode
    });
    /*
    const entityManager = new EntityManager({
        transform: { create(props, componentName, entityId) { props.scene.add(entityId, props.parent)}, destroy() {} }
    });
    */

    /*
    const player = entityManager.create({
        transform: { x: 0, y: 0 },
        renderable: 'player',
        motion: { speed: 0.6, friction: 0.25 },
        playerControlled: true,
    });
    */
    const player = {
        x: 0,
        y: 0,
        motionX: 0,
        motionY: 0,
        speed: 0.6,
        friction: 0.25,
        renderType: 'player',
    };
    const playerAABB = IntersectionHelper.createAABB(0, 0, 8, 8);
    scene.add(player);
    scene.add(playerAABB, player);

    const walls = [
        createWall(0, 0, 4, 64),
        createWall(0, 0, 64, 4),
        createWall(64, 0, 4, 16),
    ];
    walls.forEach(wall => scene.add(wall));

    const dynamics = [playerAABB];
    const masks = [];
    const statics = [...walls.map(wall => wall.mask)];

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
                player.motionX += Math.cos(dr) * player.speed;
                player.motionY += Math.sin(dr) * player.speed;
            }

            let invFriction = 1 - player.friction;
            player.motionX *= invFriction;
            player.motionY *= invFriction;

            player.x += player.motionX;
            player.y += player.motionY;

            // Camera
            view.camera.moveTo(player.x, player.y, 0, dt * cameraSpeed);

            // Physics
            // IntersectionResolver.resolveIntersections(dynamics, statics, dt);
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
    view.getViewProjectionMatrix(rootNode.localTransformation);
    mat4.copy(rootNode.worldTransformation, rootNode.localTransformation);

    let domMatrix = new DOMMatrix();
    sceneGraph.forEach((child, node) => {
        let { parent, localTransformation, worldTransformation } = node;
        let parentWorldTransformation = parent.worldTransformation;
        mat4.fromTranslation(localTransformation, [child.x, child.y, 0]);
        mat4.multiply(worldTransformation, parentWorldTransformation, localTransformation);
        
        setDOMMatrix(domMatrix, worldTransformation);
        ctx.setTransform(domMatrix);

        renderer(ctx, child, node);
    },
    { skipRoot: true });

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
        mask: IntersectionHelper.createAABB(x, y, width / 2, height / 2)
    };
}


class AABBSystem
{
    add(owner, rx, ry)
    {
        let aabb = {
            owner,
            rx,
            ry,
        };
    }

    remove(owner)
    {
        
    }
}

function createAABB()
{

}

function testAABB()
{

}