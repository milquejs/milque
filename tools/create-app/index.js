const fs = require('fs/promises');
const path = require('path');

const RUSH_JSON_PATH = path.join(__dirname, '../../rush.json');
const BEGIN_PROJECTS_TAG = '/* BEGIN_PROJECTS */';
const END_PROJECTS_TAG = '/* END_PROJECTS */';

main(process.argv.slice(2)).then(() => {
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});

async function main(args)
{
    let appName = args[0];
    if (!appName || appName.length < 3)
    {
        throw new Error('App name must be at least 3 characters long.');
    }
    let projectName = `x0_${appName}`;
    let projectFolder = path.join('../../apps', projectName);
    let projectDir = path.join(__dirname, projectFolder);
    await addProjectToRushJson(RUSH_JSON_PATH, {
        packageName: appName,
        projectFolder: projectFolder,
    });
    await fs.mkdir(projectDir, { recursive: true });
    await fs.mkdir(path.join(projectDir, 'src'), { recursive: true });
    await fs.mkdir(path.join(projectDir, 'res'), { recursive: true });
    await fs.mkdir(path.join(projectDir, 'public'), { recursive: true });
    await copyExampleFile(projectDir, '.eslintignore');
    await copyExampleFile(projectDir, '.eslintrc.cjs');
    await copyExampleFile(projectDir, '.gitignore');
    await copyExampleFile(projectDir, '.stylelintrc.cjs');
    await copyExampleFile(projectDir, 'jsconfig.json');

    let packageJsonPath = path.join(projectDir, 'package.json');
    try
    {
        await fs.stat(packageJsonPath);
        // Already exists. Skip it!
    }
    catch(e)
    {
        // Doesn't exist. Create it!
        await fs.writeFile(packageJsonPath, `{"name": "${appName}"}`);
    }
}

async function copyExampleFile(projectDir, filePath)
{
    await fs.copyFile(path.join(projectDir, '..', '00_asteroids', filePath), path.join(projectDir, filePath));
}

/**
 * @typedef RushProjectOption
 * @property {string} packageName
 * @property {string} projectFolder
 * 
 * @param {string} rushJsonPath 
 * @param  {...RushProjectOption} projectOptions 
 */
async function addProjectToRushJson(rushJsonPath, ...projectOptions)
{
    let content = await fs.readFile(rushJsonPath, { encoding: 'utf8' });
    let start = content.indexOf(BEGIN_PROJECTS_TAG);
    let end = content.indexOf(END_PROJECTS_TAG, start);
    if (start < 0 || end < 0)
    {
        throw new Error('Missing begin or end tags for project list.');
    }
    let projectList = JSON.parse(content.substring(start + BEGIN_PROJECTS_TAG.length, end) + ']');
    if (!Array.isArray(projectList))
    {
        throw new Error('Project list should be an array.');
    }
    projectList.push(...projectOptions);
    projectList.sort((a, b) => String(a.projectFolder).localeCompare(b.projectFolder));
    let packageNames = new Set();
    for(let i = 0; i < projectList.length; ++i)
    {
        let packageOption = projectList[i];
        if (packageNames.has(packageOption.packageName))
        {
            projectList.splice(i, 1);
            --i;
        }
        packageNames.add(packageOption.packageName);
    }
    let json = JSON.stringify(projectList, undefined, 4);
    let result = content.substring(0, start)
        + BEGIN_PROJECTS_TAG
        + json.substring(0, json.length - 2)
        + content.substring(end);
    await fs.writeFile(rushJsonPath, result);
}