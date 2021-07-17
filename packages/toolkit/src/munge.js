import path from 'path';
import fs from 'fs/promises';
import { createUnzip, createZip } from './Zipper.js';

export async function munge(inputFile, outputDir = undefined, reset = false)
{
    // Start munge time
    console.time('munge');
    if (typeof outputDir === 'undefined')
    {
        let ext = path.extname(inputFile);
        let name = path.basename(inputFile, ext);
        outputDir = path.join(path.dirname(inputFile), name);
    }
    await fs.mkdir(outputDir, { recursive: true });
    if (reset)
    {
        // Sync asset files from zip
        // TODO: In the future, we should diff this instead of just overwrite
        await createUnzip(path.join('.', inputFile), outputDir);
    }
    else
    {
        // Munge asset files to zip
        await createZip(inputFile, outputDir);
    }
    // End munge time
    console.timeEnd('munge');
}
