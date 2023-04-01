import { EntityManager } from '@milque/scene';
import { useContext } from '../runner';

export const SpriteProviders = {
    EntityProvider() {
        throw new Error('Not yet implemented.');
        return new EntityManager();
    },
};

export function SpriteSystem(m) {
    let ents = useContext(m, SpriteProviders.EntityProvider);
}
