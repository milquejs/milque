#!/usr/bin/env node
import path from 'path';
import { build, loadPackageJson } from '../dist/esm/index.js';

const packageJsonPath = path.resolve(__dirname, process.argv[2]);
const packageJson = loadPackageJson();
const entryPoints = [ 'src/index.js' ];

buildTools.clear('dist')
    .then(() => buildTools.build({
        packageJson, entryPoints
    }))
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
