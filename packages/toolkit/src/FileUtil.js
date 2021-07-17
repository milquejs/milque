import fs from 'fs/promises';
import path from 'path';

export async function exists(filePath)
{
    try
    {
        await fs.stat(filePath);
    }
    catch(e)
    {
        return false;
    }
    return true;
}

export async function verifyFile(filePath)
{
    let stats;
    try
    {
        stats = await fs.stat(filePath);
    }
    catch(e)
    {
        return false;
    }
    return stats.isFile();
}

export async function verifyDirectory(dirPath)
{
    let stats;
    try
    {
        stats = await fs.stat(dirPath);
    }
    catch(e)
    {
        return false;
    }
    return stats.isDirectory();
}

export async function copyFile(inputPath, outputPath)
{
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.copyFile(inputPath, outputPath);
}

export async function deleteFile(filePath)
{
    await fs.rm(filePath);
}

export async function deleteFiles(filePath)
{
    await fs.rm(filePath, { recursive: true, force: true });
}

export function crc32c(crc, bytes)
{
    var POLY = 0x82f63b78;
    crc ^= 0xffffffff;
    for (let n = 0; n < bytes.length; n++)
    {
        crc ^= bytes[n];
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
        crc = crc & 1 ? (crc >>> 1) ^ POLY : crc >>> 1;
    }
    return crc ^ 0xffffffff;
}
