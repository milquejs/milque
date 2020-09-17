import { ImageLoader } from 'milque';

import { TextureAtlas } from './TextureAtlas.js';

export async function loadTextureAtlas(filePath, opts)
{
    let atlasFile = await fetch(filePath);
    let atlasText = await atlasFile.text();

    const sourcePath = filePath.substring(0, filePath.lastIndexOf('.')) + '.png';
    let sourceImage = await ImageLoader.loadImage(sourcePath);
    
    return parseAtlasFromFile(sourceImage, atlasText);
}

function parseAtlasFromFile(sourceImage, atlasText)
{
    let textureAtlas = new TextureAtlas(sourceImage);
    for(let line of atlasText.split('\n'))
    {
        line = line.trim();
        if (line.length <= 0) continue;
        if (line.startsWith('//')) continue;
        if (line.startsWith('#')) continue;

        let [name, u, v, w, h, cols, rows] = line.split(/\s+/);
        u = Number(u);
        v = Number(v);
        w = Number(w);
        h = Number(h);
        cols = typeof cols !== 'undefined' ? Number(cols) : 1;
        rows = typeof rows !== 'undefined' ? Number(rows) : 1;
        textureAtlas.addSubTexture(name, u, v, w, h, cols, rows);
    }
    return textureAtlas;
}
