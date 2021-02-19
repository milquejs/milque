export async function ImageLoader(url, opts = undefined)
{
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.addEventListener('load', () => {
            resolve(img);
        });
        img.addEventListener('error', ev => {
            reject(ev);
        });
        img.src = url;
    });
}
