# Day 4

Another long stretch of time has passed. Weird that I keep writing these, but perhaps it may be useful one day...

Anyways, I think the focus of the library should be to help developers minimize iteration time as much as possible. I think that is where we will benefit the most from.

When I use a prototyping tool, the part that always bugs me is when they abstract TOO much of the inner workings away. I want to be able to efficiently experiment with each system. Physics, in particular, has different feels. When an engine has a built-in physics, it makes all the games it creates "feel" the same. Each module should be compact and self-contained such that we can plug and play modules. So if you wanted to experiment with the physics, remove the physics module and implement your own.

The focus is not on speed or abstraction, but quick iteration. I want to be able to create something and see the effects AS FAST AS POSSIBLE.

I found this when I drawing a character with squares. Although primitive, I really enjoyed moving around random white and black boxes to find the "character". Why that was enjoyable and why that worked was because of the instant feedback from the auto-compile.

For things like input, etc. it should be the same. When I add a click input, I want to be able to immediately click and see something.

When I add an entity, I want to be able to see it in the game world immediately.

Things should be clear where they connect. That is the only way things can be modular. And data-orientated as much as possible, so swapping modules does not require complete rewrites.
