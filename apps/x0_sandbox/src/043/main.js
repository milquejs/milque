import { FixedSpriteGLRenderer2d } from 'src/renderer/FixedSpriteGLRenderer2d.js';

/** @typedef {import('src/audio/Sound.js').Sound} Sound */

/** @param {import('src/lib/game/Game.js').Game} game */
export async function main(game)
{
    const { display, inputs, assets } = game;
    inputs.bindAxis('cursorX', 'Mouse', 'PosX');
    inputs.bindAxis('cursorY', 'Mouse', 'PosY');
    inputs.bindButton('activate', 'Mouse', 'Button0');
    inputs.bindButton('activate', 'Mouse', 'Button2');

    const canvas = display.canvas;
    canvas.style = 'cursor: none';
    const renderer = new FixedSpriteGLRenderer2d(display.canvas);
    renderer.texture(0, assets.getAsset('image:cube.png'), 'cube');
    renderer.texture(1, assets.getAsset('image:font.png'), 'font.all');
    renderer.texture(2, assets.getAsset('image:toast.png'), 'toast');
    renderer.texture(3, assets.getAsset('image:slime.png'), 'slime.all');
    loadSpritesFromAtlas(renderer, 3, assets.getAsset('atlas:slime.atlas'));
    loadFontSprite(renderer);

    let slimes = [
        createSlime(0, 0),
        createSlime(0, 0),
        createSlime(0, 0),
        createSlime(0, 0),
        createSlime(0, 0),
        createSlime(0, 0),
    ];
    
    game.on('frame', () => {
        renderer.prepare();

        const cx = inputs.getAxisValue('cursorX') * display.width;
        const cy = inputs.getAxisValue('cursorY') * display.height;
        renderer.draw('toast', 0, cx, cy);
        renderer.draw('cube', 0, display.width / 2 - 16, display.height / 2 - 16);
        drawText(renderer, 'hello\nI like eggs and toast', 32, 32);

        for(let slime of slimes)
        {
            updateSlime(game, slime);
            drawSlime(renderer, slime);
        }
        
        if (inputs.isButtonPressed('activate'))
        {
            /** @type {Sound} */
            let pop = assets.getAsset('sound:pop.wav');
            pop.play({ pitch: (Math.random() - 0.5) * 10, gain: 0.5 });
        }
    });
}

function createSlime(x, y)
{
    return {
        x: x,
        y: y,
        speed: 0.8 + 0.5 * Math.random(),
        target: {
            x: 0,
            y: 0,
        },
        frameIndex: 0,
    };
}

function updateSlime(game, slime)
{
    slime.frameIndex += 0.06 * slime.speed;
    let target = slime.target;
    let dx = target.x - slime.x;
    let dy = target.y - slime.y;
    let targetDist = Math.sqrt(dx * dx + dy * dy);
    if (targetDist < 16)
    {
        target.x = Math.random() * game.display.width;
        target.y = Math.random() * game.display.height;
    }
    let dr = Math.atan2(dy, dx);
    let moveSpeed = slime.speed;
    slime.dx = Math.cos(dr) * moveSpeed;
    slime.dy = Math.sin(dr) * moveSpeed;
    slime.x += slime.dx;
    slime.y += slime.dy;
}

/**
 * @param {FixedSpriteGLRenderer2d} renderer
 */
function drawSlime(renderer, slime)
{
    renderer.draw('slime_walk', slime.frameIndex, slime.x, slime.y, 0, 4 * (slime.dx < 0 ? -1 : 1), 4);
}

/**
 * @param {FixedSpriteGLRenderer2d} renderer 
 * @param {string} text 
 * @param {number} x 
 * @param {number} y 
 */
function drawText(renderer, text, x, y)
{
    let rootX = x;
    let rootIndex = 'A'.charCodeAt(0);
    text = text.toUpperCase();
    for(let i = 0; i < text.length; ++i)
    {
        let c = text.charAt(i);
        if (c === '\n')
        {
            y += 8;
            x = rootX;
            continue;
        }
        else if (c === ' ')
        {
            x += 8;
            continue;
        }
        else
        {
            x += 8;
            let frame = Math.abs(text.charCodeAt(i) - rootIndex) % 40;
            renderer.draw('font', frame, x, y);
        }
    }
}

/** @param {FixedSpriteGLRenderer2d} renderer */
function loadSpritesFromAtlas(renderer, textureUnit, atlas)
{
    for(let sprite of Object.values(atlas))
    {
        const {
            u, v,
            w, h,
            cols,
            rows,
            name,
        } = sprite;
        let frames = [];
        for(let i = 0; i < cols; ++i)
        {
            for(let j = 0; j < rows; ++j)
            {
                let frameName = `${name}.${i}`;
                frames.push(frameName);
                renderer.frame(frameName, textureUnit,
                    u + i * w,
                    v + j * h,
                    u + (i + 1) * w,
                    v + (j + 1) * h);
            }
        }
        renderer.sprite(name, frames);
    }
}

/** @param {FixedSpriteGLRenderer2d} renderer */
function loadFontSprite(renderer)
{
    let frames = [];
    let w = 8;
    let h = 8;
    for(let i = 0; i < 40; ++i)
    {
        let u = (i % 8) * w;
        let v = Math.floor(i / 8) * h;
        let s = u + w;
        let t = v + h;
        let name = `font.${i}`;
        frames.push(name);
        renderer.frame(name, 1, u, v, s, t);
    }
    renderer.sprite('font', frames);
}
