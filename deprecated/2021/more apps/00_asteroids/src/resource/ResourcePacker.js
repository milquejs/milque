import { zip } from 'fflate';
import { readFile, writeFile } from 'fs/promises';

export async function exportResources(name, files = [])
{
    let resourceFileBuffer = await packResourcesFromUrls(files);
    await writeFile(name, resourceFileBuffer);
}

export async function packResourcesFromMap(resourceMap)
{
    return new Promise((resolve, reject) => {
        zip(/** @type {import('fflate').AsyncZippable} */ (resourceMap),
            (err, data) => {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    resolve(data);
                }
            });
    });
}

export async function packResourcesFromUrls(urls)
{
    let resourceMap = await createResourceMapFromUrls(urls);
    return await packResourcesFromMap(resourceMap);
}

export async function createResourceMapFromUrls(urls)
{
    let data = {};
    await Promise.all(urls.map(url =>
        readFile(url).then(buffer => data[url] = buffer)));
    return data;
}
