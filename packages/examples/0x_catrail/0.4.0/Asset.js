var assets = new Map();
var loaders = new Map();

export function createAssetLoader(load, unload)
{
    return {
        load,
        unload
    };
}

export function registerAssetLoader(type, loader)
{
    if (loaders.has(type))
    {
        loaders.get(type).push(loader);
    }
    else
    {
        loaders.set(type, [ loader ]);
    }
}

export function unregisterAssetLoader(type, loader)
{
    if (loaders.has(type))
    {
        let typeLoaders = loaders.get(type);
        typeLoaders.splice(typeLoaders.indexOf(loader), 1);
    }
}

export function getAssetLoader(type)
{
    return loaders.get(type);
}

export async function loadAsset(name, url = name, type = undefined, opts = {})
{
    if (!type)
    {
        let fileIndex = Math.max(url.lastIndexOf('/'), 0);
        let extIndex = url.indexOf('.', fileIndex);
        type = url.substring(extIndex + 1);
    }
    let loader = getAssetLoader(type);
    let result = await loader.load(url, opts);
    assets.set(name, result);
    return result;
}

export async function unloadAsset(name)
{

}

export function getAsset(name)
{

}

export function isAssetLoaded(name)
{

}
