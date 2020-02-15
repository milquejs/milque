export function createFactory(objectConstructor = () => ({}))
{
    return {
        objects: new Set(),
        constructor: objectConstructor,
        create(...args)
        {
            let result = this.constructor.apply(undefined, args);
            this.objects.add(result);
            return result;
        },
        destroy(object)
        {
            this.objects.delete(object);
        },
        clear()
        {
            this.objects.clear();
        },
        [Symbol.iterator]()
        {
            return this.objects.values();
        }
    };
}
