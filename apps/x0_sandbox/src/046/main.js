import { FixedSpriteGLRenderer2d } from 'src/renderer/FixedSpriteGLRenderer2d.js';

/**
 * @param {import('../game/Game.js').Game} game 
 */
export async function main(game) {
    const { display, assets } = game;
    const canvas = display.canvas;
    const renderer = new FixedSpriteGLRenderer2d(canvas);

    // Dungeon
    let dungeonAtlas = assets.getAsset('atlas:dungeon.atlas');
    let dungeonImage = assets.getAsset('image:dungeon.png');
    renderer.texture(1, dungeonImage, 'dungeon.all');
    loadSpritesFromAtlas(renderer, 1, dungeonAtlas);

    // Font
    renderer.texture(2, assets.getAsset('image:font.png'), 'font.all');
    loadFontSprite(renderer, 2);

    // NineBox
    renderer.texture(3, assets.getAsset('image:water_tile.png'), 'nine.all');
    loadNineSprite(renderer, 3, 16, 16);

    display.addEventListener('frame', e => {
        const { deltaTime } = e.detail;

        renderer.prepare();

        renderer.pushScaling(2, 2);
        renderer.color(0xFFFFFF);
        renderer.zLevel(100);
        renderer.draw('lizard_m_idle_anim', 0, 16, 16, 0);
        renderer.popTransform();

        let margin = 40;
        drawText(renderer, 'Hello World', margin + 20, display.height - 200 + 20);
        drawNineBox(renderer, margin, display.height - 200, display.width - margin, display.height - margin);
    });
}

function drawNineBox(renderer, left, top, right = left, bottom = top) {
    let width = right - left;
    let height = bottom - top;
    let dw = width / 3;
    let dh = height / 3;
    let dm = Math.min(dw, dh);
    let dwr = width - dm * 2;
    let dhr = height - dm * 2;
    // Top Layer
    renderer.drawRect('nine', 0, left, top, left + dm, top + dm);
    renderer.drawRect('nine', 1, left + dm, top, left + dm + dwr, top + dm);
    renderer.drawRect('nine', 2, left + dm + dwr, top, left + width, top + dm);

    // Middle Layer
    renderer.drawRect('nine', 3, left, top + dm, left + dm, top + dm + dhr);
    renderer.drawRect('nine', 4, left + dm, top + dm, left + dm + dwr, top + dm + dhr);
    renderer.drawRect('nine', 5, left + dm + dwr, top + dm, left + width, top + dm + dhr);

    // Bottom Layer
    renderer.drawRect('nine', 6, left, top + dm + dhr, left + dm, top + height);
    renderer.drawRect('nine', 7, left + dm, top + dm + dhr, left + dm + dwr, top + height);
    renderer.drawRect('nine', 8, left + dm + dwr, top + dm + dhr, left + width, top + height);
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
function loadFontSprite(renderer, textureUnit)
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
        renderer.frame(name, textureUnit, u, v, s, t);
    }
    renderer.sprite('font', frames);
}

/** @param {FixedSpriteGLRenderer2d} renderer */
function loadNineSprite(renderer, textureUnit, textureWidth, textureHeight) {
    let dw = textureWidth / 3;
    let dh = textureHeight / 3;
    let frames = [];
    // Top-Left
    renderer.frame('nine.0', textureUnit, 0, 0, dw, dh);
    frames.push('nine.0');
    // Top-Center
    renderer.frame('nine.1', textureUnit, dw, 0, dw * 2, dh);
    frames.push('nine.1');
    // Top-Right
    renderer.frame('nine.2', textureUnit, dw * 2, 0, textureWidth, dh);
    frames.push('nine.2');
    // Center-Left
    renderer.frame('nine.3', textureUnit, 0, dh, dw, dh * 2);
    frames.push('nine.3');
    // Center-Center
    renderer.frame('nine.4', textureUnit, dw, dh, dw * 2, dh * 2);
    frames.push('nine.4');
    // Center-Right
    renderer.frame('nine.5', textureUnit, dw * 2, dh, textureWidth, dh * 2);
    frames.push('nine.5');
    // Bottom-Left
    renderer.frame('nine.6', textureUnit, 0, dh * 2, dw, textureHeight);
    frames.push('nine.6');
    // Bottom-Center
    renderer.frame('nine.7', textureUnit, dw, dh * 2, dw * 2, textureHeight);
    frames.push('nine.7');
    // Bottom-Right
    renderer.frame('nine.8', textureUnit, dw * 2, dh * 2, textureWidth, textureHeight);
    frames.push('nine.8');
    // Sprite
    renderer.sprite('nine', frames);
}
