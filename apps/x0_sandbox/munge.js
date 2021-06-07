import { munge } from '@milque/toolkit';

async function main(args)
{
    try
    {
        await munge('res.pack', undefined, args.includes('--reset'));
    }
    catch(e)
    {
        console.error(e);
        process.exit(1);
    }
}

main(process.argv);
