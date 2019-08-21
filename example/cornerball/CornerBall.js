Milque.Display.attach(document.getElementById('display1'));
const ctx = Milque.Display.VIEW.canvas.getContext('2d');

const TAG_BALL = 'ball';
const BALL_SPEED = 3; // 3 or 20
const BALL_SPEED_RANGE = [-BALL_SPEED, BALL_SPEED];
const BALL_SIZE = 64;
const MAX_SUCCESS_TIME = 150;
const SUCCESS_SIZE = 64;

function Ball(x = 0, y = 0, w = 16, h = 16, dx = BALL_SPEED, dy = BALL_SPEED)
{
    const entity = Milque.Entity.spawn().tag(TAG_BALL);
    entity.x = x;
    entity.y = y;
    entity.w = w;
    entity.h = h;
    entity.dx = dx;
    entity.dy = dy;
    entity.color = Milque.Color.randomColor();
    return entity;
}

function TextSuccess(x = 0, y = 0, text = 'Boo', textSize = 16, textAlign = 'center')
{
    const entity = Milque.Entity.spawn();
    entity.x = x;
    entity.y = y;
    entity.text = text;
    entity.textSize = textSize;
    entity.textAlign = textAlign;
    entity.color = '#FFFFFF';
    return entity;
}

function MainScene()
{
    // The first ball
    Ball(Milque.Display.width() / 2, Milque.Display.height() / 2,
        BALL_SIZE, BALL_SIZE,
        Milque.Math.choose(BALL_SPEED_RANGE),
        Milque.Math.choose(BALL_SPEED_RANGE));

    this.textSuccess = TextSuccess(Milque.Display.width() / 2, Milque.Display.height() / 2, 'CORNER BALL!', SUCCESS_SIZE);
    this.successTime = 0;
    this.successBall = null;

    Milque.Game.on('update', () => {
        Milque.Display.clear();

        if (this.successTime > 0)
        {
            --this.successTime;

            // Flash text color
            this.textSuccess.color = Milque.Color.randomColor();

            const scale = Math.abs(Math.sin(this.successTime / 10)) * this.textSuccess.textSize;
            ctx.font = scale + 'px monospace';
            ctx.textAlign = this.textSuccess.textAlign;
            ctx.textBaseline = 'middle';
            ctx.fillStyle = this.textSuccess.color;
            ctx.fillText(this.textSuccess.text, this.textSuccess.x, this.textSuccess.y);

            // Flash ball color
            for(const ball of Milque.Entity.entities(TAG_BALL))
            {
                ball.color = Milque.Color.randomColor();
            }
        }

        for(const ball of Milque.Entity.entities(TAG_BALL))
        {
            ball.x += ball.dx;
            ball.y += ball.dy;

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
                this.successTime = MAX_SUCCESS_TIME;
            }
            else if (xFlag || yFlag)
            {
                // Change color on wall hit.
                ball.color = Milque.Color.randomColor();
            }

            ctx.fillStyle = ball.color;
            ctx.fillRect(ball.x - ball.w / 2, ball.y - ball.h / 2, ball.w, ball.h);
        }
    });
}

// TODO: This should be called automatically in the future...
MainScene();

Milque.Game.start();