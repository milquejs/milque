export async function loadAssets(assetList, assetParentPath = '.')
{
    let results = {};
    for(let assetId of assetList)
    {
        let [assetType, assetPath] = assetId.split(':');
        let assetLoader = getAssetLoader(assetType);
        results[assetId] = await assetLoader(assetParentPath + '/' + assetPath);
    }
    return results;
}

export function getAssetLoader(assetType)
{
    switch(assetType)
    {
        case 'image': return loadImage;
        case 'text': return loadText;
        case 'json': return loadJSON;
        case 'bytes': return loadBytes;
    }
}

export async function loadImage(filepath, opts = {})
{
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.addEventListener('load', () => {
            resolve(img);
        });
        img.addEventListener('error', ev => {
            reject(ev);
        });
        img.src = filepath;
    });
}

export async function loadText(filepath, opts = {})
{
    let result = await fetch(filepath);
    return result.text();
}

export async function loadBytes(filepath, opts = {})
{
    let result = await fetch(filepath);
    let buffer = await result.arrayBuffer();
    return buffer;
}

export async function loadJSON(filepath, opts = {})
{
    let result = await fetch(filepath);
    let json = await result.json();
    return json;
}
