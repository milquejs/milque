# Day 1
So here we go. The first page of many. This is in part to force me to
actually design things ahead of time before committing it to code. But 
it is also a chance for me to just write :D To practice a skill that I
love to excercise when I had more free time...so here it is.

Excuse any errors or random trains of thought; this is a dev journal +
a writing excercise. Mistakes will be made. Nonsense will be had. But
no editing will be done (other than formatting and logistics). Hope you
enjoy it, cause at least I will.

So the project I will create is called Milque, named after Milky.js,
another game prototyping library that inpsired me to make this one. It
has an emphasis on declarative syntax, so it kinda touches on the idea
of fast prototyping, but I felt like it did not go far enough in some
places and too far in others. I want to make a playground for game devs,
not a game engine. That means effeciency is out the window. I don't really
care about it. But I do care about the developer experience and harnessing
the developer's creativity. It's about bringing back the FUN in game dev,
particularly those who enjoy game engine development, like me.

I wrote more on the motivations and goals of the project in the readme, since
that should be more precise than some person's ramblings. So anyways, on
to the actual content.

Today, I will be introducing an input system.

Now, this input system is inspired by:
https://www.gamedev.net/tutorials/_/technical/game-programming/designing-a-robust-input-handling-system-for-games-r2975/

No really, check it out. I think it makes a whole lot of sense to implement
it this way. It let's the user define how they want to play the game by any
kind of interface. You just need to provide adapters. That is amazing.

So to achieve this, and to maintain modularity, let's split this up into
smaller pieces.

Firstly, a device module to consolidate all HTML standard input systems,
like keyboard, mice, touch, and gamepads, into one access point. This
serves as a light abstraction to provide a cleaner and easier to work with
API for input. This only redirects the events, doesn't actually have state.

Secondly, we need a input map to map input names to actual adapters. I'm
thinking of calling this an `InputScheme` instead of a map because there
already exists a `Map` in JavaScript, and you would them assume it should
have `set()` and `delete()` functionality. But for our purposes, it should
only be created or updated. It should not support editing the mapping in
real-time as it would complicate managing the state of inputs and listeners
to the actual devices. That also means we should probably have an
`InputSchemeBuilder` of some sort. Functionality wise, this should be able
to retreive all the necessary listeners and endpoints to attach to the devices
and also the developer's input names. Between these two ends is the adapter.
There definitely should be some pre-built. These are the three main adapters
as mentioned in the article: State, Action, and Range. This is probably the
chunk of the input system.

Thirdly, we need an `InputState` to keep track of the state of the inputs. Things
like Range, Action, or State may need to store state between events, so this
will handle that. The reason we don't store this with the adapter is because
of separation of concern. And also adapters should be reusable. State is not.
Sometimes, you may even want to restart input state from some point. This will
allow you to do that without caching all the input adapters object state.

Fourthly, we need an `InputContext` to govern how events are captured/bubbled.
It is important that the developer has control over which group of inputs
should be able to consume first. Ideally, the developer should not need
access, or even know about, the other inputs, yet still properly handle
the order of call.

And that is the entire input system, from raw input to dev-friendly polled events.

So how it works is that `InputDevice` should handle all interactions with the
raw input events AND dispatch them in a central access point. It should not
transform the data in any way (although it can provide a different access API).

`InputState` will hold all input state that is accumulated over time between raw
input events. It should be serializable and should not contain any complex logic.
The developer should be able to use this to access the current state of the named
input. The result of computing from `InputAdapter` and translating through
`InputScheme` should be stored here. It should not store anything about the raw
input data. This makes sure that the developer's code will be abstracted away from
raw input and therefore obtain the benefit of this system.

`InputScheme` will only hold static information about the input mapping. No input
state should be kept here. This should be serializable and editable. It should
also not care about any devices that may or may not exist. It should be independent.
Because of this limitation, we need something else to connect the fired events
from the `InputDevice` listed from scheme's raw input endpoints to the keyed
input entry in `InputState`. Basically, this will hold information about the used
device and all developer input names and their associated adapters.

`InputContext` is simply a way to group `InputAdapters` such that you can control the
order of input consumption by some state. Otherwise, you would have to manually edit
every input adapters' call priority. The context should also be independent of
program call order.

`InputDispatcher` is that thing to connect everything. In order to actually find
the appropriate `InputAdapter` to handle it, it would need go through every
`InputContext` in the appropriate order and check with its adapters on whether
it consumes that event. If so, it stores the result of the adapter to `InputState`.

Is `InputDispatcher` necessary? Can this be in `InputContext`?
