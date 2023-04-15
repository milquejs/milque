import { ComponentClass, EntityManager, Query, SceneGraph } from '@milque/scene';
import { useFrameEffect, useProviderEffect, using } from '../runner2';
import { AssetProvider, EntityProvider, RenderingProvider, SceneGraphProvider } from './Providers';
import { createTransform } from './Transform';
import { createSpriteInstance, drawSpriteInstance, updateSpriteInstance } from '../room3/sprite';

export function GameObjectSystem(m) {
    const ents = using(m, EntityProvider);
    const sceneGraph = using(m, SceneGraphProvider);
    const { ctx, tia } = using(m, RenderingProvider);

    useComponentEffect(m, ents, GameObjectComponent, (entityId) => {
        const gameObject = ents.get(entityId, GameObjectComponent);
        gameObject.onCreate(m, entityId);
        return () => gameObject.onDestroy(m, entityId);
    });
    // Clear screen buffer (first thing!)
    useFrameEffect(m, Number.NEGATIVE_INFINITY, () => tia.cls(ctx, 0xFFFFFF));
    // Update the objects
    useFrameEffect(m, 0, (frameDetail) => {
        for(let gameObject of GameObjectQuery.findComponents(ents, GameObjectComponent)) {
            gameObject.onUpdate(m, frameDetail);
        }
    });
    // Draw the objects
    useFrameEffect(m, 1, (frameDetail) => {
        SceneGraph.walk(sceneGraph, (node) => {
            let gameObject = ents.get(node, GameObjectComponent);
            if (!gameObject || !gameObject.visible) {
                return;
            }
            let t = gameObject.transform;
            tia.mat(t.x, t.y, t.scaleX, t.scaleY, t.rotation);
            tia.push();
            gameObject.onDraw(m, frameDetail);
            return () => tia.pop();
        }, { childFilter: (children) => {
            return children.sort((a, b) => {
                let objA = ents.get(a, GameObjectComponent);
                let objB = ents.get(b, GameObjectComponent);
                return objA.zDepth - objB.zDepth;
            })
        }});
    });
}

/**
 * @typedef {(entityId: import('@milque/scene').EntityId) => Promise<() => void>|(() => void)|Promise<void>|void} ComponentEffectHandler
 */

/**
 * @param {object} m 
 * @param {EntityManager} ents
 * @param {import('@milque/scene').ComponentClass<?>} componentClass 
 * @param {ComponentEffectHandler} handler 
 */
export function useComponentEffect(m, ents, componentClass, handler) {
    const ref = { current: {} };
    useProviderEffect(m, () => {
        const callback = async (ents, entityId, attached, detached, dead) => {
            if (attached === componentClass) {
                let after = await handler(entityId);
                if (typeof after === 'function') {
                    if (!(entityId in ref.current)) {
                        ref.current[entityId] = [];
                    }
                    ref.current[entityId].push(after);
                }
            } else if (detached === componentClass) {
                if (entityId in ref.current) {
                    let afters = ref.current[entityId];
                    delete ref.current[entityId];
                    for (let after of afters) {
                        await after();
                    }
                }
            }
        };
        ents.addEventListener('change', callback);
        return () => ents.removeEventListener('change', callback);
    });
}

const TransformComponent = new ComponentClass('game.transform', createTransform);
const GameObjectComponent = new ComponentClass('game.object', () => new GameObject(null, 0));
const GameObjectQuery = new Query(GameObjectComponent);

export class GameObject {

    static get ComponentClass() {
        let value = new ComponentClass(`game.objecttype.${this.name}`);
        Object.defineProperty(this, 'ComponentClass', { value });
        return value;
    }

    static get Query() {
        let value = new Query(this.ComponentClass);
        Object.defineProperty(this, 'Query', { value });
        return value;
    }

    /**
     * @param {EntityManager} ents 
     * @param {import('@milque/scene').EntityId} entityId
     */
    constructor(ents, entityId) {
        if (!ents) {
            throw new Error('Missing EntityManager; cannot attach() GameObject as component - use `new GameObject()` instead!');
        }
        if (!entityId) {
            throw new Error('Missing entityId - must be a non-zero integer.');
        }
        const ThisClass = /** @type {typeof GameObject} */ (this.constructor);
        ents.attach(entityId, GameObjectComponent, this);
        if (ThisClass !== GameObject) {
            ents.attach(entityId, ThisClass.ComponentClass);
        }
        
        this.transform = ents.attach(entityId, TransformComponent);
        /** @type {Array<import('../room3/sprite').SpriteInstance>} */
        this.sprites = [];

        this.entityId = entityId;
        this.parentId = 0;

        this.zDepth = 0;
        this.visible = true;
    }

    /**
     * @param {object} m
     * @param {GameObject} parentObject 
     */
    setParent(m, parentObject) {
        const ents = using(m, EntityProvider);
        const sceneGraph = using(m, SceneGraphProvider);
        let parentId = parentObject.entityId;
        if (parentId === this.parentId) {
            return;
        }
        this.parentId = parentObject.entityId;
        if (!SceneGraph.has(sceneGraph, this.entityId)) {
            SceneGraph.add(sceneGraph, this.entityId, this.parentId);
        } else {
            SceneGraph.parent(sceneGraph, this.entityId, this.parentId);
        }
        return this;
    }

    withTransform(x, y, scaleX = 1, scaleY = 1, rotation = 0) {
        this.transform.x = x;
        this.transform.y = y;
        this.transform.scaleX = scaleX;
        this.transform.scaleY = scaleY;
        this.transform.rotation = rotation;
        return this;
    }

    withSprite(spriteName, frameIndex = 0, frameSpeed = 0) {
        this.sprites.push(createSpriteInstance(spriteName, frameIndex, frameSpeed));
        return this;
    }

    withZDepth(depth) {
        this.zDepth = depth;
        return this;
    }

    /**
     * @param {object} m 
     * @param {import('@milque/scene').EntityId} entityId
     */
    onCreate(m, entityId) {
        const sceneGraph = using(m, SceneGraphProvider);
        if (!SceneGraph.has(sceneGraph, this.entityId)) {
            SceneGraph.add(sceneGraph, this.entityId, this.parentId);
        }
    }

    /**
     * @param {object} m 
     * @param {import('@milque/scene').EntityId} entityId
     */
    onDestroy(m, entityId) {
        const sceneGraph = using(m, SceneGraphProvider);
        if (SceneGraph.has(sceneGraph, this.entityId)) {
            SceneGraph.prune(sceneGraph, this.entityId);
        }
    }

    /**
     * @param {object} m 
     * @param {import('@milque/scene').AnimationFrameDetail} frameDetail 
     */
    onUpdate(m, frameDetail) {
        let assets = using(m, AssetProvider);
        if (this.sprites.length > 0) {
            for(let sprite of this.sprites) {
                updateSpriteInstance(assets, frameDetail.deltaTime, sprite);
            }
        }
    }

    /**
     * @param {object} m 
     * @param {import('@milque/scene').AnimationFrameDetail} frameDetail 
     */
    onDraw(m, frameDetail) {
        let { ctx, tia } = using(m, RenderingProvider);
        let assets = using(m, AssetProvider);
        if (this.sprites.length > 0) {
            for(let sprite of this.sprites) {
                tia.matBegin(ctx);
                drawSpriteInstance(ctx, assets, sprite);
                tia.matEnd(ctx);
            }
        } else {
            tia.rectFill(ctx, 0, 0, 16, 16, 0xFF00FF);
            tia.rectFill(ctx, 0, 0, 8, 8, 0x000000);
            tia.rectFill(ctx, 8, 8, 16, 16, 0x000000);
        }
    }
}
