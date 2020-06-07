export async function loadJSON(filepath, opts = {})
{
    let result = await fetch(filepath);
    let json = await result.json();
    return json;
}
