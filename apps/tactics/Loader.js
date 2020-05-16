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
