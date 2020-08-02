export async function getImage(key)
{
    let item = localStorage.getItem(key);
    return new Promise(resolve => {
        let image = new Image();
        image.onload = () => resolve(image);
        if (item)
        {
            image.src = item;
        }
        else
        {
            image.src = '../../res/dungeon/dungeon.png';
        }
    });
}
