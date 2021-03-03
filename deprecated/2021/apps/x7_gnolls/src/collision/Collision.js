export class CollisionSystem
{
    constructor()
    {
        this.groups = {};
        this.nextBodyId = 1;
    }
    
    nextAvailableBodyId()
    {
        return this.nextBodyId++;
    }

    addGroup(groupName, group)
    {
        this.groups[groupName] = group;
        return this;
    }
    
    deleteGroup(groupName)
    {
        if (groupName in this.groups)
        {
            let group = this.groups[groupName];
            group.clear();
            delete this.groups[groupName];
        }
    }

    getGroup(groupName)
    {
        return this.groups[groupName];
    }

    createBody(shapeDef, groupList)
    {
        let bodyId = this.nextAvailableBodyId();
        for(let groupName of groupList)
        {
            if (groupName in this.groups)
            {
                let group = this.groups[groupName];
                let body = group.create(shapeDef);
                group.add(bodyId, body);
            }
            else
            {
                let group = new ProxyCollisionGroup();
                let body = group.create(shapeDef);
                group.add(bodyId, body);

                this.groups[groupName] = group;
            }
        }
        return bodyId;
    }

    destroyBody(bodyId)
    {
        for(let group of Object.values(this.groups))
        {
            if (bodyId in group.bodies && group.bodies[bodyId] !== null)
            {
                group.delete(bodyId);
            }
        }
    }

    getBody(groupName, bodyId)
    {
        return this.groups[groupName].get(bodyId);
    }
}

class ProxyCollisionGroup extends CollisionGroup
{
    /** @override */
    create(bodyId, shapeDef)
    {
        return {
            bodyId: bodyId,
            shape: shapeDef,
        };
    }
}

class CollisionGroup
{
    constructor()
    {
        this.bodies = {};
    }

    create(shapeDef)
    {
        throw new Error('Missing implementation.');
    }

    destroy(body) {}

    clear()
    {
        for(let body of Object.values(this.bodies))
        {
            this.destroy(body);
        }
        this.bodies = {};
    }

    add(bodyId, body)
    {
        this.bodies[bodyId] = body;
    }

    delete(bodyId)
    {
        this.bodies[bodyId] = null;
    }

    get(bodyId)
    {
        return this.bodies[bodyId];
    }
}
