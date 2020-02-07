const { say, ask, pause } = require('../output/index.js');
const { SimpleCommand } = require('./SimpleCommand.js');
const MenuHelper = require('./MenuHelper.js');

const commandPowerOn = new SimpleCommand(
    '[SYSTEM] Power on.',
    async world => {
        await say.newline();
        await say('[SYSTEM] Powering up systems...');
        await say('[SYSTEM] Performing system diagnostics...');

        world.commandCenter.powered = true;
        await say.newline();
        await pause();
    }
).setName('power-on');

const commandPowerOff = new SimpleCommand(
    '[SYSTEM] Power off.',
    async world => {
        await say.newline();
        await say('[SYSTEM] Powering down systems...');

        world.commandCenter.powered = false;
        await say.newline();
        await pause();

        process.exit(0);
    }
).setName('power-off');

module.exports = async function run(world)
{
    MenuHelper.begin(run, arguments);

    let commandCenter = world.commandCenter;

    if (!world.state.firstCommand)
    {
        await say.info(
            'You are on a derelict ship. Sitting in the cockpit, '
            + 'you see an empty control panel before you. '
            + 'Perhaps it still works?'
        );
        await say.newline();

        while (!await ask.confirm('Do you turn it on?'))
        {
            await say.newline();
            await say.info(
                'You decide against it. Maybe there is something else more relevant...'
            );
            
            await say.newline();
            await pause();

            await say.info(
                'You look around, but you cannot really make out anything in the dark. '
                + 'After a long uneventful search, you return to the blank control panel. '
                + 'Might as well try everything.'
            );
            await say.newline();
        }

        await commandPowerOn.execute(world);

        world.state.firstCommand = true;
    }

    let commandOptions = [];

    if (commandCenter.powered)
    {
        await say('Welcome back, captain.');
        await say.newline();

        for(let system of commandCenter.getSystemModules())
        {
            await system.onBanner(world);
        } 

        commandOptions.push(...getCommandOptions(world, commandCenter));
        let option = getCommandOption(world, commandPowerOff);
        if (option) commandOptions.push(option);
    }
    else
    {
        await say('...');
        await say.newline();
    
        let option = getCommandOption(world, commandPowerOn);
        if (option) commandOptions.push(option);
    }

    let selectedCommand = await ask.choose('Command Center', commandOptions);
    if (selectedCommand)
    {
        await selectedCommand.execute(world);
    }

    MenuHelper.end(run, arguments);
}

function getCommandOptions(world, commandCenter)
{
    let result = [];
    for(let command of commandCenter.getCommands())
    {
        let option = getCommandOption(world, command);
        if (option)
        {
            result.push(option);
        }
    }
    result.reverse();
    return result;
}

function getCommandOption(world, command)
{
    let disabled = !command.validate(world);
    if (disabled && !command.isAlwaysVisible()) return null;
    return {
        message: command.getDisplayMessage(world),
        value: command,
        disabled,
    };
}
