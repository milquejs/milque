class Asset
{
    resolve()
    {
        
    }
}

class AssetManifest
{
    static builder()
    {
        return new AssetManifestBuilder();
    }

    constructor(loaderList)
    {
        let assetMap = {};
        let loaderMap = {};
        for(let loader of loaderList)
        {
            let { name } = loader;
            loaderMap[name] = loader;
            assetMap[name] = {};
        }
        /** @private */
        this.loaders = loaderMap;
        /** @private */
        this.assets = assetMap;
    }

    getAsset(loader, name)
    {
        return this.assets[loader][name];
    }

    async load(loader, name)
    {
        
    }

    async loadAll(loader, name)
    {
    }
}

class AssetManifestBuilder
{
    constructor()
    {

    }

    loader()
    {

    }

    asset()
    {

    }

    build()
    {

    }
}
