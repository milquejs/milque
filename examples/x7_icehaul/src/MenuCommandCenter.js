const { say, ask, pause, branch, timeout } = require('./output/index.js');
const { GameSequence } = require('./game/index.js');

module.exports = async function run(world)
{
    console.clear();

    if (!world.state.commands)
    {
        await say.info('You are on a derelict ship. Sitting in the cockpit, you see an empty control panel before you. Perhaps it still works?');
        await say.newline();

        world.state.commands = {
            powered: false,
            list: [],
            get options()
            {
                let dst = {};
                for(let option of this.list)
                {
                    dst[option.message] = option.callback;
                }
                return dst;
            }
        };

        world.state.commands.list.push({
            _world: world,
            _on: commandCenterPowerOn.bind(undefined, world),
            _off: commandCenterPowerOff.bind(undefined, world),
            get message()
            {
                return this._world.state.commands.powered ? '[SYSTEM] Power off.' : '[SYSTEM] Power on.';
            },
            get callback()
            {
                return this._world.state.commands.powered ? this._off : this._on;
            },
        });
    }
    else
    {
        if (world.state.commands.powered)
        {
            await say('Welcome back, captain.');
        }
        else
        {
            await say('...');
        }
        await say.newline();
    }
    
    await branch('Command Center', world.state.commands.options);

    if (!GameSequence.getNextScene()) GameSequence.setNextScene(run, world);
}

async function commandCenterPowerOn(world)
{
    await say.newline();
    await say('[SYSTEM] Powering up systems...');
    await say('[SYSTEM] Performing system diagnostics...');

    world.state.commands.powered = true;
    await pause();
}

async function commandCenterPowerOff(world)
{
    await say.newline();
    await say('[SYSTEM] Powering down systems...');

    world.state.commands.powered = false;
    await pause();
}
