export function onBlockPlace(world, blockPos, blockId)
{
    const worldMap = world.map;

    let out = blockPos.clone();
    let neighbor = 0b000;
    if (worldMap.isWithinBounds(blockPos.right(out))
        && worldMap.getBlockId(out) === blockId)
    {
        neighbor |= 0b0001;
        worldMap.setBlockNeighbor(out, worldMap.getBlockNeighbor(out) | 0b0100);
    }
    if (worldMap.isWithinBounds(blockPos.up(out))
        && worldMap.getBlockId(out) === blockId)
    {
        neighbor |= 0b0010;
        worldMap.setBlockNeighbor(out, worldMap.getBlockNeighbor(out) | 0b1000);
    }
    if (worldMap.isWithinBounds(blockPos.left(out))
        && worldMap.getBlockId(out) === blockId)
    {
        neighbor |= 0b0100;
        worldMap.setBlockNeighbor(out, worldMap.getBlockNeighbor(out) | 0b0001);
    }
    if (worldMap.isWithinBounds(blockPos.down(out))
        && worldMap.getBlockId(out) === blockId)
    {
        neighbor |= 0b1000;
        worldMap.setBlockNeighbor(out, worldMap.getBlockNeighbor(out) | 0b0010);
    }
    worldMap.setBlockNeighbor(blockPos, neighbor);
}

export function onBlockBreak(world, blockPos, blockId)
{
    const worldMap = world.map;
    
    let out = blockPos.clone();
    if (worldMap.isWithinBounds(blockPos.right(out))
        && worldMap.getBlockId(out) === blockId)
    {
        worldMap.setBlockNeighbor(out, worldMap.getBlockNeighbor(out) & 0b1011);
    }
    if (worldMap.isWithinBounds(blockPos.up(out))
        && worldMap.getBlockId(out) === blockId)
    {
        worldMap.setBlockNeighbor(out, worldMap.getBlockNeighbor(out) & 0b0111);
    }
    if (worldMap.isWithinBounds(blockPos.left(out))
        && worldMap.getBlockId(out) === blockId)
    {
        worldMap.setBlockNeighbor(out, worldMap.getBlockNeighbor(out) & 0b1110);
    }
    if (worldMap.isWithinBounds(blockPos.down(out))
        && worldMap.getBlockId(out) === blockId)
    {
        worldMap.setBlockNeighbor(out, worldMap.getBlockNeighbor(out) & 0b1101);
    }
    worldMap.setBlockNeighbor(blockPos, 0);
}
