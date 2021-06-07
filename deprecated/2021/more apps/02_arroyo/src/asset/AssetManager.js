/* global process */

export class AssetManager
{
    constructor()
    {
        this.assetPath = process.env.NODE_ENV === 'development' ? '' : '../../../res/';

        this.loaders = {};
        this.assets = {};

        this.loadingQueue = [];
    }

    registerLoader(loaderName, loader)
    {
        this.loaders[loaderName] = loader;
        return this;
    }

    registerAsset(loader, name, url, opts = null)
    {
        if (!(loader in this.assets))
        {
            this.assets[loader] = {};
        }

        let assetMap = this.assets[loader];
        let asset = {
            value: null,
            url,
            opts,
        };
        assetMap[name] = asset;
        this.loadingQueue.push(asset);

        return this;
    }

    async loadAssets()
    {
        let cache = {};
        let errors = [];
        for(let loaderName of Object.keys(this.assets))
        {
            let assetMap = this.assets[loaderName];
            if (loaderName in this.loaders)
            {
                let loader = this.loaders[loaderName];
                for(let assetName of Object.keys(assetMap))
                {
                    const { url, opts } = assetMap[assetName];

                    let assetValue;
                    const cacheKey = url + '?opts=' + JSON.stringify(opts);
                    if (cacheKey in cache)
                    {
                        assetValue = cache[cacheKey];
                    }
                    else
                    {
                        try
                        {
                            assetValue = await loader.call(undefined, this.assetPath + url, opts || {});
                            cache[cacheKey] = assetValue;
                        }
                        catch(e)
                        {
                            errors.push(e);
                            continue;
                        }
                    }

                    let asset = assetMap[assetName];
                    asset.value = assetValue;
                }
            }
            else
            {
                throw new Error(`Missing loader for '${loaderName}'.`);
            }
        }
        
        if (errors.length > 0)
        {
            throw new Error('Failed to load assets: ' + errors);
        }
    }

    getAsset(loader, name)
    {
        return this.assets[loader][name].value;
    }
}
