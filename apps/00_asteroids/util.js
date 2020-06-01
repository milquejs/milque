
export function wrapAround(position, width, height, viewWidth, viewHeight)
{
    if (position.x < -width) position.x = viewWidth;
    if (position.y < -height) position.y = viewHeight;
    if (position.x > viewWidth + width / 2) position.x = -width;
    if (position.y > viewHeight + height / 2) position.y = -height;
}
