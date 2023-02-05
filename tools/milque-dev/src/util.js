import fs from 'fs/promises';
import path from 'path';

/**
 * @param {string} name
 */
export function packageNameToKebab(name) {
    return name.replace(/[@!]/g, '').replace(/\//g, '-');
}

/**
 * @param {string} name
 */
export function kebabToPascal(name) {
    return name.split('-').map(s => `${s[0].toUpperCase()}${s.slice(1)}`).join('');
}

/**
 * @param {string} name
 */
export function packageNameToPascal(name) {
    return kebabToPascal(packageNameToKebab(name));
}

/**
 * @param {string} dir
 */
export async function clearDir(dir) {
    let items;
    try {
        items = await fs.readdir(dir);
    } catch (e) {
        await fs.mkdir(dir, { recursive: true });
        return;
    }
    return Promise.all(items.map(i => fs.rm(path.join(dir, i), { recursive: true, force: true })));
}

/**
 * @param {string} name
 */
export async function findUp(name) {
    let dir = path.resolve('');
    const { root } = path.parse(dir);
    const stopPath = path.resolve(dir, root);
    let matcher = async (cwd) => {
        let p = path.resolve(cwd, name);
        try {
            let s = await fs.stat(p);
            if (s.isFile()) {
                return p;
            }
        } catch {
            return null;
        }
        return null;
    };
    
    while(true) {
        let found = await matcher(dir);
        if (found) {
            return path.resolve(dir, found);
        }

        if (dir === stopPath) {
            break;
        }
        
        dir = path.dirname(dir);
    }

    return null;
}
