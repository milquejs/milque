const game = {
    rooms: {
        main: {
            roomWidth: 300,
            roomHeight: 300,
            views: [
                { viewX: 0, viewY: 0, viewWidth: 300, viewHeight: 300 },
            ],
            instances: [
                { x: 150, y: 150, object: 'ball' },
                { x: 0, y: 150, object: 'playerPaddle' },
                { x: 300, y: 150, object: 'otherPaddle' },
            ],
        }
    },
    objects: {
        ball: {
            state: {
                moveSpeed: 1,
            },
            sprite: 'ball',
        },
        playerPaddle: {
            sprite: 'paddle',
        },
        otherPaddle: {
            sprite: 'paddle',
        }
    },
    sprites: {
        ball: {
            src: 'ball.png',
            spriteOffsetX: 0,
            spriteOffsetY: 0,
        },
        paddle: {
            src: 'paddle.png',
            spriteOffsetX: 0,
            spriteOffsetY: 0,
        },
    },
};
