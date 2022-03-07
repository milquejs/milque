/**
 * ECS
 *
 * Queries are fancy objects that return entities/components matching the filter.
 *
 * Entities are simply Numbers (similar to WebGL handles)
 *
 * Components are data blobs (structs of data)
 *
 * Systems are functions that accept component lists
 */

/*
import { System, Not, Optional, Query } from './system/index.js';

import { EntityManager } from './EntityManager.js';
import { ObjectComponentFactory } from './factory/ObjectComponentFactory.js';
import { TagComponentFactory } from './factory/TagComponentFactory.js';
import { ComponentRegistry } from './ComponentRegistry.js';
import { EntityComponentFactory } from './component/index.js';

// The ideal form.

// The Component Type.
const Position = {
    type: Symbol('Position'),
    data: {
        x: 0,
        y: 0,
    }
};
const Motion = {
    type: Symbol('Motion'),
    data: {
        motionX: 0,
        motionY: 0,
    }
};
const Friction = {
    type: Symbol('Friction'),
    data: {
        frictionX: 0,
        frictionY: 0,
    }
};
const Frozen = {
    type: Symbol('Frozen'),
    data: true,
};

const components = new ComponentRegistry()
    .registerComponent(Position.type, new ObjectComponentFactory(Position.data))
    .registerComponent(Motion.type, new ObjectComponentFactory(Motion.data))
    .registerComponent(Friction.type, new ObjectComponentFactory(Friction.data))
    .registerComponent(Frozen.type, new TagComponentFactory());

// The System.
function ApplyMotion(entityId, position, motion, optionalFriction, notFrozen)
{
    position.x += motion.motionX;
    position.y += motion.motionY;
    
    if (optionalFriction)
    {
        motion.motionX *= 1 - optionalFriction.frictionX;
        motion.motionY *= 1 - optionalFriction.frictionY;
    }
}
MotionSystemParameterList = [
    Position,
    Motion,
    Optional(Friction),
    Not(Frozen),
];
const UpdateMotionSystem = new System(UpdateMotion, MotionSystemParameterList);
const LoadMotionSystem = new System(LoadMotion, MotionSystemParameterList);

const MotionSystem = new System(
    ApplyMotion,
    Position, Motion,
    Optional(Friction),
    Not(Frozen));

function onWorldUpdate(entityManager)
{
    MotionSystem.execute(entityManager);
}

const systems = [
    MotionSystem
];

// The Entity.

const em = new EntityManager({
    components: components,
});

const entityId = entityManager.createEntity();
entityManager.addComponent(entityId, Motion);

let asteroidsBuilder = new EntityBuilder()
    .component(Motion, (component, entityId) => {
        component.scale = 0;
    })
    .component(Motion2)
    .component(Position)
    .build(entityManager);

asteroidsBuilder.build(entityManager);

class Meteorite extends Entity
{
    constructor(entityManager, entityId)
    {
        super(entityManager.createEntity(entityId), entityId);
    }

    onCreate()
    {
        
    }
}

new Meteorite(entityManager);
*/
