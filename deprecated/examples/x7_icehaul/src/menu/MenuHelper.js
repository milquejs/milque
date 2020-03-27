const { GameSequence } = require('../game/index.js');

function begin(self, args)
{
    // Clear screen
    console.clear();
}

function end(self, args)
{
    // Loop
    if (!GameSequence.getNextScene()) GameSequence.setNextScene(self, ...args);
}

module.exports = {
    begin,
    end,
};
