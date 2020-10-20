const { build } = require('./util/DependencyBuilder.js');

const apps = process.argv.slice(2);
build(apps);
