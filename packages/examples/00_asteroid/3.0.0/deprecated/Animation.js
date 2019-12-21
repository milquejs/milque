// https://www.gamasutra.com/view/feature/131694/architecting_a_3d_animation_engine.php

function playAnimation(animationId, startTime = 0, transitionTime = 0)
{

}

const DEFAULT_TRANSITION_TIME = 0.03;
function transitionToAnimation(animationId)
{
    playAnimation(animationId, 0, DEFAULT_TRANSITION_TIME);
}

function transitionToAnimationAtTime(animationId, startTime)
{
    playAnimation(animationId, startTime, DEFAULT_TRANSITION_TIME);
}


// Animations are either looped or one-shot, default loop.
function setNextAnimation(nextAnimationId)
{

}

function disableAnimationLooping()
{

}

function enableAnimationLooping()
{

}

function isAnimationLooping()
{

}

function playNextAnimation()
{

}

function transitionToNextAnimation()
{

}

function setAnimationRate(msPerFrame)
{
    
}

