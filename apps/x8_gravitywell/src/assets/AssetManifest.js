/* global process */

function getBasePath()
{
    return process.env.NODE_ENV === 'development' ? '' : '../../../res/';
}

export class AssetManifest
{
    static builder()
    {
        return new AssetManifestBuilder();
    }
    
    constructor(assetMap)
    {
        /** @private */
        this.assets = assetMap;
    }

    async load()
    {
        await Promise.all(Object.values(this.assets).map(
            asset => typeof asset === 'function' ? asset() : asset));
        return this;
    }

    async loadAsset(assetType, assetName)
    {
        let asset = this.assets[assetType][assetName];
        if (typeof asset === 'function')
        {
            return await asset.call();
        }
        else
        {
            return asset;
        }
    }

    saveAsset(assetType, assetName, assetValue)
    {
        this.assets[assetType][assetName] = assetValue;
    }

    getAsset(assetType, assetName)
    {
        return this.assets[assetType][assetName];
    }
}

class AssetManifestBuilder
{
    constructor()
    {
        this.loaders = {};
        this.assets = {};
    }

    loader(assetType, loader, defaultOpts = {})
    {
        this.loaders[assetType] = {
            load: loader,
            opts: defaultOpts,
        };
        return this;
    }

    asset(assetType, assetUrl, assetOpts = undefined)
    {
        let assetKey = assetType + ':' + assetUrl + (assetOpts ? `?opts=${JSON.stringify(assetOpts)}` : '');
        this.assets[assetKey] = {
            key: assetKey,
            type: assetType,
            url: assetUrl,
            opts: assetOpts,
        };
        return this;
    }

    build()
    {
        const basePath = getBasePath();
        let assetMap = {};
        for(let asset of Object.keys(this.assets))
        {
            const {
                type,
                url,
                opts: assetOpts,
            } = asset;
            let loader = this.loaders[type];
            let opts = {
                ...loader.opts,
                ...assetOpts,
            };
            if (!(type in assetMap))
            {
                assetMap[type] = {};
            }
            assetMap[type][url] = loader.load.bind(undefined, basePath + url, opts);
        }
        return new AssetManifest(assetMap);
    }
}
