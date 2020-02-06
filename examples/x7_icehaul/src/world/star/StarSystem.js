class StarSystem
{
    constructor(name, x = 0, y = 0, attributes = {})
    {
        this.name = name;
        this.x = x;
        this.y = y;

        this.attributes = attributes;

        this.stars = [];
        this.objects = [];
    }

    addStar(name)
    {
        this.stars.push({ type: 'star', name });
        return this;
    }

    addObject(name)
    {
        this.objects.push({ type: 'object', name });
        return this;
    }

    get locations() { return [ ...this.stars, ...this.objects ]; }
}

module.exports = { StarSystem };
