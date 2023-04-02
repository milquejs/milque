import { AssetRef, ImageLoader, JSONLoader } from '@milque/asset';
import { drawSprite, SpriteDef, SpriteDefLoader, SpriteInstance } from '../055/sprite';
import { useWhenSystemDraw, useWhenSystemUpdate } from '../runner';

//@ts-ignore
import BUNNY_IMAGE_PATH from '../055/bunny.png';
//@ts-ignore
import BUNNY_SPRITE_PATH from './bunny.sprite.json';
const BunnyImage        = new AssetRef('bunny.png', ImageLoader, undefined, BUNNY_IMAGE_PATH);
const BunnySpriteDef    = new AssetRef('bunny.sprite.json', SpriteDefLoader, undefined, BUNNY_SPRITE_PATH);
const BunnyEyesSpriteDef = new AssetRef('bunny_eyes.sprite.json', async () => SpriteDef.fromSpriteSheet('bunny.png', 64, 64, 0, 0, 5, 1, 3, 5));

export function BunnySystem(m) {
    useWhenSystemUpdate(m, 0, () => {
        
    });
}
