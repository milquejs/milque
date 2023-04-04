import { AssetRef } from '@milque/asset';
import { Random } from '@milque/random';

import { getObjectDef, getSpriteDef } from '../room2/Defs';
import { ObjectDef } from '../room2/object';
import { SpriteDef } from '../room2/sprite';
import { run, useContext, useCurrentAnimationFrameDetail, useCurrentTopics } from '../runner';
import { AssetProvider, DEPS, EntityProvider, RenderingProvider, SceneGraphProvider } from './Providers';

import { RoomProvider, useSpawner } from './RoomSystem';
import { CameraSystem } from './obj_camera';
import { BunnySystem } from './obj_bunny';

import * as defCarrot from './def_carrot';
import * as defFont from './def_font';
import * as defGround from './def_ground';
import * as defPants from './def_pants';
import { AsyncTopic, Topic } from '@milque/scene';
import { ObjectTopicRegistry, TitleSystem } from './obj_title';

export async function main() {
    await run(Game, [
        ...DEPS,
        RoomProvider,
        ObjectTopicRegistry,
        CameraSystem,
        BunnySystem,
        TitleSystem,
    ]);
}

// Why hooks? Encapsulate logic.

/*
function Bunny(m) {
    let def = useObjectDef(m, 'obj_bunny');
    let s = null;
    s = s.when();
    s = s.orWhen();
    s = s.andWhen();
    s = s.then();
    seq.andThen();
    seq.finally();

    whenCreate(m, (self) => {
    });
    whenUpdate(m, (self, dt) => {
        self.x += dx;
    });
    whenDestroy(m, (self) => {

    });
}
*/

export const Preload = new AsyncTopic('game.preload');
export const Init = new Topic('game.init');
export const PostInit = new Topic('game.postinit');

/** @type {Topic<import('@milque/scene').AnimationFrameDetail>} */
export const PreUpdate = new Topic('game.preupdate');
/** @type {Topic<import('@milque/scene').AnimationFrameDetail>} */
export const PostUpdate = new Topic('game.postupdate');

/** @type {Topic<import('@milque/scene').AnimationFrameDetail>} */
export const PreDraw = new Topic('tia.predraw');
/** @type {Topic<import('@milque/scene').AnimationFrameDetail>} */
export const PostDraw = new Topic('tia.postdraw');

const Game = {
    async preload(m) {
        let assets = useContext(m, AssetProvider);
        let topics = useCurrentTopics(m);
        await Promise.all([
            ...Object.values(defCarrot),
            ...Object.values(defFont),
            ...Object.values(defGround),
            ...Object.values(defPants),
        ].map(ref => ref instanceof AssetRef && ref.load(assets)));
        await Preload.dispatchImmediately(topics);
    },
    init(m) {
        let ents = useContext(m, EntityProvider);
        let topics = useCurrentTopics(m);
        let spawn = useSpawner(m);
        
        let minX = -100;
        let maxX = 100;
        spawn('obj_tuft', Random.rangeInt(minX, maxX), Random.rangeInt(minX, maxX));
        spawn('obj_tuft', Random.rangeInt(minX, maxX), Random.rangeInt(minX, maxX));
        spawn('obj_tuft', Random.rangeInt(minX, maxX), Random.rangeInt(minX, maxX));
        spawn('obj_tuft', Random.rangeInt(minX, maxX), Random.rangeInt(minX, maxX));
        spawn('obj_tuft', Random.rangeInt(minX, maxX), Random.rangeInt(minX, maxX));
        spawn('obj_tuft', Random.rangeInt(minX, maxX), Random.rangeInt(minX, maxX));
        spawn('obj_tuft', Random.rangeInt(minX, maxX), Random.rangeInt(minX, maxX));
        
        spawn('obj_ground', 16, 24);
        spawn('obj_ground', 28, 18);
        spawn('obj_ground', 42, 22);
        spawn('obj_stone', 8, 27);
        spawn('obj_stone', 4, 28);
        spawn('obj_stone', 70, 22);
        spawn('obj_grass', 100, 50);
        spawn('obj_grass', 100, 50);
        spawn('obj_font', 200, 20);
        spawn('obj_carrot', 50, 50);
        spawn('obj_carrot_bitten_1', 60, 50);
        spawn('obj_carrot_bitten_2', 40, 80);
        spawn('obj_hovel', 100, 100);
        spawn('obj_hovel_occupied', 200, 100);
        spawn('obj_hovel', 150, 40);
        spawn('obj_bunny_occupied', 150, 40);
        spawn('obj_hovel', 240, 60);
        spawn('obj_pants', -64, -64);
        spawn('obj_bunny_seated', 240, 60);

        Init.dispatchImmediately(topics);
        ents.flush();
        PostInit.dispatchImmediately(topics);
        // Fire create event.
    },
    update(m) {
        let ents = useContext(m, EntityProvider);
        let assets = useContext(m, AssetProvider);
        let frameDetail = useCurrentAnimationFrameDetail(m);
        let topics = useCurrentTopics(m);
        let objectTopicRegistry = useContext(m, ObjectTopicRegistry);

        PreUpdate.dispatchImmediately(topics, frameDetail);
        for(let [_, sprite] of SpriteDef.SpriteQuery.findAll(ents)) {
            let spriteDef = getSpriteDef(assets, sprite.spriteName);
            SpriteDef.updateInstance(frameDetail.deltaTime, sprite, spriteDef);
        }
        for(let [_, instance] of ObjectDef.ObjectQuery.findAll(ents)) {
            if (objectTopicRegistry.has(instance.objectName)) {
                let { update } = objectTopicRegistry.get(instance.objectName);
                for(let topic of update) {
                    topic.dispatchImmediately(topics, instance);
                }
            }
        }
        PostUpdate.dispatchImmediately(topics, frameDetail);
    },
    draw(m) {
        let ents = useContext(m, EntityProvider);
        let sceneGraph = useContext(m, SceneGraphProvider);
        let { ctx, tia } = useContext(m, RenderingProvider);
        let assets = useContext(m, AssetProvider);
        let frameDetail = useCurrentAnimationFrameDetail(m);
        let topics = useCurrentTopics(m);
        let room = useContext(m, RoomProvider);
        let objectTopicRegistry = useContext(m, ObjectTopicRegistry);

        tia.cls(ctx, room.background);
        PreDraw.dispatchImmediately(topics, frameDetail);
        // PreDraw
        ObjectDef.walkSceneGraph(ents, sceneGraph, (instance) => {
            if (!instance.visible) {
                return;
            }
            let objectDef = getObjectDef(assets, instance.objectName);
            if (!objectDef.sprite) {
                return;
            }
            let sprite = SpriteDef.getInstance(ents, instance.objectId);
            let spriteDef = getSpriteDef(assets, sprite.spriteName);
            let image = assets.get(spriteDef.image);
            tia.mat(instance.x, instance.y, instance.scaleX, instance.scaleY, instance.rotation);
            tia.push();
            if (objectTopicRegistry.has(instance.objectName)) {
                let { draw } = objectTopicRegistry.get(instance.objectName);
                for(let topic of draw) {
                    topic.dispatchImmediately(topics, instance);
                }
            } else {
                tia.matBegin(ctx);
                SpriteDef.drawInstance(ctx, sprite, spriteDef, image);
                tia.matEnd(ctx);
            }
            return () => {
                tia.pop();
            };
        });
        // PostDraw
        PostDraw.dispatchImmediately(topics, frameDetail);
    }
};
