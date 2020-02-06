function choose(list)
{
    with(this)
    {
        return list[Math.floor(next() * list.length)];
    }
}

function range(min, max)
{
    with(this)
    {
        return ((max - min) * next()) + min;
    }
}

function next()
{
    return Math.random();
}

module.exports = {
    choose,
    range,
    next
};
