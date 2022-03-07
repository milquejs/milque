const { choose } = require('../output/ask.js');

let nextScene = null;
let nextArgs = [];

async function start() {
  while (nextScene) {
    let scene = nextScene;
    nextScene = null;
    await scene.apply(undefined, nextArgs);
  }
}

function setNextScene(scene, ...args) {
  nextScene = scene;
  nextArgs = args;
}

function getNextScene() {
  return nextScene;
}

module.exports = {
  start,
  setNextScene,
  getNextScene,
};
