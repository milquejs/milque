import { AssetRef, ImageLoader } from '@milque/asset';

import { AssetProvider, CanvasProvider, EntityProvider } from './main';
import { useContext, useCurrentAnimationFrameDetail } from '../runner';

import { Tia } from './tia/Tia';

// @ts-ignore
import STAR_PATH from './star.png';
const StarImage = new AssetRef('star.png', ImageLoader, { imageType: 'png' }, STAR_PATH);

import { ComponentClass, Query } from '@milque/scene';

export const PROVIDERS = [
    GameProvider,
    StageProvider,
];

export function GameProvider(m) {
    const canvas = useContext(m, CanvasProvider);
    const ctx = canvas.getContext('2d');
    const tia = new Tia();
    return {
        tia,
        ctx,
    };
}

export function StageProvider(m) {
    return {
        width: 400,
        height: 300,
        views: [
            {
                name: 'main',
                offsetX: 0,
                offsetY: 0,
                width: 400,
                height: 300,
            }
        ],
        sprites: [
            {
                name: 'boy',
                image: 'star.png',
                width: 32,
                height: 32,
                mask: {
                    type: 'aabb',
                    dimensions: { left: 0, right: 32, top: 0, bottom: 32 },
                },
                originX: 0,
                originY: 0,
                frames: [
                    { u: 0, v: 0, s: 1, t: 1 }
                ],
                frameSpeed: 1,
                length: 1,
            }
        ],
        objects: [
            {
                name: 'boy',
                sprite: 'boy',
                collider: 'boy',
                parent: null,
                initial: {
                    visible: true,
                }
            }
        ],
        instances: [
            {
                object: 'boy',
                transform: {
                    x: 200,
                    y: 150,
                    scaleX: 1,
                    scaleY: 1,
                    rotation: 0,
                }
            },
            {
                object: 'boy',
                transform: {
                    x: 0,
                    y: 0,
                    scaleX: 1,
                    scaleY: 1,
                    rotation: 0,
                }
            }
        ],
    };
}

class GameObject {
    constructor() {
        this.object = null;
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;

        this.visible = true;

        this.spriteIndex = 0;
        this.spriteIndexDelta = 0;
    }
}

const GameObjectComponent = new ComponentClass('gameObject', () => new GameObject());
const GameObjectQuery = new Query(GameObjectComponent);

export async function preload(m) {
    const stage = useContext(m, StageProvider);
    const assets = useContext(m, AssetProvider);
    const canvas = useContext(m, CanvasProvider);
    canvas.width = stage.width;
    canvas.height = stage.height;

    await StarImage.load(assets);
}

export function init(m) {
    const stage = useContext(m, StageProvider);
    const ents = useContext(m, EntityProvider);

    for(let instance of stage.instances) {
        let ent = ents.create();
        let go = ents.attach(ent, GameObjectComponent);
        go.object = instance.object;
        go.x = instance.transform.x;
        go.y = instance.transform.y;
        go.scaleX = instance.transform.scaleX;
        go.scaleY = instance.transform.scaleY;
        go.rotation = instance.transform.rotation;
        go.spriteIndex = 0;
        go.spriteIndexDelta = 0;
        go.visible = true;
    }
}

export function update(m) {
    const stage = useContext(m, StageProvider);
    const { deltaTime } = useCurrentAnimationFrameDetail(m);
    const ents = useContext(m, EntityProvider);

    for(let [_, go] of GameObjectQuery.findAll(ents)) {
        let objectConfig = stage.objects.find(obj => obj.name === go.object);
        let spriteConfig = stage.sprites.find(spr => spr.name == objectConfig.sprite);
        go.spriteIndexDelta += deltaTime;
        go.spriteIndexDelta %= spriteConfig.length;
        go.spriteIndex = Math.floor(go.spriteIndexDelta);
    }
}

export function draw(m) {
    const stage = useContext(m, StageProvider);
    const assets = useContext(m, AssetProvider);
    const ents = useContext(m, EntityProvider);
    const { tia, ctx } = useContext(m, GameProvider);
    
    tia.cls(ctx, 0xFF0000);
    for(let [_, go] of GameObjectQuery.findAll(ents)) {
        if (!go.visible) {
            return;
        }
        let objectConfig = stage.objects.find(obj => obj.name === go.object);
        let spriteConfig = stage.sprites.find(spr => spr.name === objectConfig.sprite);
        /** @type {HTMLImageElement} */
        let image = assets.get(spriteConfig.image);
        tia.spr(ctx, image, go.spriteIndex,
            go.x - spriteConfig.originX,
            go.y - spriteConfig.originY,
            spriteConfig.width,
            spriteConfig.height);
    }
}
