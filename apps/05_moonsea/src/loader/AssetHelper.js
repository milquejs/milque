export async function loadAssetRefs(refs) {
    await Promise.all(refs.map(ref => ref.load()));
}
