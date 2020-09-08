import { InputContext, SceneGraph, EntityManager, AxisAlignedBoundingBoxGraph, CanvasView2D, setDOMMatrix } from 'milque';
import { mat4, quat, vec3 } from 'gl-matrix';

import inputmap from '@app/assets/inputmap.json';

document.addEventListener('DOMContentLoaded', main);

// TODO: Should print the key code of any key somewhere, so we know what to use.
// NOTE: https://keycode.info/
const INPUT_MAPPING = inputmap;

const Transform = {
    create(props, entityId)
    {
        const { sceneGraph, parentId = undefined, x = 0, y = 0, z = 0} = props;
        if (!sceneGraph) throw new Error(`Component instantiation is missing required prop 'sceneGraph'.`);
        sceneGraph.add(entityId, parentId);
        let result = {
            sceneGraph,
            worldTransformation: mat4.create(),
            localTransformation: mat4.create(),
            x, y, z,
            pitch: 0, yaw: 0, roll: 0,
            scaleX: 1, scaleY: 1, scaleZ: 1,
        };
        return result;
    },
    destroy(component, entityId)
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

const Collidable = {
    create(props, entityId)
    {
        const { aabbGraph, masks } = props;
        for(let maskName in masks)
        {
            aabbGraph.add(entityId, maskName, masks[maskName]);
        }

        return {
            aabbGraph,
            masks,
            collided: false,
        };
    },
    destroy(component, entityId)
    {
        const { aabbGraph, masks } = component;
        for(let maskName in masks)
        {
            aabbGraph.remove(entityId, maskName);
        }
    }
};

const ENTITY_COMPONENT_FACTORY_MAP = {
    Transform,
    Renderable,
    Motion,
    PlayerControlled,
    Collidable,
};

async function main()
{
    const display = document.querySelector('display-port');
    const input = new InputContext(INPUT_MAPPING);
    document.body.appendChild(input);

    const ctx = display.canvas.getContext('2d');
    const view = new CanvasView2D(display);
    const cameraSpeed = 4;

    const scene = new SceneGraph();
    const aabbs = new AxisAlignedBoundingBoxGraph();
    const entityManager = new EntityManager({
        componentFactoryMap: ENTITY_COMPONENT_FACTORY_MAP,
    });

    const player = entityManager.create({
        Transform: { sceneGraph: scene },
        Renderable: { renderType: 'player' },
        Motion: {},
        PlayerControlled: true,
        Collidable: {
            aabbGraph: aabbs,
            masks: {
                main: {
                    rx: 8, ry: 8,
                    get(aabb, owner)
                    {
                        const transform = entityManager.get('Transform', owner);
                        aabb.x = transform.x;
                        aabb.y = transform.y;
                    }
                }
            }
        }
    });

    const walls = [
        entityManager.create({
            Transform: { sceneGraph: scene, x: -4, y: 32 },
            Renderable: { renderType: 'wall', width: 4, height: 64 },
            Collidable: { aabbGraph: aabbs, masks: { main: { x: -4, y: 32, rx: 2, ry: 32 } } }
        }),
        entityManager.create({
            Transform: { sceneGraph: scene, x: 32, y: -4 },
            Renderable: { renderType: 'wall', width: 64, height: 4 },
            Collidable: { aabbGraph: aabbs, masks: { main: { x: 32, y: -4, rx: 32, ry: 2 } } }
        }),
        entityManager.create({
            Transform: { sceneGraph: scene, x: 64, y: 8 },
            Renderable: { renderType: 'wall', width: 4, height: 16 },
            Collidable: { aabbGraph: aabbs, masks: { main: { x: 64, y: 8, rx: 2, ry: 8 } } }
        }),
    ];

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
            for(let collidable of entityManager.getComponentInstances('Collidable'))
            {
                collidable.collided = false;
            }
            let collisions = aabbs.solve();
            for(let collision of collisions)
            {
                {
                    let entityId = collision.box.owner;
                    let collidable = entityManager.get('Collidable', entityId);
                    collidable.collided = true;
                }
                {
                    let entityId = collision.other.owner;
                    let collidable = entityManager.get('Collidable', entityId);
                    collidable.collided = true;
                }
            }
        }

        // Render
        {
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
