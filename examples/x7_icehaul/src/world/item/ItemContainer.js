class ItemContainer
{
    constructor(itemManager, capacity = Infinity)
    {
        this.itemManager = itemManager;
        this.capacity = capacity;
        this.stacks = [];
    }

    addItemStack(itemStack)
    {
        this.stacks.push(itemStack);
    }

    removeItemStack(itemStack)
    {
        let i = this.stacks.indexOf(itemStack);
        if (i >= 0)
        {
            this.stacks.splice(i, 1);
            return itemStack;
        }
        return null;
    }

    getItemStacks()
    {
        return this.stacks;
    }
}

module.exports = { ItemContainer };
