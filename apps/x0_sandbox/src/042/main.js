import { Mouse } from '@milque/input';
import { lerp } from '@milque/util';
import { vec2 } from 'gl-matrix';

import { FixedShapeGLRenderer2d } from 'src/deprecated/fixedgl/FixedShapeGLRenderer2d.js';
import { FixedSpriteGLRenderer2d } from 'src/deprecated/fixedgl/FixedSpriteGLRenderer2d.js';

import { cartToIso, isoToCart, renderChunk, TileMap, TILE_SIZE } from './TileMap.js';

/**
 * @typedef {import('../lib/game/Game.js').Game} Game
 */

export async function main(game)
{
    const { display, assets } = game;
    const canvas = display.canvas;
    const renderer = new FixedShapeGLRenderer2d(canvas);
    const spriteRenderer = new FixedSpriteGLRenderer2d(canvas);

    const mouse = new Mouse(display);

    const { width: cubeWidth, height: cubeHeight } = assets.getAsset('image:cube.png');
    const halfCubeWidth = cubeWidth / 2;
    const halfCubeHeight = cubeHeight / 2;

    let cursor = {
        screenX: 0,
        screenY: 0,
        x: 0,
        y: 0,
    };
    let player = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
    };
    let camera = {
        screenX: 0,
        screenY: 0,
        x: 0,
        y: 0,
    };
    let tileMap = new TileMap();
    let worldSize = 4;
    for(let i = -worldSize; i <= worldSize; ++i)
    {
        for(let j = -worldSize; j <= worldSize; ++j)
        {
            await tileMap.loadChunk(i, j);
        }
    }
    // Cube
    spriteRenderer
        .texture(0, assets.getAsset('image:cube.png'), 'cube.0')
        .sprite('cube', ['cube.0']);
    
    // Dungeon
    let dungeonAtlas = assets.getAsset('atlas:dungeon.atlas');
    let dungeonImage = assets.getAsset('image:dungeon.png');
    spriteRenderer.texture(1, dungeonImage, 'dungeon.0');
    for(let key in dungeonAtlas)
    {
        let { u, v, w, h, frames } = dungeonAtlas[key];
        let frameNames = [];
        for(let i = 0; i < frames; ++i)
        {
            let frameName = `dungeon.${key}.${i}`;
            let x = u + w * i;
            spriteRenderer.frame(frameName, 1,
                x, v, x + w, v + h);
            frameNames.push(frameName);
        }
        spriteRenderer.sprite(`dungeon.${key}`, frameNames);
    }
    
    let frameTime = 0;
    display.addEventListener('frame', e => {
        const { deltaTime } = e.detail;
        frameTime += deltaTime / 60;

        let vec = vec2.create();
        camera.x = lerp(camera.x, player.x, 0.1);
        camera.y = lerp(camera.y, player.y, 0.1);
        let [cameraScreenX, cameraScreenY] = isoToCart(vec, camera.x, camera.y);
        camera.screenX = cameraScreenX;
        camera.screenY = cameraScreenY;

        cursor.screenX = cameraScreenX + (mouse.PosX.value - 0.5) * display.width;
        cursor.screenY = cameraScreenY + (mouse.PosY.value - 0.5) * display.height;
        let [cursorX, cursorY] = cartToIso(vec, cursor.screenX, cursor.screenY);
        cursor.x = cursorX;
        cursor.y = cursorY;

        if (mouse.Button0.down)
        {
            player.targetX = cursor.x;
            player.targetY = cursor.y;
        }

        let playerDX = player.targetX - player.x;
        let playerDY = player.targetY - player.y;
        let playerDist = Math.sqrt(playerDX * playerDX + playerDY * playerDY);
        if (playerDist > 1)
        {
            const MOVE_SPEED = 0.1;
            let dr = Math.atan2(playerDY, playerDX);
            player.x += Math.cos(dr) * MOVE_SPEED;
            player.y += Math.sin(dr) * MOVE_SPEED;
        }

        spriteRenderer.resize();
        renderer.clear();

        spriteRenderer.color(0xFFFFFF);
        spriteRenderer.pushScaling(2, 2, display.width / 2, display.height / 2);
        spriteRenderer.pushTranslation(display.width / 2, display.height / 2);
        {
            spriteRenderer.pushTranslation(-camera.screenX, -camera.screenY);
            {
                let tileRenderer = (renderer, x, y) => {
                    renderer.draw('cube', 0, x - halfCubeWidth, y - halfCubeHeight);
                };

                let chunkCoord = vec2.create();
                tileMap.getChunkCoord(chunkCoord, camera.x * TILE_SIZE, camera.y * TILE_SIZE);
                
                for(let i = -1; i <= 1; ++i)
                {
                    for(let j = -1; j <= 1; ++j)
                    {
                        let chunkCoordX = chunkCoord[0] + i;
                        let chunkCoordY = chunkCoord[1] + j;
                        let chunk = tileMap.getChunk(chunkCoordX, chunkCoordY);
                        if (chunk)
                        {
                            renderChunk(spriteRenderer, chunk, tileRenderer, { isTargetChunk: i === 0 && j === 0 });
                        }
                    }
                }

                spriteRenderer.color(0xFFFFFF);
                spriteRenderer.zLevel(100);
                let [playerScreenX, playerScreenY] = isoToCart(vec2.create(), player.x, player.y);
                spriteRenderer.draw('dungeon.lizard_m_idle_anim', Math.floor(frameTime * 0.5), playerScreenX - halfCubeWidth, playerScreenY - halfCubeHeight);

                spriteRenderer.color(0x00FF00);
                spriteRenderer.zLevel(100);
                spriteRenderer.draw('cube', 0, cursor.screenX - halfCubeWidth, cursor.screenY - halfCubeHeight);
            }
            spriteRenderer.popTransform();
        }
        spriteRenderer.popTransform();
        spriteRenderer.popTransform();
    });
}
