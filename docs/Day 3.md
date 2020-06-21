# Day 3 
It's been months. A lot has changed since then and yet not much has.

In the meantime I have made 2 playable games: Asteroids and Mines. Asteroids is an asteroid clone. But it's written in a standalone format (mostly), which kinda serves as a starting point for the engine. From this example, we can see what code became redundant and what features we sorta want from an engine.

Mines is a minesweeper clone. This time, the implemented systems are a bit more modular, separating entities from stage logic and rendering, etc. I've abstracted out a few more systems that were pretty much identical to the asteroids example, which adds to our efforts in building up our engine.

But most importantly, these were not demoes; they are playable. There is a win and lose condition. There's scores and progression. It's an actual game :D

I think small games like this not only help moral, but also let's me experiment with different systems and see what works and what doesn't. I think the best approach to making this game engine is oncrementally building the engine to what I need, instead of theorizing what we could need (and of course applying software engineering principles).

Currently, we do have a new and improved input system. It is inspired by the previous attempts, but instead of tackling it from the proposal-first, I implemented based on what is used first. That means I implemented what I used for each game before worrying about the efficiency and how they call come together. This was a great way to breakdown my design issues with the implementation, particularly the numerous moving parts in the system. So instead of trying to reach some intangible goal of a "perfect" input system, I now instead can focus on the developer experience of the system itself first.

And I think that's the lesson here. Build what you need, not what you want. Otherwise, you are not building for people to use, only for the theory. This is how we make usable pieces of code, not just efficient code.
