const { say, ask, branch } = require('./output/index.js');

module.exports = async function run(world)
{
    let buys = {
        '[BUY] Fuel : $10': () => console.log('FIELD')
    };
    let sells = {
        '[SELL] Fuel : $5': () => console.log('FIELD')
    };

    let opts = {
        ...buys,
        ...sells,
    };
    await branch('What are you looking for?', opts);
}

class ItemContainer
{
    constructor(capacity = Infinity)
    {
        this.items = [];
        this.capacity = capacity;
    }

    createItem(name, attributes = {})
    {
        let result = new Item(name, attributes).setContainer(this);
        this.items.push(result);
        return result;
    }

    destroyItem(item)
    {
        this.items.splice(this.items.indexOf(item), 1);
    }

    moveItem(item, otherContainer)
    {
        this.items.splice(this.items.indexOf(item), 1);
        item.setContainer(otherContainer);
        otherContainer.items.push(item);
    }
}

class Item
{
    constructor(name, attributes = {})
    {
        this.name = name;
        this.container = null;
        this.attributes = attributes;
    }

    setContainer(container)
    {
        this.container = container;
        return this;
    }
}
