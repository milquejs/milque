# Milque
A rapid game prototyping library.

If you are looking for a game library to help you make efficient games, go back to `C++`. This is all about fast prototyping.

## Motivation

I find myself struggling to have fun building games. A part of game development, like any artform, is about exploring unique and foreign design spaces. That includes play, art, music, ui, pretty much anything you can stuff in it, but also, from a programmer's perspective, systems.

I want to be able to design systems. But I also want to "build games, not engines". It's an often quoted term for those of us who get stuck in this endless cycle of "upgrading" a piece of our system code and never actually working on the game itself. And they are right; we do want to work on a game. But there's a difference between working aimlessly on system code and inventing unqiue core systems.

Minecraft, for example, revolves entirely on its chunk-block system to properly stream it's loads and loads of 3D cubes. It has open a whole new genre of games and a host of new game design choices and problems to tackle.

However, in the current game development ecosystem, these goals seem to clash.

For game engines, although easy to put things together, abstract away so much of the underlying systems that it becomes obscure. You can easily create the new FPS or physics-based game, but you are restricted to the design spaces considered by that engine. Moreover, you are forced to become indoctrinated into their opinionated interface/workflow to even use their tools. Wouldn't it be better to have learned how that system worked in the first place? Maybe then the knowledge gained can be transferred to anywhere; you are no longer confined to just that ecosystem. Knowing how the system works let's you not only debug it efficiently, but also allow you to make informed system design choices. Transparency goes a long way here.

For full control, most people start from scratch. Build the engine with your favorite text editor and programming language and nothing else. You get to learn all the minute details that go into making a game...but you aren't making a game anymore. Now you are making an engine. It may be nice to learn how an Entity Component System manages memory efficiently, but you won't actually get a game made knowing that.

For somewhere in the middle, you may go find libraries in place of writing your own so you can focus on the actual pieces of code that you want to design. Ideally, I think this is the best of both worlds. You have full control over what you don't and do care about. And, if down the line, you decide you do care about something, tear it out and implement something else in its stead...

However, more often than not, that's easier said than done. Most libraries are quite opinionated in how they work. It's hard to find libraries that are fully transparent, yet abstract enough to be effective. Most of the time, you are just writing wrappers and other various boilerplate just to have multiple libraries interact nicely with one another. And soon enough, we are just writing more "engine" code than we are on the game.

So this is Milque, a rapid game prototyping library meant for a modular, fully transparent game engine that let's you focus on what you want and forget what you don't. This is not a library meant for building production code; it does not try to be the most time or memory efficient. Milque's unique purpose is to allow developers to prototype and explore an idea as fast as possible, regardless if its some art style or another underlying system.

The main tenents of this library is to focus on:
- **Fast iteration.** Be able to make a change and immediately see the effects of it.
- **Plug-n-play.** Be able to replace any system easily. Do pivots fast.
- **Full transparency.** Be able to have complete knowledge and opinion on what happens.
- **Modular.** Choose what you don't care about and write what you want.
- **Swift onboard.** Get started fast. Don't waste time learning complex APIs if you don't have to.
- **Everywhere.** When building prototypes, we want to share ideas. Collaborate. On the web, you have access to all platforms. With WebAssembly coming along, even access to ecosystems of other programming languages.

_It's all about getting you to your ideas fast._
