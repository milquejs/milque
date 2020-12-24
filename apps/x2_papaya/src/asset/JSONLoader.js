export async function JSONLoader(url, opts = undefined)
{
    let blob = await fetch(url);
    return blob.json();
}
