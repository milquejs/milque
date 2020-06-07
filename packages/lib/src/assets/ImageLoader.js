export async function loadImage(filepath, opts = {})
{
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.addEventListener('load', () => {
            resolve(img);
        });
        img.addEventListener('error', ev => {
            reject(ev);
        });
        img.src = filepath;
    });
}
