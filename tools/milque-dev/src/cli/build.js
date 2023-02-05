import fs from 'fs/promises';
import path from 'path';
import { rollupBuild, rollupConfig, rollupWatch } from '../rollup';
import { packageNameToKebab, clearDir } from '../util';

export default async function main(watch = false) {
    // Clean `dist`
    try {
        await clearDir('./dist');
    } catch (e) {
        console.error('Failed cleaning dist.');
        throw e;
    }

    // Process args...
    const args = process.argv.slice(2);
    const cwd = process.cwd();

    // Process package.json...
    let packageJson;
    try {
        let filePath = path.resolve(cwd, 'package.json');
        let fileData = await fs.readFile(filePath, 'utf-8');
        packageJson = JSON.parse(fileData);
    } catch (e) {
        throw new Error(`Cannot read package.json '${filePath}'.`);
    }
    const packageName = packageJson.name;
    if (!packageName) {
        throw new Error(`Invalid "name" in package.json - must be defined.`);
    }
    const outputName = packageNameToKebab(packageName);

    let expectedPackageMain = `dist/${outputName}.cjs.js`;
    let expectedPackageModule = `dist/${outputName}.esm.js`;
    let expectedPackageTypes = `dist/index.d.ts`;
    if (packageJson.main !== expectedPackageMain) {
        throw new Error(`Invalid "main" in package.json - expected '${expectedPackageMain}'.`);
    }
    if (packageJson.module !== expectedPackageModule) {
        throw new Error(`Invalid "module" in package.json - expected '${expectedPackageModule}'.`);
    }
    if (packageJson.types !== expectedPackageTypes) {
        throw new Error(`Invalid "types" in package.json - expected '${expectedPackageTypes}'.`);
    }

    // Create config...
    let config = rollupConfig({
        packageName,
        outputName,
        input: 'src/index.js',
        dependencies: packageJson.dependencies,
        peerDependencies: packageJson.peerDependencies,
        umdGlobals: packageJson.globals,
    });

    // Watch!
    if (watch) {
        rollupWatch(config);
        return;
    }

    // or Build!
    await rollupBuild(config);
}
