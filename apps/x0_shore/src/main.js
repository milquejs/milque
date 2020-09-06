import { InputContext, IntersectionHelper, IntersectionResolver } from 'milque';
import { mat4 } from 'gl-matrix';

import { CanvasView2D, setDOMMatrix } from '@app/view/CanvasView2D.js';
import { SceneGraph, SceneNode } from '@app/scene/SceneGraph.js';
import { EntityManager } from '@app/entity/EntityManager.js';

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

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.pitch = 0;
        this.yaw = 0;
        this.roll = 0;

        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;

        this.worldTransformation = mat4.create();
        this.localTransformation = mat4.create();
    }
}

const Transform = {
    create(props, componentName, entityId, entityManager)
    {
        const { sceneGraph, parent = undefined, x = 0, y = 0, z = 0} = props;
        if (!sceneGraph) throw new Error(`Component instantiation is missing required prop 'sceneGraph'.`);
        let node = sceneGraph.add(entityId, parent);
        node.x = x;
        node.y = y;
        node.z = z;
        return node;
    },
    destroy(component, componentName, entityId, entityManager)
    {
        component.sceneGraph.remove(entityId);
    }
};

const Renderable = {
    create(props)
    {
        const { renderType, ...otherProps } = props;
        if (!renderType) throw new Error(`Component instantiation is missing required prop 'renderType'.`);
        return {
            renderType,
            ...otherProps,
        };
    }
};

const Motion = {
    create(props)
    {
        return {
            motionX: 0,
            motionY: 0,
            speed: 0.6,
            friction: 0.25,
            ...props
        };
    }
};

const PlayerControlled = {};

const ENTITY_COMPONENT_FACTORY_MAP = {
    Transform,
    Renderable,
    Motion,
    PlayerControlled,
};

async function main()
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
    const entityManager = new EntityManager({
        componentFactoryMap: ENTITY_COMPONENT_FACTORY_MAP,
    });

    const player = entityManager.create({
        Transform: { sceneGraph: scene },
        Renderable: { renderType: 'player' },
        Motion: {},
        PlayerControlled: true,
    });
    const playerAABB = IntersectionHelper.createAABB(0, 0, 8, 8);
    scene.add(playerAABB, player);

    const walls = [
        entityManager.create({
            Transform: { sceneGraph: scene, x: 0, y: 0 },
            Renderable: { renderType: 'wall', width: 4, height: 64 },
        }),
        entityManager.create({
            Transform: { sceneGraph: scene, x: 0, y: 0 },
            Renderable: { renderType: 'wall', width: 64, height: 4 },
        }),
        entityManager.create({
            Transform: { sceneGraph: scene, x: 64, y: 0 },
            Renderable: { renderType: 'wall', width: 4, height: 16 },
        }),
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
            for(let entityId of entityManager.getComponentEntityIds('Motion'))
            {
                let motion = entityManager.get('Motion', entityId);

                if (entityManager.has('PlayerControlled', entityId))
                {
                    let dx = input.getInputValue('moveRight') - input.getInputValue('moveLeft');
                    let dy = input.getInputValue('moveDown') - input.getInputValue('moveUp');
                    if (dx || dy)
                    {
                        let dr = Math.atan2(dy, dx);
                        motion.motionX += Math.cos(dr) * motion.speed;
                        motion.motionY += Math.sin(dr) * motion.speed;
                    }
                }

                let invFriction = 1 - motion.friction;
                motion.motionX *= invFriction;
                motion.motionY *= invFriction;

                if (entityManager.has('Transform', entityId))
                {
                    let transform = entityManager.get('Transform', entityId);
                    transform.x += motion.motionX;
                    transform.y += motion.motionY;
                }
            }
            
            // Camera
            let controlledEntity = entityManager.getComponentEntityIds('PlayerControlled')[0];
            let controlledTransform = entityManager.get('Transform', controlledEntity);
            view.camera.moveTo(controlledTransform.x, controlledTransform.y, 0, dt * cameraSpeed);

            // Physics
            // IntersectionResolver.resolveIntersections(dynamics, statics, dt);
        }

        // Render
        {
            ctx.clearRect(0, 0, display.width, display.height);

            renderSceneGraph(ctx, scene, view,
                (node) => {
                    return node;
                },
                (ctx, child, node) => {
                    if (entityManager.has('Renderable', child))
                    {
                        const renderable = entityManager.get('Renderable', child);
                        switch(renderable.renderType)
                        {
                            case 'player':
                                ctx.fillStyle = 'blue';
                                ctx.fillRect(-8, -8, 16, 16);
                                break;
                            case 'wall':
                                ctx.fillStyle = 'white';
                                ctx.fillRect(0, 0, renderable.width, renderable.height);
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

function renderSceneGraph(ctx, sceneGraph, view, transformCallback, renderer)
{
    let rootNode = sceneGraph.get(null);
    let {
        localTransformation: rootLocalTransformation,
        worldTransformation: rootWorldTransformation
    } = transformCallback(rootNode);
    view.getViewProjectionMatrix(rootLocalTransformation);
    mat4.copy(rootWorldTransformation, rootLocalTransformation);

    let domMatrix = new DOMMatrix();
    sceneGraph.forEach((child, node) => {
        let { parent } = node;
        let parentTransform = transformCallback(parent);
        let childTransform = transformCallback(node);

        let { localTransformation, worldTransformation } = childTransform;
        const { worldTransformation: parentWorldTransformation } = parentTransform;

        mat4.fromTranslation(localTransformation, [childTransform.x, childTransform.y, childTransform.z]);
        mat4.multiply(worldTransformation, parentWorldTransformation, localTransformation);
        
        setDOMMatrix(domMatrix, worldTransformation);
        ctx.setTransform(domMatrix);

        renderer(ctx, child, node);
    },
    { skipRoot: true });

    ctx.setTransform();
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
