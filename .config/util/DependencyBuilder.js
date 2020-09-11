const { exec } = require('child_process');

const { topoSort } = require('../../packages/util/dist/index.js');

async function getWorkspacesInfo()
{
    return new Promise((resolve, reject) => {
        exec('npx yarn workspaces info', (error, stdout, stderr) => {
            if (error)
            {
                reject(error);
            }
            else
            {
                let i = stdout.indexOf('{');
                let j = stdout.lastIndexOf('}');
                let result = JSON.parse(stdout.substring(i, j + 1));
                resolve(result);
            }
        });
    });
}

async function buildWorkspace(workspaceName)
{
    return new Promise((resolve, reject) => {
        console.log(`Building '${workspaceName}'...`);
        exec(`yarn workspace ${workspaceName} run build`, (error, stdout, stderr) => {
            if (error)
            {
                console.error('...Error!');
                reject(error);
            }
            else
            {
                console.log('...Done');
                resolve();
            }
        });
    });
}

async function build(apps = undefined)
{
    let workspacesInfo = await getWorkspacesInfo();
    let workspaces = Object.keys(workspacesInfo);

    if (Array.isArray(apps) && apps.length > 0)
    {
        workspaces = workspaces.filter(workspaceName => {
            if (workspaceName === 'milque' || workspaceName.startsWith('@milque')) return true;
            if (apps.includes(workspaceName)) return true;
            return false;
        });
    }
    else
    {
        apps = workspaces.filter(workspaceName => {
            if (workspaceName === 'milque' || workspaceName.startsWith('@milque')) return false;
            return true;
        });
    }

    let result = topoSort(workspaces, (workspaceName) => {
        return workspacesInfo[workspaceName].workspaceDependencies;
    });

    console.log('Targeted apps:');
    console.log(apps);
    console.log('Computed depedencies:');
    console.log(result);
    
    await result.reduce((promise, workspaceName) => {
        return promise.then(() => buildWorkspace(workspaceName));
    }, Promise.resolve());
}

module.exports = {
    getWorkspacesInfo,
    buildWorkspace,
    build,
};
