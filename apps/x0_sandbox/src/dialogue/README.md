# Visual Novel

Use HTML for dialogue boxes and UI elements.
- This allows for CSS AND accessibility.
- Also, you can translate a lot easier.

The scenes are on a canvas. This can be alt described
and or animated.

There is generally very little interactivity, so most
of it is watching an animation that is stepped through
by the dialogue.

The SCRIPT of the dialogue should be decoupled but is
important to actually writing the visual novel.

Consider looking into other visual novel scripts to
see what is possible and add/import that.


Requirements:
- Dialogue Boxes
- Typewriter text
    - Sound on typed text
- Sounds and Music
- Timing of events
- Sequence of events
- Dialogue choices
- Animation
    - Tweening
- transitions between scenes
    - fade from/to color
    - cut to
    - wipe, etc.
    - custom?
- Loading/Streaming Images and sprites
- Loading/Streaming Videos
- Exporting/Embeding into website
    - Electron?
- Saving and Loading
- Settings menu


Nice to Have:
- Inventory UI?

# SETTINGS

Skip
- unseen text
- after choices
- transitions

Volume
- music
- sound

- TextSpeed
- AutoForwardTime

Display
- Windowed
- Fullscreen

Accessibility
- Textbox transparency?
- Self-voicing

Save Slots?

Space / Enter to skip to end. then again to skip to next.

Double tapping may accidentally skip
dialogue. So for short dialogue.
Force an empty wait?


AUTO PLAY that just goes along without
needing to press anything.



## Other Examples
[RenPy](https://www.renpy.org/dl/4.1/tutorial.html)

Let's use mdx :D


## Script

> someone: what about this?
> someone else: and?

The previous person just says this?
- And this can be the response?
Maybe, or something else?
- This is pretty good.

```
execute this
```

> [someone else](:face="sad"): Nothing else?
* Option 1 -> home
* Option 2 -> elsewhere

{ goto home }




## Renpy script


dialogue lines are assigned to speakers

>person: Hi there!
>me: Well hello.

Speakers can have different colors.

Showing images:
- scene background
- character profile
- hiding

Transitions
- Fade
- Dissolve

Positioning images (at anchor points?)

Play/Stop music/ sound
- Fade in or out

Pause / wait for user input or time


Choices, Labels, and GOTOs

Set/Get state flags

Conditionals


