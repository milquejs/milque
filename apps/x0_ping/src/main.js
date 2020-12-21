import '@milque/display';
import '@milque/input';

window.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('#main');
    const input = document.querySelector('#mainInput');
    const ctx = display.canvas.getContext('2d');

    const localPaddle = createPaddle(-100);
    const remotePaddle = createPaddle(100);
    remotePaddle.angle = Math.PI;
    const paddles = [
        localPaddle,
        remotePaddle,
    ];

    const ball = createBall();
    const balls = [
        ball,
    ];
    
    display.addEventListener('frame', ({ deltaTime }) => {
        input.source.poll();

        const displayWidth = display.width;
        const displayHeight = display.height;
        const halfDisplayWidth = displayWidth / 2;
        const halfDisplayHeight = displayHeight / 2;

        const MoveX = input.context.getInputValue('MoveX');
        const MoveY = input.context.getInputValue('MoveY');

        localPaddle.prevY = localPaddle.y;
        localPaddle.nextY = Math.floor(MoveY * displayHeight - halfDisplayHeight);
        localPaddle.y += (localPaddle.nextY - localPaddle.y) * 0.3;

        if (localPaddle.y <= -halfDisplayHeight) localPaddle.y = -halfDisplayHeight;
        if (localPaddle.y >= halfDisplayHeight) localPaddle.y = halfDisplayHeight;

        for(let ball of balls)
        {
            ball.x += ball.dx;
            ball.y += ball.dy;

            if (ball.x <= -halfDisplayWidth)
            {
                ball.x = -halfDisplayWidth;
                ball.dx = -ball.dx;

                makeScore(ball, remotePaddle);
            }
            else if (ball.x >= halfDisplayWidth)
            {
                ball.x = halfDisplayWidth;
                ball.dx = -ball.dx;

                makeScore(ball, localPaddle);
            }

            if (ball.y <= -halfDisplayHeight)
            {
                ball.y = -halfDisplayHeight;
                ball.dy = -ball.dy;
            }
            else if (ball.y >= halfDisplayHeight)
            {
                ball.y = halfDisplayHeight;
                ball.dy = -ball.dy;
            }

            for(let paddle of paddles)
            {
                if (intersectRect(
                    paddle.x, paddle.y,
                    PADDLE_THICKNESS, PADDLE_LENGTH,
                    ball.x, ball.y,
                    BALL_SIZE, BALL_SIZE))
                {
                    let dy = (paddle.y - paddle.prevY) * 0.1;
                    let sign = Math.sign(ball.x - paddle.x);
                    ball.x = paddle.x - (PADDLE_THICKNESS + 2) * Math.sign(ball.dx);
                    ball.dx = Math.abs(ball.dx) * sign;
                    ball.dy += dy;
                }
            }

            if (Math.abs(ball.dx) > MAX_BALL_SPEED)
            {
                ball.dx = Math.sign(ball.dx) * MAX_BALL_SPEED;
            }
            if (Math.abs(ball.dy) > MAX_BALL_SPEED)
            {
                ball.dy = Math.sign(ball.dy) * MAX_BALL_SPEED;
            }
        }

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, displayWidth, displayHeight);

        ctx.translate(halfDisplayWidth, halfDisplayHeight);
        for(let paddle of paddles)
        {
            renderPaddle(ctx, paddle);
        }
        for(let ball of balls)
        {
            renderBall(ctx, ball);
        }
        ctx.translate(-halfDisplayWidth, -halfDisplayHeight);
    });
}

function makeScore(ball, paddle)
{
    ball.x = 0;
    ball.y = 0;
    ball.dx = MAX_BALL_SPEED * Math.sign(paddle.x);
    ball.dy = (Math.random() - 0.5) * MAX_BALL_SPEED;
    paddle.score += 1;
}

const PADDLE_THICKNESS = 4;
const HALF_PADDLE_THICKNESS = PADDLE_THICKNESS / 2;
const PADDLE_LENGTH = 10;
const HALF_PADDLE_LENGTH = PADDLE_LENGTH / 2;

function createPaddle(x = 0, y = 0)
{
    return {
        x, y,
        nextX: 0,
        nextY: 0,
        prevX: 0,
        prevY: 0,
        angle: 0,
        score: 0,
        color: '#FFFFFF',
    };
}

function renderPaddle(ctx, paddle)
{
    ctx.translate(paddle.x, paddle.y);
    {
        ctx.rotate(paddle.angle);
        ctx.fillStyle = paddle.color;
        ctx.fillRect(
            -HALF_PADDLE_THICKNESS, -HALF_PADDLE_LENGTH,
            PADDLE_THICKNESS, PADDLE_LENGTH);
        ctx.rotate(Math.PI / 2);
        ctx.fillText(paddle.score, -HALF_PADDLE_LENGTH / 2, PADDLE_LENGTH);
        ctx.rotate(-Math.PI / 2);
        ctx.rotate(-paddle.angle);
    }
    ctx.translate(-paddle.x, -paddle.y);
}

const BALL_SIZE = 8;
const HALF_BALL_SIZE = BALL_SIZE / 2;

const MAX_BALL_SPEED = 2;

function createBall(x = 0, y = 0)
{
    return {
        x, y,
        dx: 1,
        dy: 0,
    };
}

function renderBall(ctx, ball)
{
    ctx.translate(ball.x, ball.y);
    {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(
            -HALF_BALL_SIZE, -HALF_BALL_SIZE,
            BALL_SIZE, BALL_SIZE);
    }
    ctx.translate(-ball.x, -ball.y);
}

function intersectRect(ax, ay, aw, ah, bx, by, bw, bh)
{
    return (Math.abs(ax - bx) * 2 < (aw + bw))
        && (Math.abs(ay - by) * 2 < (ah + bh));
}
