import { AssetManager } from '@milque/asset';
import { DisplayPort } from '@milque/display';
import { InputPort } from '@milque/input';
import { EntityManager } from '@milque/scene';

export async function main() {
    let display = DisplayPort.create({ id: 'display', mode: 'fill' });
    let input = InputPort.create({ for: 'display' });
    let asset = new AssetManager();
    let entity = new EntityManager();
}
