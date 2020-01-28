import { HotEntityModule } from './HotEntityModule.js';

const HOT_ENTITY_MODULES = new Map();

export function enableForEntity(entityModule, entityManager, entityId)
{
    if (!HOT_ENTITY_MODULES.has(entityModule.id))
    {
        throw new Error('Module must be accepted first for HER to enable hot entity replacement.');
    }

    let hotEntityModule = HOT_ENTITY_MODULES.get(entityModule.id);
    hotEntityModule.addEntity(entityManager, entityId);
    return entityId;
}

export function acceptForModule(entityModule, entityConstructor, worldConstructor = undefined)
{
    let newHotEntityModule = new HotEntityModule(entityModule, entityConstructor);
    if (HOT_ENTITY_MODULES.has(entityModule.id))
    {
        console.log(`Reloading '${entityModule.id}'...`);
        let oldHotEntityModule = HOT_ENTITY_MODULES.get(entityModule.id);
        oldHotEntityModule.replaceWith(newHotEntityModule, worldConstructor);
    }
    else
    {
        console.log(`Preparing '${entityModule.id}'...`);
        HOT_ENTITY_MODULES.set(entityModule.id, newHotEntityModule);
    }

    return entityModule;
}

export function getInstanceForModuleId(entityModuleId)
{
    return HER_MODULES.get(entityModuleId);
}
