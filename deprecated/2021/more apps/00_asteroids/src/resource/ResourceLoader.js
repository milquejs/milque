import { unzip } from 'fflate';

export async function fetchResources(resourceFileUrl)
{
    let response = await fetch(resourceFileUrl);
    let buffer = await response.arrayBuffer();
    return await loadResources(buffer);
}

async function loadResources(resourceFileBuffer)
{
    return new Promise((resolve, reject) => {
        unzip(resourceFileBuffer, (err, unzipped) => {
            if (err)
            {
                reject(err);
            }
            else
            {
                resolve(unzipped);
            }
        });
    });
}
