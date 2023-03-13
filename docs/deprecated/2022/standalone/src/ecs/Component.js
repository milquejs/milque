import { vec3, quat } from 'gl-matrix';
import { ComponentClass, EntityManager, EntityQuery, EntityTemplate } from './EntityManager.js';
import { SystemTopic } from './SystemManager.js';

const Transform = new ComponentClass('transform', () => ({
    position: vec3.create(),
    scale: vec3.create(),
    rotation: quat.create(),
}));

const Hiding = new ComponentClass('hiding');

const ents = new EntityManager();
const sys = new SystemManager();

const PlayerTemplate = new EntityTemplate(Transform, Hiding);
const TranformQuery = new EntityQuery(Transform);
const PlayerQuery = new EntityQuery(Transform, Hiding);

/** @type {SystemTopic<string>} */
const DeathTopic = new SystemTopic();

/**
 * @param {EntityManager} entityManager 
 */
function TransformSystem(entityManager) {
    const { done, asset } = useAsset(async () => {

    });
    if (!done) {
        return;
    }

    DeathTopic.push('What?');
    for(let message of DeathTopic.poll()) {
        
    }

    let [entity, transform, hiding] = PlayerQuery.find(entityManager);
    
    for(let [entity, transform, hiding] of PlayerQuery.findAll(entityManager)) {

    }
}
