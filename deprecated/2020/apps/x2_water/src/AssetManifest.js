export class AssetManifest
{
    constructor(assetMap = {})
    {
        this.mapping = {};
        this.options = assetMap;
        this.loaders = {};
        this.progress = {
            value: 0,
            max: Object.keys(assetMap).length,
            min: 0,
        };
    }

    register(assetType, assetLoader)
    {
        if (assetType in this.loaders)
        {
            this.loaders[assetType].push(assetLoader);
        }
        else
        {
            this.loaders[assetType] = [assetLoader];
        }
        return this;
    }

    put(assetName, assetSource, assetType, opts = {})
    {
        if (!(assetName in this.options)) this.progress.max += 1;
        this.options[assetName] = {
            ...opts,
            src: assetSource,
            type: assetType,
        };
        return this;
    }

    get(assetName)
    {
        return this.mapping[assetName];
    }

    async load()
    {
        let progress = this.progress;
        let promises = [];
        for(let key of Object.keys(this.options))
        {
            if (key in this.mapping) continue;

            let assetOption = this.options[key];
            let { src, type } = assetOption;
            let loader = this.loaders[type];
            let result = loader(src, assetOption);
            promises.push(result.then(value => {
                this.mapping[key] = value;
                progress.value += 1;
            }));
        }
        await Promise.all(promises);
        if (progress.value !== progress.max)
        {
            throw new Error('Invalid progress - mismatched loaded asset count.');
        }
        return promises;
    }
}
