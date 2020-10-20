// Bresenham's Line Algorithm
function line(fromX, fromY, toX, toY, callback)
{
    let fx = Math.floor(fromX);
    let fy = Math.floor(fromY);
    let tx = Math.floor(toX);
    let ty = Math.floor(toY);

    let dx = Math.abs(toX - fromX);
    let sx = fromX < toX ? 1 : -1;
    let dy = -Math.abs(toY - fromY);
    let sy = fromY < toY ? 1 : -1;
    let er = dx + dy;

    let x = fx;
    let y = fy;
    let flag = callback(x, y);
    if (typeof flag !== 'undefined') return flag;
    
    let maxLength = dx * dx + dy * dy;
    let length = 0;
    while(length < maxLength && (x !== tx || y !== ty))
    {
        // Make sure it doesn't go overboard.
        ++length;

        let er2 = er * 2;

        if (er2 >= dy)
        {
            er += dy;
            x += sx;
        }

        if (er2 <= dx)
        {
            er += dx;
            y += sy;
        }

        flag = callback(x, y);
        if (typeof flag !== 'undefined') return flag;
    }
}

var Discrete = /*#__PURE__*/Object.freeze({
    __proto__: null,
    line: line
});

export { Discrete as D, line as l };
