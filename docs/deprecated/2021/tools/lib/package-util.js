import { capitalize } from './string-util.js';
import { exec } from 'child_process';
import path from 'path';
import fsPromises from 'fs/promises';

/**
 * Get the module name for the package.
 * 
 * @example
 * // returns 'App'
 * getModuleName({
 *   // package.json
 *   name: 'your/awesome/app',
 * });
 * 
 * @param {object} packageJson The `package.json` object.
 * @param {string} packageJson.name The name of the package.
 * @returns {string} The module name.
 */
export function getModuleName(packageJson)
{
    const { name } = packageJson;
    return capitalize(name.split('/').pop());
}

/**
 * @typedef LernaPackage
 * @property {string} name The package name.
 * @property {string} version The package semantic version.
 * @property {boolean} private Whether the package is private.
 * @property {string} location The absolute path of the package.
 */

/**
 * Gets a list of lerna packages.
 * 
 * @param {string} scopeGlob Include only packages with names matching the given glob.
 * @param {string} ignoreGlob Exclude packages with names matching the given glob.
 * @returns {Array<LernaPackage>} A list of changed and sorted packages.
 */
export async function listPackages(scopeGlob = undefined, ignoreGlob = undefined, sinceHead = false)
{
    const command = 'npx lerna list --json --toposort --all'
        + (sinceHead ? '--since HEAD' : '')
        + (scopeGlob ? `--scope '${scopeGlob}'` : '')
        + (ignoreGlob ? `--ignore '${ignoreGlob}'` : '');
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error)
            {
                console.error(stderr);
                reject(error);
            }
            else
            {
                let i = stdout.indexOf('[');
                let j = stdout.indexOf(']');
                let result = JSON.parse(stdout.substring(i, j + 1));
                resolve(result);
            }
        });
    });
}

/**
 * Gets the `package.json` for the package at the location.
 * 
 * @param {string} packageLocation The absolute path to the package.
 * @returns {object} The package json.
 */
export async function getPackageJson(packageLocation)
{
    let packageJsonPath = path.join(packageLocation, 'package.json');
    let result = JSON.parse(await fsPromises.readFile(packageJsonPath));
    result.location = packageLocation;
    return result;
}

/**
 * Gets all `package.json` in sorted dependency order.
 * 
 * @param {string} scope Include only packages with names matching the given glob.
 * @param {string} ignore Exclude packages with names matching the given glob.
 * @returns {Array<object>} List of package jsons.
 */
export async function getPackageJsons(scope = undefined, ignore = undefined)
{
    const packageList = await listPackages(scope, ignore);
    return Promise.all(packageList.map(pkg => getPackageJson(pkg.location)));
}
