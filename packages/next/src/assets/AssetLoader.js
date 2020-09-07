import { loadImage } from './ImageLoader.js';
import { loadText } from './TextLoader.js';
import { loadBytes } from './ByteLoader.js';
import { loadJSON } from './JSONLoader.js';
import { loadOBJ } from './OBJLoader.js';

let ASSET_LOADERS = {};

defineAssetLoader('image', loadImage);
defineAssetLoader('text', loadText);
defineAssetLoader('json', loadJSON);
defineAssetLoader('bytes', loadBytes);
defineAssetLoader('obj', loadOBJ);

export function defineAssetLoader(assetType, assetLoader)
{
    ASSET_LOADERS[assetType] = assetLoader;
}

export function getAssetLoader(assetType)
{
    if (assetType in ASSET_LOADERS)
    {
        return ASSET_LOADERS[assetType];
    }
    else
    {
        throw new Error(`Unknown asset type '${assetType}'.`);
    }
}

export async function loadAssetMap(assetMap, assetParentPath = '.')
{
    let result = {};
    for(let assetName of Object.keys(assetMap))
    {
        let entry = assetMap[assetName];
        if (typeof entry === 'string')
        {
            result[assetName] = await loadAsset(entry, undefined, assetParentPath);
        }
        else if (typeof entry === 'object')
        {
            if (!('src' in entry))
            {
                throw new Error(`Missing required field 'src' for entry in asset map.`);
            }

            if ('name' in entry && entry.name !== assetName)
            {
                throw new Error(`Cannot redefine name for asset '${assetName}' for entry in asset map.`);
            }

            result[assetName] = await loadAsset(entry.src, entry, assetParentPath);
        }
        else
        {
            throw new Error('Unknown entry type in asset map.');
        }
    }
    return result;
}

export async function loadAssetList(assetList, assetParentPath = '.')
{
    let result = {};
    for(let entry of assetList)
    {
        if (typeof entry === 'string')
        {
            result[entry] = await loadAsset(entry, undefined, assetParentPath);
        }
        else if (typeof entry === 'object')
        {
            if (!('src' in entry))
            {
                throw new Error(`Missing required field 'src' for entry in asset list.`);
            }

            result['name' in entry ? entry.name : entry.src] = await loadAsset(entry.src, entry, assetParentPath);
        }
        else
        {
            throw new Error('Unknown entry type in asset list.');
        }
    }
    return result;
}

export async function loadAsset(assetSrc, assetOpts = {}, assetParentPath = '.')
{
    if (assetSrc.indexOf(':') < 0)
    {
        throw new Error('Missing type for asset source.');
    }

    let [assetType, assetPath] = assetSrc.split(':');
    let assetLoader = getAssetLoader(assetType);
    return await assetLoader(assetParentPath + '/' + assetPath, assetOpts);
}