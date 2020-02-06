module.exports = async function run(world, inventory)
{
    console.log('='.repeat(80));
    console.log('Inventory');
    console.log('-'.repeat(80));
    for(let stackId of inventory.getItemStacks())
    {
        let itemStack = world.items.getItemStackById(stackId);
        let item = world.items.getItemById(itemStack.itemId);
        console.log('- ' + item.name + ' x' + itemStack.stackSize);
    }
    console.log('='.repeat(80));
}
