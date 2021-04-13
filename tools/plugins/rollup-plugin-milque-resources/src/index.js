import path from 'path';
import { readFile, writeFile, mkdir } from 'fs/promises';

import { sync } from 'globby';
import { zipSync } from 'fflate';

export default function milqueResources(opts = {})
{
    const {
        input = 'res/*',
        output = 'index.res',
    } = opts;

    const targets = Array.isArray(input) ? input : [input];

    return {
        name: 'milque-resources',
        async buildEnd()
        {
            let filepaths = [];
            for(let target of targets)
            {
                const matchingPaths = sync(target);

                if (matchingPaths.length > 0)
                {
                    filepaths.push(...matchingPaths);
                }
            }

            let fileexts = {};
            filepaths.sort((a, b) => {
                let aext = a in fileexts ? fileexts[a] : (fileexts[a] = path.extname(a).toLocaleLowerCase());
                let bext = b in fileexts ? fileexts[b] : (fileexts[b] = path.extname(b).toLocaleLowerCase());
                return aext.localeCompare(bext) || a.localeCompare(b);
            });

            let zippable = {};
            await Promise.all(filepaths.map(async filepath =>
                zippable[filepath] = await readFile(filepath)));

            let zipbuf = zipSync(zippable, { mtime: 0 });
            await mkdir(path.dirname(output));
            await writeFile(output, zipbuf);
        }
    };
}
