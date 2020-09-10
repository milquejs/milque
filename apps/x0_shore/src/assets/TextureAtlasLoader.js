import { ImageLoader } from 'milque';
import { TextureAtlas } from '../sprite.js';

export async function loadTextureAtlas(filepath, opts)
{
    let file = await fetch(filepath);
    let text = await file.text();
    const [atlasMap, sourcePath, sourceFileOpts = {}] = parseAtlasFile(filepath, text);
    let image = await ImageLoader.loadImage(sourcePath, sourceFileOpts);
    return new TextureAtlas(image, atlasMap);
}

function parseAtlasFile(filePath, fileText)
{
    let sourcePath = filePath.substring(0, filePath.lastIndexOf('.')) + '.png';
    let map = {};
    for(let line of fileText.split('\n'))
    {
        line = line.trim();
        if (line.length <= 0) continue;
        if (line.startsWith('//')) continue;
        if (line.startsWith('#')) continue;

        let [name, x, y, w, h, count] = line.split(/\s+/);
        x = Number(x);
        y = Number(y);
        w = Number(w);
        h = Number(h);
        if (typeof count !== 'undefined')
        {
            count = Number(count);
            map[name] = [x, y, count * w, h];
        }
        else
        {
            map[name] = [x, y, w, h];
        }
    }
    return [map, sourcePath, {}];
}
