(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.Random = {}));
}(this, (function (exports) { 'use strict';

    class RandomGenerator
    {
        /** @abstract */
        next() { return Math.random(); }
    }

    // SOURCE: https://gist.github.com/blixt/f17b47c62508be59987b
    class SimpleRandomGenerator extends RandomGenerator
    {
        constructor(seed = 0)
        {
            super();

            this._seed = Math.abs(seed % 2147483647);
            this._next = this._seed;
        }

        /** @override */
        next()
        {
            this._next = Math.abs(this._next * 16807 % 2147483647 - 1);
            return this._next / 2147483646;
        }

        get seed() { return this._seed; }
    }

    class RandomInterface
    {
        constructor(generator)
        {
            this.generator = generator;
        }

        next() { return this.generator.next(); }

        choose(list)
        {
            return list[Math.floor(this.next() * list.length)];
        }

        range(min, max)
        {
            return ((max - min) * this.next()) + min;
        }

        sign()
        {
            return this.next() < 0.5 ? -1 : 1;
        }
    }

    class DefaultRandomInterface extends RandomInterface
    {
        constructor() { super(new RandomGenerator()); }

        withGenerator(generator) { return new RandomInterface(generator); }
        withSeed(seed) { return new RandomInterface(new SimpleRandomGenerator(seed)); }
    }

    const DEFAULT_RANDOM_INTERFACE = new DefaultRandomInterface();

    exports.Random = DEFAULT_RANDOM_INTERFACE;
    exports.RandomGenerator = RandomGenerator;
    exports.RandomInterface = RandomInterface;
    exports.SimpleRandomGenerator = SimpleRandomGenerator;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
