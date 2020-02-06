export function getMinifiedFileName(filename)
{
    let i = filename.lastIndexOf('.');
    if (i < 0) return filename + '_min';
    else return filename.substring(0, i) + '.min' + filename.substring(i);
}
