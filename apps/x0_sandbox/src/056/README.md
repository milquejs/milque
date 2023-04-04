
```js

function ObjBunny(m) {
    let objs = useContext(m, ObjectProvider);
    let handler = useObjectHandler(m, objs, 'obj_bunny');
    whenCreate(m, handler, (self) => {
    });
    whenUpdate(m, handler, (self) => {
    });
    whenDestroy(m, handler, (self) => {
    });
}

```