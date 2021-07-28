export function astarSearch(startX, startY, goalX, goalY, isWalkable)
{
    let start = createNode(startX, startY);
    let nodes = {
        [start.id]: start,
    };
    let opened = [];
    let closed = [];
    opened.push(start.id);
    while(opened.length > 0)
    {
        let findex = 0;
        let minId = opened[findex];
        let minNode = nodes[minId];
        for(let i = 1; i < opened.length; ++i)
        {
            let openedId = opened[i];
            let openedNode = nodes[openedId];
            if (openedNode.f < minNode.f)
            {
                findex = i;
                minId = openedId;
                minNode = openedNode;
            }
        }
        let currentId = opened[findex];
        let currentNode = nodes[currentId];

        if (currentNode.x === goalX && currentNode.y === goalY)
        {
            // Completed!
            let result = [];
            while(currentNode.parent)
            {
                result.push([ currentNode.x, currentNode.y ]);
                currentNode = currentNode.parent;
            }
            result.push([ currentNode.x, currentNode.y ]);
            return result.reverse();
        }
        else
        {
            // Not there yet...
            closed.push(currentId);
            let i = opened.indexOf(currentId);
            opened.splice(i, 1);
            let neighbors = getNeighbors(nodes, currentNode.x, currentNode.y);
            for(let node of neighbors)
            {
                if (closed.indexOf(node.id) >= 0 || !isWalkable(currentNode.x, currentNode.y, node.x, node.y))
                {
                    continue;
                }

                let g = currentNode.g + 1;
                let gbest = false;
                if (opened.indexOf(node.id) === -1)
                {
                    gbest = true;
                    node.h = Math.abs(goalX - node.x) + Math.abs(goalY - node.y);
                    opened.push(node.id);
                }
                else if (g < node.g)
                {
                    gbest = true;
                }

                if (gbest)
                {
                    node.parent = currentNode;
                    node.g = g;
                    node.f = g + node.h;
                }
            }
        }
    }
    return [];
}

function resolveNode(nodes, x, y)
{
    let id = `${x},${y}`;
    if (id in nodes)
    {
        return nodes[id];
    }
    else
    {
        let node = createNode(x, y);
        nodes[id] = node;
        return node;
    }
}

function getNeighbors(nodes, x, y)
{
    return [
        resolveNode(nodes, x - 1, y - 1),
        resolveNode(nodes, x - 1, y + 0),
        resolveNode(nodes, x - 1, y + 1),
        resolveNode(nodes, x + 0, y + 1),
        resolveNode(nodes, x + 1, y + 1),
        resolveNode(nodes, x + 1, y + 0),
        resolveNode(nodes, x + 1, y - 1),
        resolveNode(nodes, x + 0, y - 1),
    ];
}

function createNode(x, y)
{
    return {
        id: `${x},${y}`,
        x: x,
        y: y,
        f: Number.NaN,
        g: Number.NaN,
        h: Number.NaN,
        parent: null,
    };
}
