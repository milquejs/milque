async function main()
{
    let assetLoader = AssetLoaderBuilder.from('res')
        .register(['*.frag', '*.vert'], TextLoader)
        .register('*.txt', TextLoader)
        .register(file => {}, TextLoader)
        .register('image', ImageLoader)
        .register('text', TextLoader, '*.txt|*.frag')
        .build();
    
    assetLoader('main.frag', { type: 'image', alias: 'mainFragment' });
    
    let assets = await AssetBuilder.from(assetLoader)
        .add('mainProgramFragmentSource', 'text:main.frag')
        .add('mainProgramVertexSource', 'text:main.vert')
        .add('stone', 'image:stone.png')
        .load();
    
    assets.getAsset('main.frag');
}

class AssetLoaderBuilder
{
    static from(baseUrl)
    {
        return new AssetLoaderBuilder(baseUrl);
    }

    constructor(baseUrl)
    {
        this.baseUrl = baseUrl;
        this.loaders = [];
    }

    register(urlPattern, loader)
    {
        if (urlPattern instanceof RegExp) urlPattern = urlPattern.test.bind(urlPattern);
        if (!(typeof urlPattern === 'function')) throw new Error('Invalid url pattern.');
        this.loaders.push({
            test: urlPattern,
            load: loader,
        });
        return this;
    }

    build()
    {
        const baseUrl = this.baseUrl;
        const loaders = this.loaders;
        return async function AssetLoader(url, opts = undefined)
        {
            let error;
            let assetUrl = `${baseUrl}/${url}`;
            for(let loader of loaders)
            {
                try
                {
                    if (loader.test(assetUrl))
                    {
                        let result = await loader.load(assetUrl, opts);
                        if (typeof result !== 'undefined')
                        {
                            return result;
                        }
                    }
                }
                catch(e)
                {
                    error = e;
                }
            }
            if (error)
            {
                throw error;
            }
            else
            {
                throw new Error('Unable to load asset.');
            }
        };
    }
}

class AssetBuilder
{
    static from(assetLoaders)
    {
        return new AssetBuilder(assetLoaders);
    }

    constructor(baseUrl)
    {
        this.baseUrl = baseUrl;
        this.loaders = {};
    }

    add()
    {
    }

    async load()
    {
        
    }
}
