export async function TextLoader(url, opts = undefined)
{
    let blob = await fetch(url);
    return blob.text();
}
