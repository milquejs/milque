const chalk = require('chalk');

function destination(destination)
{
    if (destination.location)
    {
        return location(destination.location);
    }
    else if (destination.system)
    {
        return system(destination.system);
    }
    else
    {
        return '---';
    }
}

function system(system)
{
    if (!system) return '???';
    return chalk.yellow(system.name + ' System');
}

function location(location)
{
    if (!location) return '???';
    return chalk.green(location.name);
}

function fuel(amount, max = amount, change = 0)
{
    if (amount <= 0)
    {
        let message = chalk.red('** NO FUEL **');
        return `[${message}]`;
    }
    else if (change < 0)
    {
        return `[${chalk.magenta('|'.repeat(amount + change))}${chalk.gray('|'.repeat(-change))}${chalk.gray('*'.repeat(max - amount))}]`;
    }
    else
    {
        return `[${chalk.magenta('|'.repeat(amount))}${chalk.magenta('*'.repeat(change))}${chalk.gray('*'.repeat(max - amount - change))}]`;
    }
}

function danger(message)
{
    return chalk.red(message);
}

module.exports = {
    destination,
    system,
    location,
    fuel,
    danger,
};