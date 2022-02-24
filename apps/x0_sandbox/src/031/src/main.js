import '@milque/display';
import '@milque/input';
import { Random, SimpleRandomGenerator } from '@milque/random';

window.addEventListener('DOMContentLoaded', main);

const INPUT_MAP = {
    MoveLeft: [ 'Keyboard:ArrowLeft', 'Keyboard:KeyA' ],
    MoveRight: [ 'Keyboard:ArrowRight', 'Keyboard:KeyD' ],
    MoveUp: [ 'Keyboard:ArrowUp', 'Keyboard:KeyW' ],
    MoveDown: [ 'Keyboard:ArrowDown', 'Keyboard:KeyS' ],
    Evade: { key: 'Keyboard:Space', event: 'down' },
};
const DISPLAY_WIDTH = 640;
const DISPLAY_HEIGHT = 480;
const CENTER_X = DISPLAY_WIDTH / 2;
const CENTER_Y = DISPLAY_HEIGHT / 2;

const HALF_PI = Math.PI / 2;
const QUARTER_PI = Math.PI / 4;

async function main()
{
    /** @type {import('@milque/display').DisplayPort} */
    const display = document.querySelector('#main');
    display.width = DISPLAY_WIDTH;
    display.height = DISPLAY_HEIGHT;
    const input = document.querySelector('input-context');
    input.src = INPUT_MAP;

    const ctx = display.canvas.getContext('2d');

    let player = createPlayer();
    Rocks.spawn(...ROCK_SPAWN_RANGE);

    display.addEventListener('frame', ({ detail: { deltaTime: dt }}) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, DISPLAY_WIDTH, DISPLAY_HEIGHT);

        Tracks.updateAll(dt);
        Rocks.updateAll(dt);
        updatePlayer(player, input);

        Tracks.drawAll(ctx);
        Rocks.drawAll(ctx);
        drawPlayer(player, ctx);
    });
}

/************************************************ PLAYERS */

const MAX_EVADE_TIME = 10;

function createPlayer()
{
    return {
        motionX: 0,
        motionY: 0,
        x: CENTER_X,
        y: CENTER_Y,
        rotation: 0,
        distanceSteppedSqu: 0,
        state: 0,
        evadeTimer: 0,
    };
}

function updatePlayer(player, input)
{
    const FRICTION = 0.3;
    const INV_FRICTION = 1 - FRICTION;

    let moveSpeed = 1;

    let dx = input.getInputValue('MoveRight') - input.getInputValue('MoveLeft');
    let dy = input.getInputValue('MoveDown') - input.getInputValue('MoveUp');
    let evade = input.getInputValue('Evade');

    switch(player.state)
    {
        case 0:
            if (evade)
            {
                player.state = 1;
            }
            else if (dx || dy)
            {
                let dr = Math.atan2(dy, dx);
            
                let rx = Math.cos(dr);
                let ry = Math.sin(dr);
            
                player.motionX += rx * moveSpeed;
                player.motionY += ry * moveSpeed;
                player.rotation = dr;
            }
            break;
        case 1:
            if (player.evadeTimer > MAX_EVADE_TIME)
            {
                player.state = 0;
                player.evadeTimer = 0;
            }
            else
            {
                const EVADE_SPEED = 12;
                let rx = Math.cos(player.rotation);
                let ry = Math.sin(player.rotation);
                player.motionX = rx * EVADE_SPEED;
                player.motionY = ry * EVADE_SPEED;
                player.evadeTimer += 1;
            }
            break;
        default:
            player.state = 0;
    }

    player.motionX *= INV_FRICTION;
    player.motionY *= INV_FRICTION;

    player.x += player.motionX;
    player.y += player.motionY;

    player.distanceSteppedSqu += player.motionX * player.motionX + player.motionY * player.motionY;
    
    if (player.distanceSteppedSqu > 32)
    {
        new Tracks(player.x, player.y, player.rotation - HALF_PI);
        player.distanceSteppedSqu = 0;
    }
}

const PLAYER_RADIUS = 8;
const PLAYER_DIAMETER = PLAYER_RADIUS * 2;
function drawPlayer(player, ctx)
{
    let x = Math.trunc(player.x);
    let y = Math.trunc(player.y);
    let r = player.rotation;
    ctx.translate(x, y);
    {
        ctx.rotate(r);
        {
            ctx.translate(-PLAYER_RADIUS, -PLAYER_RADIUS);
            {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, PLAYER_DIAMETER, PLAYER_DIAMETER);

                ctx.beginPath();
                ctx.moveTo(PLAYER_DIAMETER + 8, PLAYER_RADIUS);
                ctx.lineTo(PLAYER_DIAMETER + 2, PLAYER_RADIUS - 6);
                ctx.lineTo(PLAYER_DIAMETER + 2, PLAYER_RADIUS + 6);
                ctx.fill();

                // Sprinting
                if (player.state === 1)
                {
                    let x = PLAYER_DIAMETER + 6;
                    let y = -3;
                    ctx.translate(x, y);
                    ctx.rotate(QUARTER_PI);
                    ctx.fillRect(0, 0, 16, 3);
                    ctx.fillRect(16 - 3, 0, 3, 16);
                    ctx.rotate(-QUARTER_PI);
                    ctx.translate(-x, -y);
                }

                ctx.fillStyle = '#000000';
                ctx.fillRect(PLAYER_DIAMETER - 4, 4, 4, PLAYER_DIAMETER - 8);
                ctx.fillRect(3, 3, 3, 3);
                ctx.fillRect(7, 3, 3, 3);
            }
            ctx.translate(PLAYER_RADIUS, PLAYER_RADIUS);
        }
        ctx.rotate(-r);
    }
    ctx.translate(-x, -y);
}

/************************************************ ENTITIES */

class Entities
{
    static get entities()
    {
        let result = [];
        Object.defineProperty(this, 'entities', { value: result });
        return result;
    }

    static updateAll(dt)
    {
        for(let entity of this.entities)
        {
            if (entity.dead)
            {
                Entities.delete(entity);
            }
            else
            {
                entity.update(dt);
            }
        }
    }

    static drawAll(ctx)
    {
        for(let entity of this.entities)
        {
            entity.draw(ctx);
        }
    }

    static add(entity)
    {
        this.entities.push(entity);
    }

    static delete(entity)
    {
        let entities = this.entities;
        let i = entities.indexOf(entity);
        if (i >= 0)
        {
            entities.splice(i, 1);
            entity.destroy();
        }
    }

    constructor()
    {
        this.constructor.add(this);
        this.dead = false;
    }

    destroy() {}
    update(dt) {}
    draw(ctx) {}
}


/************************************************ ROCKS */

const ROCK_RADIUS = 20;
const ROCK_RANDOM = new Random(new SimpleRandomGenerator());
const ROCK_SPAWN_RANGE = [32, 32, DISPLAY_WIDTH - 32, DISPLAY_HEIGHT - 32];

class Rocks extends Entities
{
    static spawn(minX, minY, maxX, maxY)
    {
        let x = Random.range(minX, maxX);
        let y = Random.range(minY, maxY);
        return new Rocks(x, y);
    }

    constructor(x, y, size = ROCK_RADIUS)
    {
        super();

        this.x = x;
        this.y = y;
        this.size = size;
    }

    /** @override */
    draw(ctx)
    {
        ROCK_RANDOM.generator.seed = this.x << 16  + this.y;

        let size = this.size + Math.trunc(ROCK_RANDOM.range(-2, 2));
        let halfSize = size / 2;
        let x = Math.trunc(this.x - halfSize);
        let y = Math.trunc(this.y - halfSize);

        ctx.translate(x, y);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, halfSize * 2, halfSize * 2);
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(2, 2, halfSize * 2 - 4, halfSize * 2 - 4);

        ctx.fillStyle = '#FFFFFF';
        let i = Math.trunc(ROCK_RANDOM.range(2, 4));
        let j = Math.trunc(ROCK_RANDOM.range(2, 4));
        let k = Math.trunc(ROCK_RANDOM.range(2, 4));
        ctx.fillRect(halfSize * 2 - 4 - i, 4, i, 4);
        ctx.fillRect(halfSize * 2 - 4 - j, 10, j, k);
        ctx.translate(-x, -y);
    }
}

/************************************************ PARTICLES */

class RockParticles extends Entities
{
    constructor(x, y)
    {
        super();
        
        this.x = x;
        this.y = y;
        this.age = 100;
    }

    /** @override */
    update(dt)
    {
        this.age -= 1;
    }

    draw()
    {

    }
}

/************************************************ TRACKS */

const TRACK_WIDTH = PLAYER_DIAMETER - 4;
const TRACK_HEIGHT = 4;
const MAX_TRACK_AGE = 100;

class Tracks extends Entities
{
    constructor(x, y, rotation)
    {
        super();

        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.age = MAX_TRACK_AGE;
    }

    /** @override */
    update(dt)
    {
        this.age -= 1;
        if (this.age <= 0)
        {
            this.dead = true;
        }
    }

    /** @override */
    draw(ctx)
    {
        let opacity = Math.min(this.age / (MAX_TRACK_AGE * 0.5), 0.6);
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fillRect(-TRACK_WIDTH / 2, -TRACK_HEIGHT / 2, TRACK_WIDTH, TRACK_HEIGHT);
        ctx.rotate(-this.rotation);
        ctx.translate(-this.x, -this.y);
    }
}
