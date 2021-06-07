/* global process */
import { exec } from 'child_process';

export function execWithStdio(command)
{
    let proc = exec(command);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);
    return proc;
}