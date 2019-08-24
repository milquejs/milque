/**
 * Inspired by Game Maker Tutorials.
 * This uses the basic set of Milque tools. In theory, all future
 * versions should still be able to support this.
 */

Milque.Display.attach(document.getElementById('display1'));
const ctx = Milque.Display.VIEW.canvas.getContext('2d');

const TAG_BALL = 'ball';
const TAG_TEXT = 'text';
const TAG_PARTICLE = 'particle';
const BALL_SPEED = 3; // 3 or 20
const BALL_SPEED_RANGE = [-BALL_SPEED, BALL_SPEED];
const BALL_SIZE = 64;
const MAX_SUCCESS_TIME = 150;
const SUCCESS_SIZE = 64;
const DIV_FACTOR = 0.8;
const MIN_LIFE = 100;
const MAX_LIFE = 100;

function Position(x = 0, y = 0)
{
    return { x, y };
}

function Motion(dx = 0, dy = 0)
{
    return { dx, dy };
}

function DieOverTime(life = 100)
{
    return { life, maxLife: life };
}

function Rainbow()
{
    return { color: Milque.Color.randomColor() };
}

function Collidable(body)
{
    return { body };
}
Collidable.onDestroy = function (instance) {
    Milque.Collision.COLLISION_MANAGER.remove(instance.body);
    instance.body = null;
    return true;
};

function Ball(x = 0, y = 0, w = 16, h = 16, dx = BALL_SPEED, dy = BALL_SPEED)
{
    const body = Milque.Collision.COLLISION_MANAGER.addBox(x, y, w, h);
    const entity = Milque.Entity.spawn()
        .tag(TAG_BALL)
        .component(Position, x, y)
        .component(Motion, dx, dy)
        .component(Collidable, body)
        .component(DieOverTime, Milque.Math.randomRange(MIN_LIFE, MAX_LIFE));
    entity.w = w;
    entity.h = h;
    entity.color = Milque.Color.randomColor();
    return entity;
}

function Text(x = 0, y = 0, text = 'Boo', textSize = 16, textAlign = 'center')
{
    const entity = Milque.Entity.spawn()
        .tag(TAG_TEXT)
        .component(Position, x, y);
    entity.text = text;
    entity.textSize = textSize;
    entity.textAlign = textAlign;
    entity.color = '#FFFFFF';
    entity.visible = true;
    return entity;
}

function UpdatePositionWithMotion()
{
    for(const [pos, mot] of Milque.Entity.components(Position, Motion))
    {
        pos.x += mot.dx;
        pos.y += mot.dy;
    }
}

function UpdateRainbow()
{
    for(const rai of Milque.Entity.components(Rainbow))
    {
        rai.color = Milque.Color.randomColor();
    }
}

function KeepCollidableUpdated()
{
    for(const [pos, col] of Milque.Entity.components(Position, Collidable))
    {
        col.body.x = pos.x;
        col.body.y = pos.y;
    }
}

function splitBall(ball)
{
    // An estimation of prev speed.
    const prevSpeed = ball.dx + ball.dy;
    const speed = Math.max(BALL_SPEED, Milque.Math.randomRange(prevSpeed, prevSpeed * 2));
    const angle = Milque.Math.randomRange(0, 2 * Math.PI);
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed;
    Ball(ball.x, ball.y, ball.w * DIV_FACTOR, ball.h * DIV_FACTOR, dx, dy);
    Ball(ball.x, ball.y, ball.w * DIV_FACTOR, ball.h * DIV_FACTOR, -dx, -dy);
    ball.destroy();
}

function lightenColor(color, percent)
{
    const num = parseInt(color.replace("#",""),16),
    amt = Math.round(255 * percent),
    R = (num >> 16) + amt,
    B = (num >> 8 & 0x00FF) + amt,
    G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
}

function giveBallLife(ball)
{
    // Change color on wall hit.
    ball.color = Milque.Color.randomColor();
    ball.life = ball.maxLife = Milque.Math.randomRange(MIN_LIFE, MAX_LIFE);
}

function explode(x, y, amount = 100, life = 100, emitRadius = 16, minSpeed = 1, maxSpeed = 2, minSize = 8, maxSize = 16)
{
    for(let i = 0; i < amount; ++i)
    {
        const angle = Milque.Math.randomRange(0, Math.PI * 2);
        const dist = Milque.Math.randomRange(0, emitRadius);
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        const speed = Milque.Math.randomRange(minSpeed, maxSpeed);
        const entity = Milque.Entity.spawn()
            .tag(TAG_PARTICLE)
            .component(Position, x + dx * dist, y + dy * dist)
            .component(Motion, dx * speed, dy * speed)
            .component(DieOverTime, 100)
            .component(Rainbow);
        entity.size = Milque.Math.randomRange(minSize, maxSize);
    }
}

function MainScene()
{
    // The first ball
    Ball(Milque.Display.width() / 2, Milque.Display.height() / 2,
        BALL_SIZE, BALL_SIZE,
        Milque.Math.choose(BALL_SPEED_RANGE),
        Milque.Math.choose(BALL_SPEED_RANGE));

    this.textScore = Text(Milque.Display.width() / 2, Milque.Display.height() / 2, () => this.score, 16);
    this.textScore.color = '#444444';
    this.textScore.visible = true;
    this.textSuccess = Text(Milque.Display.width() / 2, Milque.Display.height() / 2, 'CORNER BALL!', SUCCESS_SIZE);
    this.textSuccess.visible = false;

    const viewOffset = Milque.Display.VIEW.canvas.getBoundingClientRect();
    this.inputHit = Milque.Input.Action('hit').attach('mouse[0]:down');
    this.inputHitX = Milque.Input.Range('hitx').attach('mouse[pos]:x', viewOffset.left, Milque.Display.width() + viewOffset.left, 0, Milque.Display.width());
    this.inputHitY = Milque.Input.Range('hity').attach('mouse[pos]:y', viewOffset.top, Milque.Display.height() + viewOffset.top, 0, Milque.Display.height());

    this.successTime = 0;
    this.successBall = null;
    this.score = 0;

    const scene = this;
    function doScore(amount = 1, successTime = MAX_SUCCESS_TIME)
    {
        scene.successTime = successTime;
        scene.textSuccess.visible = true;
        scene.textScore.visible = false;
        scene.score += amount;
    }

    Milque.Game.on('update', () => {
        Milque.Display.clear();

        KeepCollidableUpdated();

        if (this.inputHit.get())
        {
            const hitX = this.inputHitX.get(false);
            const hitY = this.inputHitY.get(false);
            for(const ball of Milque.Entity.entities(TAG_BALL))
            {
                if (Milque.Collision.overlap(ball.x - ball.w / 2, ball.y - ball.h / 2, ball.w, ball.h, hitX, hitY, 8, 8))
                {
                    scene.textSuccess.text = 'GOTT\'EM!';
                    doScore(1, 30);
                    splitBall(ball);
                    explode(ball.x, ball.y, 50, 100, 16, 0.1, 2);
                    break;
                }
            }
        }

        if (this.successTime > 0)
        {
            --this.successTime;

            // Flash text color
            this.textSuccess.color = Milque.Color.randomColor();
            this.textSuccess.textSize = Math.abs(Math.sin(this.successTime / 10)) * SUCCESS_SIZE;
            
            // Flash ball color
            for(const ball of Milque.Entity.entities(TAG_BALL))
            {
                giveBallLife(ball);
            }
        }
        else
        {
            this.textSuccess.visible = false;
            this.textScore.visible = true;
        }

        for(const text of Milque.Entity.entities(TAG_TEXT))
        {
            if (text.visible)
            {
                ctx.font = text.textSize + 'px monospace';
                ctx.textAlign = text.textAlign;
                ctx.textBaseline = text.textAlign === 'center' ? 'middle' : 'top';
                ctx.fillStyle = text.color;
                if (typeof text.text === 'function')
                {
                    ctx.fillText(text.text(), text.x, text.y);
                }
                else
                {
                    ctx.fillText(text.text, text.x, text.y);
                }
            }
        }

        UpdatePositionWithMotion();
        UpdateRainbow();

        for(const ball of Milque.Entity.entities(TAG_BALL))
        {
            --ball.life;
            if (ball.life <= 0)
            {
                ball.destroy();
                continue;
            }

            let xFlag = false;
            if (ball.x < 0) { ball.x = 0; xFlag = true; }
            if (ball.x > Milque.Display.width()) { ball.x = Milque.Display.width(); xFlag = true; }
            if (xFlag) ball.dx = -ball.dx;

            let yFlag = false;
            if (ball.y < 0) { ball.y = 0; yFlag = true; }
            if (ball.y > Milque.Display.height()) { ball.y = Milque.Display.height(); yFlag = true; }
            if (yFlag) ball.dy = -ball.dy;

            // CORNER BALL!!! :D
            if (xFlag && yFlag)
            {
                // Start success dance.
                scene.textSuccess.text = 'CORNER BALL!!!';
                doScore(1);
            }
            else if (xFlag || yFlag)
            {
                giveBallLife(ball);

                // Loose some velocity each time you hit a wall.
                ball.dx *= 0.95;
                ball.dy *= 0.95;
            }

            const lifeRatio = ball.life / ball.maxLife;
            const color = lightenColor(ball.color, lifeRatio - 1);
            ctx.fillStyle = color;
            ctx.fillRect(ball.x - ball.w / 2, ball.y - ball.h / 2, ball.w, ball.h);
        }

        for(const particle of Milque.Entity.entities(TAG_PARTICLE))
        {
            --particle.life;
            if (particle.life <= 0)
            {
                particle.destroy();
                continue;
            }

            const lifeRatio = particle.life / particle.maxLife;
            ctx.fillStyle = particle.color;
            ctx.fillRect(particle.x, particle.y, particle.size * lifeRatio, particle.size * lifeRatio);
        }

        // Draw bounding boxes
        // Milque.Collision.draw();
    });
}

// TODO: This should be called automatically in the future...
MainScene();

Milque.play();
