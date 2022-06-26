(event) -> Actions -> (update) -> State -> (notify) -> Computed -> (trigger) -> Effects

Some event happens invokes an action that updates a state. These changes are propagated to all computations and effects that depend on it.




System loading should just be done in order. Make it as simple as possible for people designing WITH INTENT.




Gather Time -> Play Time
LoadSystem
- Get all dependencies at gather time
- Then load them at play time.
- All loading is ran in parallel.
- Can wait for resources inside loads.
    - but should really extract parent resources to its own system
- Loading bar?

StreamingLoadSystem
- Load whatever whenever and let others know about it.
- Loading bar?

FrameSystem
- Render order matters. So render based on the pass index.

```js
const [load] = useLoadController();

```

```js
const [frame(dt)] = useRenderFrameController();

useRenderFrame((dt) => {
    // dt is the time since last frame.
}, { pass: BACKGROUND_PASS });
```

UpdateSystem
- Update order can matter. So update based on events.

```js
const [update(dt)] = useUpdateController();

useUpdate((dt) => {
    // dt is time since last update.
});
```


Why not just render or update things in the order they arrive?
- Because loading order may not align with rendering order.
- But we got rid of loading order.
- Because update order may not align with rendering order.


Load
Init
PreFrame
OnFrame
PostFrame
Destroy

usePreloadEffect
useEffect

useEvent('systemStart', () => {
  // Now load systems in order.
})

Life cycle events:
- PreEffect
- Effect
- PostEffect
 - Obtain all load/init locks
- Load
- Init
- PreUpdate
- Update
- PostUpdate
- Render
- Load (After)
- PostEffect (After)
- Effect (After)
- PreEffect (After)