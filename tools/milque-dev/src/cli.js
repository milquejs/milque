import build from './cli/build';
import watch from './cli/watch';
import init from './cli/init';

async function cli() {
    const args = process.argv.slice(2);
    switch(args[0]) {
        case 'build':
            return await build();
        case 'watch':
            return await watch();
        case 'init':
            return await init();
        default:
            throw new Error(`Unknown command '${args[0]}'`);
    }
}

// Execute!
cli().catch(error => {
    console.error(error);
    if (process.argv[2] === 'watch') {
        process.exit(0);
    } else {
        process.exit(1);
    }
});
