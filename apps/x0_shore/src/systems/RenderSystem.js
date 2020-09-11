import { mat4, quat, vec3 } from 'gl-matrix';
import { setDOMMatrix } from 'milque';

export class RenderSystem
{
    constructor(entityManager, sceneGraph, view)
    {
        this.entityManager = entityManager;
        this.sceneGraph = sceneGraph;
        this.view = view;
        this.renderers = {};

        this.renderScene = this.renderScene.bind(this);
        this.renderNode = this.renderNode.bind(this);
    }

    registerRenderer(renderType, renderer)
    {
        this.renderers[renderType] = renderer;
        return this;
    }

    unregisterRenderer(renderType)
    {
        delete this.renderers[renderType];
        return this;
    }

    render(ctx)
    {
        renderView(ctx, this.view, this.renderScene);
    }

    renderScene(ctx)
    {
        // Render scene objects...
        const { entityManager, sceneGraph } = this;
        renderSceneGraph(ctx, sceneGraph, entityManager, this.renderNode);
        
        // Render collision masks...
        // renderAxisAlignedBoundingBoxGraph(ctx, aabbs, entityManager);
    }

    renderNode(ctx, owner)
    {
        const { entityManager } = this;
        if (entityManager.has('Renderable', owner))
        {
            const { renderType } = entityManager.get('Renderable', owner);
            if (renderType in this.renderers)
            {
                this.renderers[renderType](ctx, owner, entityManager);
            }
        }
        else
        {
            ctx.fillStyle = 'red';
            ctx.fillRect(-1, -1, 2, 2);
        }
    }
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
    sceneGraph.walk(null,
        (child, childNode) => {
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
        },
        {
            childrenCallback(children, node)
            {
                children.sort((a, b) => {
                    let at = entityManager.get('Transform', a);
                    let bt = entityManager.get('Transform', b);
                    let dz = Math.floor(at.z - bt.z);
                    return dz || at.y - bt.y;
                });
            }
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
