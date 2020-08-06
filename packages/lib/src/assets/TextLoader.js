export async function loadText(filepath, opts)
{
    let result = await fetch(filepath);
    return result.text();
}
