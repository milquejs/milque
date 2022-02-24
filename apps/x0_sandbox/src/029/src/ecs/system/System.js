import { Query } from './query/Query.js';

export class System
{
    constructor(applier, ...componentParameters)
    {
        this.applier = applier;
        this.query = Query.from(componentParameters);
    }

    update(entityManager)
    {
        for(let params of this.query.execute(entityManager))
        {
            this.applier.apply(entityManager, params);
        }
    }
}
