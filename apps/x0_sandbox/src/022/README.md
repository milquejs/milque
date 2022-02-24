# CatRain

A train that goes in a straight line.

You can change the next destination.


SpriteRegistry
- Register name to initial values
MaskRegistry
- Register name to initial values
EntityRegistry
- Register name to builder
ComponentRegistry
- Register reference to factory
RoomRegistry
- Register name to initial values
    - GameObject with overriden values

class RoomBuilder
- setCamera()
- setView()
- add(entityName, overrides)
- build(entityRegistry, componentRegistry)

class Room
- Camera
- View
- EntityRegistry

class EntityBuilder
- add(componentName, overrides)
- remove(componentName)


Only 1 CollisionMask per entity
Only 1 Sprite per entity
Only 1 Parent per entity
- This is a scene node



GameObject
- onCreate
- onDestroy
- onUpdate
- onRender
Room
- Camera
- Views
- GameObject placement
- TileMap
Sprite
- SpriteTransform
- SpriteAnimation
CollisionMask
- MaskType
- MaskTransform
- CollisionGroup
