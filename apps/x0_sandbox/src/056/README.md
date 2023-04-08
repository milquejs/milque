
```js

function ObjBunny(m) {
    let gobs = using(m, GameObjectProvider);
    let handler = useObjectHandler(m, objs, 'obj_bunny');
    whenCreate(m, handler, (self) => {
    });
    whenUpdate(m, handler, (self) => {
    });
    whenDestroy(m, handler, (self) => {
    });
}

class ObjBunny extends GameObject {
    constructor() {
        super();
    }

    onCreate() {
        this.x += 1;
    }
}

```


What is the goal?

- Make Game Maker is VS Code.

What does that mean?

I make sprites for art.
I make objects for logic.
I make rooms for design.

JSON definiable and system agnostic.


