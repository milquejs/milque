/**
 * Inspired by Game Maker Tutorials.
 * This uses the basic set of Milque tools. In theory, all future
 * versions should still be able to support this.
 */

import { GameLoop, Viewport, Display, Input, Utils, Random } from './milque.js';

const MIN_BALL_SPEED = 0.2;
const MAX_BALL_SPEED = 3;
const MAX_BALL_LIFE = 200;
const BALL_SIZE = 64;
const BALL_SPLIT_FACTOR = 0.8;

const WORLD_VIEW = Viewport.createView(640, 480);
const HIT = Input.createAction('mouse[0].down');
const HIT_X = Input.createRange('mouse[pos].x');
const HIT_Y = Input.createRange('mouse[pos].y');

document.title = 'clownball';

function start()
{
    this.balls = [];
    this.particles = [];
    this.score = 0;

    this.gameStart = false;
    BouncingBall(this, WORLD_VIEW.width / 2, WORLD_VIEW.height / 2);
}

function update(dt)
{
    Input.poll();

    if (!this.gameStart)
    {
        if (HIT.value)
        {
            this.gameStart = true;
            this.score = 0;
        }
    }
    else
    {
        if (HIT.value)
        {
            const hitX = HIT_X.value * WORLD_VIEW.width + WORLD_VIEW.offsetX;
            const hitY = HIT_Y.value * WORLD_VIEW.height + WORLD_VIEW.offsetY;
            const hitBox = { x: hitX, y: hitY, width: 2, height: 2 };
            for(let ball of this.balls)
            {
                if (Utils.intersectBox(ball, hitBox))
                {
                    this.score += 1;
                    splitBall(this, ball);
                    explode(this, ball.x, ball.y);
                    break;
                }
            }
        }
    
        if (this.balls.length <= 0)
        {
            restart(this);
        }
        else
        {
            BouncingBall.onUpdate(dt, this);
        }
    }

    updateParticles(dt, this, this.particles);

    let view = WORLD_VIEW;
    this.render(view);
}

function render(view)
{
    let ctx = view.context;
    Utils.clearScreen(ctx, view.width, view.height);

    BouncingBall.onRender(view, this);
    Utils.drawText(ctx, `${this.score}`, view.width / 2 + 3, view.height / 2 + 3, 0, 32, '#888888');
    Utils.drawText(ctx, `${this.score}`, view.width / 2, view.height / 2, 0, 32, '#FFFFFF');

    for(let particle of this.particles)
    {
        let lifeRatio = Math.min(1, particle.life / 100);
        let color = lightenColor(Utils.randomHexColor(), lifeRatio - 1);
        Utils.drawBox(ctx, particle.x, particle.y, 0, particle.size, particle.size, color);
    }

    Display.drawBufferToScreen(ctx);
}

function restart(world)
{
    world.gameStart = false;
    world.balls.length = 0;
    BouncingBall(world, WORLD_VIEW.width / 2, WORLD_VIEW.height / 2);
}

function BouncingBall(world, x, y,
    width = BALL_SIZE,
    height = BALL_SIZE,
    dx = Random.randomSign() * Random.randomRange(MIN_BALL_SPEED, MAX_BALL_SPEED),
    dy = Random.randomSign() * Random.randomRange(MIN_BALL_SPEED, MAX_BALL_SPEED))
{
    let result = {
        world,
        x, y,
        width, height,
        dx, dy,
        life: MAX_BALL_LIFE,
        color: Utils.randomHexColor(),
        refresh()
        {
            // Change color on wall hit.
            this.color = Utils.randomHexColor();
            this.life = Random.randomRange(this.life, MAX_BALL_LIFE);
        },
        destroy()
        {
            this.world.balls.splice(this.world.balls.indexOf(this), 1);
        }
    };
    world.balls.push(result);
    return result;
}
BouncingBall.onUpdate = function onUpdate(dt, world) {
    for(let ball of world.balls)
    {
        ball.life -= dt;
        if (ball.life <= 0)
        {
            ball.destroy();
            continue;
        }

        let xFlag = false;
        if (ball.x < 0) { ball.x = 0; xFlag = true; }
        if (ball.x > WORLD_VIEW.width) { ball.x = WORLD_VIEW.width; xFlag = true; }
        if (xFlag) ball.dx = -ball.dx;

        let yFlag = false;
        if (ball.y < 0) { ball.y = 0; yFlag = true; }
        if (ball.y > WORLD_VIEW.height) { ball.y = WORLD_VIEW.height; yFlag = true; }
        if (yFlag) ball.dy = -ball.dy;

        // CORNER BALL!!! :D
        if (xFlag && yFlag)
        {
            // Start success dance.
        }
        else if (xFlag || yFlag)
        {
            // Loose some velocity each time you hit a wall.
            ball.refresh();
            ball.dx *= 0.95;
            ball.dy *= 0.95;
        }

        ball.x += ball.dx;
        ball.y += ball.dy;
    }
};
BouncingBall.onRender = function onRender(view, world)
{
    let ctx = view.context;

    for(let ball of world.balls)
    {
        let lifeRatio = ball.life / MAX_BALL_LIFE;
        let color = lightenColor(ball.color, lifeRatio - 1);
        Utils.drawBox(ctx, ball.x, ball.y, 0, ball.width, ball.height, color);
    }
};

function splitBall(world, ball)
{
    // An estimation of prev speed.
    const prevSpeed = ball.dx + ball.dy;
    const speed = Math.max(MAX_BALL_SPEED, Random.randomRange(prevSpeed, prevSpeed * 2));
    const angle = Random.randomRange(0, 2 * Math.PI);
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;
    BouncingBall(world, ball.x, ball.y,
        ball.width * BALL_SPLIT_FACTOR, ball.height * BALL_SPLIT_FACTOR,
        dx, dy);
    BouncingBall(world, ball.x, ball.y,
        ball.width * BALL_SPLIT_FACTOR, ball.height * BALL_SPLIT_FACTOR,
        -dx, -dy);
    ball.destroy();
}

function lightenColor(color, percent)
{
    const num = Number.parseInt(color.replace("#",""),16),
    amt = Math.round(255 * percent),
    R = (num >> 16) + amt,
    B = (num >> 8 & 0x00FF) + amt,
    G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
}

function explode(world, x, y, amount = 100, life = 100, emitRadius = 16, minSpeed = 1, maxSpeed = 2, minSize = 8, maxSize = 16)
{
    let result = [];
    for(let i = 0; i < amount; ++i)
    {
        const angle = Random.randomRange(0, Math.PI * 2);
        const dist = Random.randomRange(0, emitRadius);
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        const speed = Random.randomRange(minSpeed, maxSpeed);
        let particle = createParticle(world,
            x + dx * dist, y + dy * dist,
            dx * speed, dy * speed,
            life,
            Random.randomRange(minSize, maxSize)
        );
        result.push(particle);
    }
    return result;
}

function createParticle(world, x, y, dx, dy, life, size)
{
    let result = {
        x, y,
        dx, dy,
        life,
        size
    };
    world.particles.push(result);
    return result;
}

function destroyParticle(world, particle)
{
    world.particles.splice(world.particles.indexOf(particle), 1);
}

function updateParticles(dt, world, particles)
{
    for(let particle of particles)
    {
        particle.life -= dt;
        if (particle.life <= 0)
        {
            destroyParticle(world, particle);
            continue;
        }
        particle.x += particle.dx;
        particle.y += particle.dy;
    }
}

GameLoop.start({ start, update, render });
