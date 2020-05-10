# Day 2
I've had a change of heart. It's quick, I know, but I now
think I should focus on just making a game, putting things
that I will use together in here, and then transform it into
Milque.

The reason for this is that the features I include would
then actually be practical instead of solving problems that
no one has.

So to start this, I'm designing a basic game architecture. One
with GameObjects, Rooms, Views, and Sprites.

GameObjects by default have position and are placed within rooms
as instances. So a room is simply a collection of instances and
initial starting data. A room also has views that determine how
the game is seen. Whether the view should follow the character
or not, etc. Finally, there are Sprites, which represent the
game object graphically.

Hopefully, this leads to easier game development.
