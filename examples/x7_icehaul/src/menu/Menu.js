const { GameSequence } = require('../game/index.js');

function Menu(run)
{
    const self = async function() {
        // Clear screen
        console.clear();
        // Do menu stuff...
        await run.apply(undefined, arguments);
        // Loop
        if (!GameSequence.getNextScene()) GameSequence.setNextScene(self, ...arguments);
    };
    return self;
};

module.exports = { Menu };
