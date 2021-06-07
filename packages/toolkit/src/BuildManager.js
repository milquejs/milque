import { start } from './start.js';
import { build } from './build.js';
import { FileManager } from './FileManager.js';
import { loadPackageJson } from './PackageJsonLoader.js';

export class BuildManager extends FileManager
{
    /**
     * @param {string} outputDir 
     * @param {boolean} watch 
     */
    constructor(outputDir, watch)
    {
        super(outputDir, watch);

        this.packageJsonObject = undefined;
        this.esbuildConfigs = [];
    }

    async packageJson(json)
    {
        if (typeof json === 'object')
        {
            this.packageJsonObject = {
                ...(this.packageJsonObject || {}),
                ...json,
            };
        }
        else if (typeof json === 'string')
        {
            this.packageJsonObject = await loadPackageJson(json);
        }
        else
        {
            this.packageJsonObject = await loadPackageJson();
        }
    }

    async esbuildConfig(...configs)
    {
        this.esbuildConfigs.push(...configs);
    }

    async build(entryPoints)
    {
        if (this.watching)
        {
            await start({
                entryPoints,
                packageJson: this.packageJsonObject,
                serveDir: this.outputDir,
                bundleDir: '',
                esbuildOpts: this.esbuildConfigs,
            });
        }
        else
        {
            await build({
                entryPoints,
                packageJson: this.packageJsonObject,
                outputDir: this.outputDir,
                esbuildOpts: this.esbuildConfigs,
            });
        }
    }
}
