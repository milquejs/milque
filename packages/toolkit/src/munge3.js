import fs from 'fs/promises';
import path from 'path';
import { exists } from './FileUtil.js';
import { createZip, createUnzip, getZipManifest } from './Zipper.js';

export async function munge(inFile, outDir, opts = {})
{
    const packFile = path.basename(inFile);
    const packExt = path.extname(inFile);
    const packName = packFile.substring(0, packFile.length - packExt.length);
    const packDir = outDir;
    const packZip = inFile;
    const packRC = `${packName}.packrc`;
    const date = new Date();
    const backupDir = 'tmp';
    const backupName = `${
        date.getFullYear()}-${
            String(date.getMonth()).padStart(2, '0')}-${
                String(date.getDate()).padStart(2, '0')}-${
                    String(date.getHours()).padStart(2, '0')}-${
                        String(date.getMinutes()).padStart(2, '0')}-${
                            String(date.getSeconds()).padStart(2, '0')}`;
    const backupZip = path.join(backupDir, `${backupName}.${packName}.pack.backup`);

    const hasZip = await exists(packZip);
    const hasDir = await exists(packDir);
    
    let manifest = null;

    // Copy the backup if nothing exists
    if (!hasZip)
    {
        console.log('Creating packfile...');
        await fs.mkdir(packDir, { recursive: true });
        manifest = await createZip(packZip, packDir);
    }
    // If zip exists, but no source files. Extract!
    else if (!hasDir)
    {
        console.log('Extracting packfile...');
        manifest = await createUnzip(packZip, '.');
    }
    // If zip and source exists. Diff!
    else
    {
        console.log('Diffing packfile...');
        const tempDir = backupDir;
        const tempZip = path.join(backupDir, 'tmp.pack');
        await fs.mkdir(tempDir, { recursive: true });
        await createZip(tempZip, packDir);
        let zipManifest = await getZipManifest(packZip);
        let srcManifest = await getZipManifest(tempZip);

        // If different, overwrite zip with source
        if (zipManifest.checksum !== srcManifest.checksum)
        {
            console.log('Updating packfile...');
            // Always make backup first
            await fs.mkdir(backupDir, { recursive: true });
            await fs.copyFile(packZip, backupZip);
            // Then continue...
            await fs.copyFile(tempZip, packZip);
            manifest = srcManifest;
        }
        else
        {
            await fs.rm(tempZip);
            manifest = zipManifest;
        }
    }
    
    // Write to .packrc
    let packConfig = {
        version: '1.0.0',
        manifest,
    };
    if (await exists(packRC))
    {
        let config;
        try
        {
            config = JSON.parse(await fs.readFile(packRC));
        }
        catch(e)
        {
            config = {};
        }
        packConfig = {
            ...config,
            ...packConfig,
        };
    }
    await fs.writeFile(packRC, JSON.stringify(packConfig, undefined, 4));
}
