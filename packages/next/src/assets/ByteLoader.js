export async function loadBytes(filepath, opts)
{
    let result = await fetch(filepath);
    let buffer = await result.arrayBuffer();
    return buffer;
}
