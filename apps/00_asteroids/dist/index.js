(function () {
    'use strict';

    const MODE_NOSCALE = 'noscale';
    const MODE_CENTER = 'center';
    const MODE_FIT = 'fit';
    const MODE_STRETCH = 'stretch';

    const DEFAULT_MODE = MODE_NOSCALE;
    const DEFAULT_WIDTH = 300;
    const DEFAULT_HEIGHT = 150;

    const INNER_HTML = `
<div class="container">
    <label class="hidden" id="title">display-port</label>
    <label class="hidden" id="fps">00</label>
    <label class="hidden" id="dimension">0x0</label>
    <canvas></canvas>
    <slot></slot>
</div>`;
    const INNER_STYLE = `
:host {
    display: inline-block;
    color: #555555;
}
.container {
    display: flex;
    position: relative;
    width: 100%;
    height: 100%;
}
canvas {
    background: #000000;
    margin: auto;
    image-rendering: pixelated;
}
label {
    font-family: monospace;
    color: currentColor;
    position: absolute;
}
#title {
    left: 0.5rem;
    top: 0.5rem;
}
#fps {
    right: 0.5rem;
    top: 0.5rem;
}
#dimension {
    left: 0.5rem;
    bottom: 0.5rem;
}
.hidden {
    display: none;
}
:host([debug]) .container {
    outline: 6px dashed rgba(0, 0, 0, 0.1);
    outline-offset: -4px;
    background-color: rgba(0, 0, 0, 0.1);
}
:host([mode="${MODE_NOSCALE}"]) canvas {
    margin: 0;
    top: 0;
    left: 0;
}
:host([mode="${MODE_FIT}"]), :host([mode="${MODE_CENTER}"]), :host([mode="${MODE_STRETCH}"]) {
    width: 100%;
    height: 100%;
}
:host([full]) {
    width: 100vw!important;
    height: 100vh!important;
}
:host([disabled]) {
    display: none;
}
slot {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    pointer-events: none;
}
::slotted(*) {
    pointer-events: auto;
}`;

    const TEMPLATE_KEY = Symbol('template');
    const STYLE_KEY = Symbol('style');

    /**
     * @version 1.2.2
     * @description
     * # Changelog
     * ## 1.2.2
     * - Removed 'contexttype'
     * ## 1.2.1
     * - Added 'contexttype' for getContext()
     * ## 1.2.0
     * - Moved template creation to static time
     * - Removed default export
     * ## 1.1.2
     * - Added clear()
     * - Added delta time for frame events
     * ## 1.1.1
     * - Added onframe and onresize attribute callbacks
     * - Added "stretch" mode
     * ## 1.1.0
     * - Changed "topleft" to "noscale"
     * - Changed default size to 640 x 480
     * - Changed "center" and "fit" to fill container instead of viewport
     * - Added "full" property to override and fill viewport
     * ## 1.0.2
     * - Moved default values to the top
     * ## 1.0.1
     * - Fixed scaling issues when dimensions do not match
     * ## 1.0.0
     * - Created DisplayPort
     * 
     * @fires frame Every time a new frame is rendered.
     * @fires resize When the display is resized.
     */
    class DisplayPort extends HTMLElement
    {
        static get [TEMPLATE_KEY]()
        {
            let template = document.createElement('template');
            template.innerHTML = INNER_HTML;
            Object.defineProperty(this, TEMPLATE_KEY, { value: template });
            return template;
        }

        static get [STYLE_KEY]()
        {
            let style = document.createElement('style');
            style.innerHTML = INNER_STYLE;
            Object.defineProperty(this, STYLE_KEY, { value: style });
            return style;
        }

        /** @override */
        static get observedAttributes()
        {
            return [
                'width',
                'height',
                'disabled',
                // Event handlers...
                'onframe',
                /*
                // NOTE: Already handled by GlobalEventHandlers...
                'onresize',
                */
                // NOTE: For debuggin purposes...
                'debug',
                // ...listening for built-in attribs...
                'id',
                'class',
            ];
        }

        constructor()
        {
            super();

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(this.constructor[TEMPLATE_KEY].content.cloneNode(true));
            this.shadowRoot.appendChild(this.constructor[STYLE_KEY].cloneNode(true));

            this._canvasElement = this.shadowRoot.querySelector('canvas');

            this._titleElement = this.shadowRoot.querySelector('#title');
            this._fpsElement = this.shadowRoot.querySelector('#fps');
            this._dimensionElement = this.shadowRoot.querySelector('#dimension');

            this._animationRequestHandle = 0;
            this._prevAnimationFrameTime = 0;

            this._width = DEFAULT_WIDTH;
            this._height = DEFAULT_HEIGHT;

            this._onframe = null;
            /*
            // NOTE: Already handled by GlobalEventHandlers...
            this._onresize = null;
            */

            this.update = this.update.bind(this);
        }

        get canvas() { return this._canvasElement; }
        
        /** @override */
        connectedCallback()
        {
            if (!this.hasAttribute('mode')) this.mode = DEFAULT_MODE;
            
            // Allows this element to be focusable
            if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', 0);

            this.updateCanvasSize();
            this.resume();
        }

        /** @override */
        disconnectedCallback()
        {
            this.pause();
        } 

        /** @override */
        attributeChangedCallback(attribute, prev, value)
        {
            switch(attribute)
            {
                case 'width':
                    this._width = value;
                    break;
                case 'height':
                    this._height = value;
                    break;
                case 'disabled':
                    if (value)
                    {
                        this.update(0);
                        this.pause();
                    }
                    else
                    {
                        this.resume();
                    }
                    break;
                // Event handlers...
                case 'onframe':
                    this.onframe = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                    break;
                /*
                // NOTE: Already handled by GlobalEventHandlers...
                case 'onresize':
                    this.onresize = new Function('event', `with(document){with(this){${value}}}`).bind(this);
                    break;
                */
                // NOTE: For debugging purposes...
                case 'id':
                case 'class':
                    this._titleElement.innerHTML = `display-port${this.className ? '.' + this.className : ''}${this.hasAttribute('id') ? '#' + this.getAttribute('id') : ''}`;
                    break;
                case 'debug':
                    this._titleElement.classList.toggle('hidden', value);
                    this._fpsElement.classList.toggle('hidden', value);
                    this._dimensionElement.classList.toggle('hidden', value);
                    break;
            }
        }

        update(now)
        {
            this._animationRequestHandle = requestAnimationFrame(this.update);

            this.updateCanvasSize();
            const deltaTime = now - this._prevAnimationFrameTime;
            this._prevAnimationFrameTime = now;

            // NOTE: For debugging purposes...
            if (this.debug)
            {
                // Update FPS...
                const frames = deltaTime <= 0 ? '--' : String(Math.round(1000 / deltaTime)).padStart(2, '0');
                if (this._fpsElement.innerText !== frames)
                {
                    this._fpsElement.innerText = frames;
                }

                // Update dimensions...
                if (this.mode === MODE_NOSCALE)
                {
                    let result = `${this._width}x${this._height}`;
                    if (this._dimensionElement.innerText !== result)
                    {
                        this._dimensionElement.innerText = result;
                    }
                }
                else
                {
                    let result = `${this._width}x${this._height}|${this.shadowRoot.host.clientWidth}x${this.shadowRoot.host.clientHeight}`;
                    if (this._dimensionElement.innerText !== result)
                    {
                        this._dimensionElement.innerText = result;
                    }
                }
            }

            this.dispatchEvent(new CustomEvent('frame', {
                detail: {
                    now,
                    prevTime: this._prevAnimationFrameTime,
                    deltaTime: deltaTime,
                    canvas: this._canvasElement,
                    /** @deprecated */
                    get context() { let ctx = this.canvas.getContext('2d'); ctx.imageSmoothingEnabled = false; return ctx; },
                },
                bubbles: false,
                composed: true
            }));
        }

        pause()
        {
            cancelAnimationFrame(this._animationRequestHandle);
        }

        resume()
        {
            this._animationRequestHandle = requestAnimationFrame(this.update);
        }
        
        updateCanvasSize()
        {
            let clientRect = this.shadowRoot.host.getBoundingClientRect();
            const clientWidth = clientRect.width;
            const clientHeight = clientRect.height;

            let canvas = this._canvasElement;
            let canvasWidth = this._width;
            let canvasHeight = this._height;

            const mode = this.mode;

            if (mode === MODE_STRETCH)
            {
                canvasWidth = clientWidth;
                canvasHeight = clientHeight;
            }
            else if (mode !== MODE_NOSCALE)
            {
                let flag = clientWidth < canvasWidth || clientHeight < canvasHeight || mode === MODE_FIT;
                if (flag)
                {
                    let ratioX = clientWidth / canvasWidth;
                    let ratioY = clientHeight / canvasHeight;

                    if (ratioX < ratioY)
                    {
                        canvasWidth = clientWidth;
                        canvasHeight = canvasHeight * ratioX;
                    }
                    else
                    {
                        canvasWidth = canvasWidth * ratioY;
                        canvasHeight = clientHeight;
                    }
                }
            }

            canvasWidth = Math.floor(canvasWidth);
            canvasHeight = Math.floor(canvasHeight);

            if (canvas.clientWidth !== canvasWidth || canvas.clientHeight !== canvasHeight)
            {
                canvas.width = this._width;
                canvas.height = this._height;
                canvas.style = `width: ${canvasWidth}px; height: ${canvasHeight}px`;
                this.dispatchEvent(new CustomEvent('resize', { detail: { width: canvasWidth, height: canvasHeight }, bubbles: false, composed: true }));
            }
        }

        /*
        // NOTE: Already handled by GlobalEventHandlers...
        get onresize() { return this._onresize; }
        set onresize(value)
        {
            if (this._onresize) this.removeEventListener('resize', this._onresize);
            this._onresize = value;
            if (this._onresize) this.addEventListener('resize', value);
        }
        */

        get onframe() { return this._onframe; }
        set onframe(value)
        {
            if (this._onframe) this.removeEventListener('frame', this._onframe);
            this._onframe = value;
            if (this._onframe) this.addEventListener('frame', value);
        }

        get width() { return this._width; }
        set width(value) { this.setAttribute('width', value); }

        get height() { return this._height; }
        set height(value) { this.setAttribute('height', value); }

        get mode() { return this.getAttribute('mode'); }
        set mode(value) { this.setAttribute('mode', value); }

        get disabled() { return this.hasAttribute('disabled'); }
        set disabled(value) { if (value) this.setAttribute('disabled', ''); else this.removeAttribute('disabled'); }

        // NOTE: For debugging purposes...
        get debug() { return this.hasAttribute('debug'); }
        set debug(value) { if (value) this.setAttribute('debug', ''); else this.removeAttribute('debug'); }
    }
    window.customElements.define('display-port', DisplayPort);

    class RandomGenerator
    {
        /** @abstract */
        next() { return Math.random(); }
    }

    let RAND;

    class Random
    {
        constructor(randomGenerator = new RandomGenerator())
        {
            this.generator = randomGenerator;
        }

        static next() { return RAND.next(); }
        next()
        {
            return this.generator.next();
        }

        static choose(list) { return RAND.choose(list); }
        choose(list)
        {
            return list[Math.floor(this.generator.next() * list.length)];
        }

        static range(min, max) { return RAND.range(min, max); }
        range(min, max)
        {
            return ((max - min) * this.generator.next()) + min;
        }
        
        static sign() { return RAND.sign(); }
        sign()
        {
            return this.generator.next() < 0.5 ? -1 : 1;
        }
    }

    RAND = new Random();

    /**
     * What I learned:
     * - I need access to the current bound canvas, wherever this object
     * is being used.
     * - I should implement all things related to Starfield in here and
     * just expose an interface for the engine to connect to.
     */

    const STAR_SIZE_RANGE = [2, 4];
    const STAR_SPEED_RANGE = [0.3, 1];
    const STAR_PARTICLE_COUNT = 30;

    function createStarfield(width, height)
    {
        let result = {
            x: [],
            y: [],
            size: [],
            speed: [],
            length: 0,
            width,
            height,
        };
        for(let i = 0; i < STAR_PARTICLE_COUNT; ++i)
        {
            result.x.push(Random.range(0, width));
            result.y.push(Random.range(0, height));
            result.size.push(Random.range(...STAR_SIZE_RANGE));
            result.speed.push(Random.range(...STAR_SPEED_RANGE));
            result.length++;
        }
        return result;
    }

    function renderStarfield(ctx, starfield, color = 'white')
    {
        for(let i = 0; i < starfield.length; ++i)
        {
            let x = starfield.x[i];
            let y = starfield.y[i];
            let size = starfield.size[i];

            let halfSize = size / 2;
            ctx.fillStyle = color;
            ctx.fillRect(x - halfSize, y - halfSize, size, size);
        }
    }

    function updateStarfield(starfield, dx = 1, dy = 0)
    {
        const { length, width, height } = starfield;
        
        for(let i = 0; i < length; ++i)
        {
            let ddx = dx * starfield.speed[i];
            let ddy = dy * starfield.speed[i];
            
            starfield.x[i] += ddx;
            starfield.y[i] += ddy;

            if (ddx < 0)
            {
                if (starfield.x[i] < 0)
                {
                    starfield.x[i] = width;
                    starfield.y[i] = Random.range(0, height);
                }
            }
            else if (ddx > 0)
            {
                if (starfield.x[i] > width)
                {
                    starfield.x[i] = 0;
                    starfield.y[i] = Random.range(0, height);
                }
            }

            if (ddy < 0)
            {
                if (starfield.y[i] < 0)
                {
                    starfield.x[i] = Random.range(0, width);
                    starfield.y[i] = height;
                }
            }
            else if (ddy > 0)
            {
                if (starfield.y[i] > height)
                {
                    starfield.x[i] = Random.range(0, width);
                    starfield.y[i] = 0;
                }
            }
        }
    }

    const display = document.querySelector('display-port');
    const canvas = display.canvas;
    const ctx = canvas.getContext('2d');

    // Will be initialized on load().
    let audioContext = new AudioContext();
    let sounds;

    let prevFrameTime = 0;
    let mainScene = { load, start, update, render };

    function main()
    {
        mainScene.load().then(() => {
            mainScene.start();
            run(prevFrameTime = performance.now());
        });
    }

    function run(now)
    {
        requestAnimationFrame(run);
        const dt = now - prevFrameTime;
        prevFrameTime = now;
        mainScene.update(dt);
        mainScene.render(ctx);
    }

    const PLAYER_RADIUS = 5;
    const SMALL_ASTEROID_RADIUS = 4;
    const ASTEROID_RADIUS = 8;
    const ASTEROID_SPAWN_RANGES = [
        [-ASTEROID_RADIUS, -ASTEROID_RADIUS, ASTEROID_RADIUS * 2 + canvas.width, ASTEROID_RADIUS],
        [-ASTEROID_RADIUS, 0, ASTEROID_RADIUS, canvas.height],
        [-ASTEROID_RADIUS, canvas.height, ASTEROID_RADIUS * 2 + canvas.width, ASTEROID_RADIUS],
        [canvas.width, 0, ASTEROID_RADIUS, canvas.height],
    ];
    const ASTEROID_SPAWN_RATE = [3000, 10000];
    const ASTEROID_SPAWN_INIT_COUNT = 1;
    const MAX_ASTEROID_COUNT = 100;
    const ASTEROID_SPEED = 1;
    const BULLET_RADIUS = 2;
    const BULLET_SPEED = 4;
    const MAX_BULLET_AGE = 2000;
    const MAX_BULLET_COUNT = 100;
    const PLAYER_SHOOT_COOLDOWN = 10;
    const PARTICLE_RADIUS = 4;
    const PARTICLE_SPEED = 2;
    const MAX_PARTICLE_AGE = 600;
    const ASTEROID_BREAK_DAMP_FACTOR = 0.1;
    const PLAYER_EXPLODE_PARTICLE_COLORS = [ 'red', 'red', 'red', 'yellow', 'orange' ];
    const ASTEROID_EXPLODE_PARTICLE_COLORS = [ 'blue', 'blue', 'blue', 'dodgerblue', 'gray', 'darkgray', 'yellow' ];
    const PLAYER_MOVE_PARTICLE_COLORS = [ 'gray', 'darkgray', 'lightgray' ];
    const INSTRUCTION_HINT_TEXT = '[ wasd_ ]';
    const PLAYER_MOVE_PARTICLE_OFFSET_RANGE = [-2, 2];
    const PLAYER_MOVE_PARTICLE_DAMP_FACTOR = 1.5;
    const MIN_PLAYER_MOVE_PARTICLE_LIFE_RATIO = 0.1;
    const MAX_PLAYER_MOVE_PARTICLE_LIFE_RATIO = 0.4;
    const FLASH_TIME_STEP = 0.1;

    const PLAYER_MOVE_SPEED = 0.02;
    const PLAYER_ROT_SPEED = 0.008;
    const PLAYER_ROT_FRICTION = 0.1;
    const PLAYER_MOVE_FRICTION = 0.001;

    const BULLET_COLOR = 'gold';
    const POWER_UP_RADIUS = 4;
    const POWER_UP_EXPLODE_PARTICLE_COLORS = [ 'violet', 'white', 'violet' ];
    const POWER_UP_AMOUNT = 30;
    const POWER_UP_SPAWN_CHANCE = 0.7;

    let SHOW_COLLISION = false;

    async function load()
    {
        const assetsDir = '';
        sounds = {
            start: createSound(assetsDir + 'space/start.wav'),
            dead: createSound(assetsDir + 'space/dead.wav'),
            pop: createSound(assetsDir + 'space/boop.wav'),
            music: createSound(assetsDir + 'space/music.wav', true),
            shoot: createSound(assetsDir + 'space/click.wav'),
            boom: createSound(assetsDir + 'space/boom.wav'),
        };
    }

    function start()
    {
        this.level = 0;
        this.score = 0;
        this.highScore = Number(localStorage.getItem('highscore'));
        this.flashScoreDelta = 0;
        this.flashHighScoreDelta = 0;
        this.flashShootDelta = 0;

        this.player = {
            scene: this,
            x: canvas.width / 2,
            y: canvas.height / 2,
            rotation: 0,
            dx: 0,
            dy: 0,
            dr: 0,
            left: 0,
            right: 0,
            up: 0,
            down: 0,
            cooldown: 0,
            powerMode: 0,
            shoot()
            {
                if (this.scene.bullets.length > MAX_BULLET_COUNT) return;
                if (this.cooldown > 0) return;
                if (this.powerMode > 0)
                {
                    for(let i = -1; i <= 1; ++i)
                    {
                        let rotation = this.rotation + i * Math.PI / 4;
                        let bullet = createBullet(
                            this.scene,
                            this.x - Math.cos(rotation) * PLAYER_RADIUS,
                            this.y - Math.sin(rotation) * PLAYER_RADIUS,
                            -Math.cos(rotation) * BULLET_SPEED + this.dx,
                            -Math.sin(rotation) * BULLET_SPEED + this.dy
                        );
                        this.scene.bullets.push(bullet);
                    }
                    --this.powerMode;
                }
                else
                {
                    let bullet = createBullet(
                        this.scene,
                        this.x - Math.cos(this.rotation) * PLAYER_RADIUS,
                        this.y - Math.sin(this.rotation) * PLAYER_RADIUS,
                        -Math.cos(this.rotation) * BULLET_SPEED + this.dx,
                        -Math.sin(this.rotation) * BULLET_SPEED + this.dy
                    );
                    this.scene.bullets.push(bullet);
                }
                this.cooldown = PLAYER_SHOOT_COOLDOWN;
                sounds.shoot.play();
            }
        };

        this.asteroids = [];
        this.asteroidSpawner = {
            scene: this,
            spawnTicks: ASTEROID_SPAWN_RATE[1],
            reset()
            {
                this.spawnTicks = ASTEROID_SPAWN_RATE[1];
            },
            spawn()
            {
                if (this.scene.asteroids.length > MAX_ASTEROID_COUNT) return;
                let spawnRange = Random.choose(ASTEROID_SPAWN_RANGES);
                let asteroid = createAsteroid(
                    this.scene,
                    // X range
                    Random.range(spawnRange[0], spawnRange[0] + spawnRange[2]),
                    // Y range
                    Random.range(spawnRange[1], spawnRange[1] + spawnRange[3]),
                    Random.range(-ASTEROID_SPEED, ASTEROID_SPEED),
                    Random.range(-ASTEROID_SPEED, ASTEROID_SPEED),
                    ASTEROID_RADIUS
                );
                this.scene.asteroids.push(asteroid);
            },
            update(dt)
            {
                if (!this.scene.gamePause)
                {
                    this.spawnTicks -= dt;
                    if (this.spawnTicks <= 0)
                    {
                        this.spawn();
                        this.spawnTicks = Random.range(...ASTEROID_SPAWN_RATE);
                    }
                }
            }
        };

        this.bullets = [];
        this.particles = [];

        this.powerUps = [];
        this.powerUpSpawner = {
            scene: this,
            reset()
            {
                // Do nothing.
            },
            spawn()
            {
                let spawnRange = Random.choose(ASTEROID_SPAWN_RANGES);
                let powerUp = createPowerUp(
                    this.scene,
                    // X range
                    Random.range(spawnRange[0], spawnRange[0] + spawnRange[2]),
                    // Y range
                    Random.range(spawnRange[1], spawnRange[1] + spawnRange[3]),
                    Random.range(-ASTEROID_SPEED, ASTEROID_SPEED),
                    Random.range(-ASTEROID_SPEED, ASTEROID_SPEED)
                );
                this.scene.powerUps.push(powerUp);
            },
            update(dt)
            {
                // Do nothing.
            }
        };

        this.starfield = createStarfield(canvas.width, canvas.height);

        this.gamePause = true;
        this.showPlayer = true;
        this.gameStart = true;
        this.gameWait = true;
        this.hint = INSTRUCTION_HINT_TEXT;

        document.addEventListener('keydown', e => onKeyDown.call(this, e.key));
        document.addEventListener('keyup', e => onKeyUp.call(this, e.key));
    }

    function update(dt)
    {
        if (this.gamePause)
        {
            // Update particle motion
            for(let particle of this.particles)
            {
                particle.age += dt;
                if (particle.age > MAX_PARTICLE_AGE)
                {
                    particle.destroy();
                }
                else
                {
                    particle.x += particle.dx;
                    particle.y += particle.dy;
            
                    // Wrap around
                    wrapAround(particle, PARTICLE_RADIUS * 2, PARTICLE_RADIUS * 2);
                }
            }

            return;
        }

        // Determine control
        const rotControl = this.player.right - this.player.left;
        const moveControl = this.player.down - this.player.up;
        const fireControl = this.player.fire;

        // Calculate velocity
        this.player.dx += moveControl * Math.cos(this.player.rotation) * PLAYER_MOVE_SPEED;
        this.player.dy += moveControl * Math.sin(this.player.rotation) * PLAYER_MOVE_SPEED;
        this.player.dx *= 1 - PLAYER_MOVE_FRICTION;
        this.player.dy *= 1 - PLAYER_MOVE_FRICTION;

        // Calculate angular velocity
        this.player.dr += rotControl * PLAYER_ROT_SPEED;
        this.player.dr *= 1 - PLAYER_ROT_FRICTION;

        // Calculate position
        this.player.x += this.player.dx;
        this.player.y += this.player.dy;
        this.player.rotation += this.player.dr;

        --this.player.cooldown;

        // Wrap around
        wrapAround(this.player, PLAYER_RADIUS * 2, PLAYER_RADIUS * 2);

        // Whether to fire a bullet
        if (fireControl)
        {
            this.player.shoot();
            this.flashShootDelta = 1;
        }

        // Whether to spawn thruster particles
        if (moveControl)
        {
            thrust(this, this.player.x, this.player.y, 
                -moveControl * Math.cos(this.player.rotation) * PLAYER_MOVE_PARTICLE_DAMP_FACTOR,
                -moveControl * Math.sin(this.player.rotation) * PLAYER_MOVE_PARTICLE_DAMP_FACTOR, 
                Random.choose.bind(null, PLAYER_MOVE_PARTICLE_COLORS));
        }

        // Update bullet motion
        for(let bullet of this.bullets)
        {
            bullet.age += dt;
            if (bullet.age > MAX_BULLET_AGE)
            {
                bullet.destroy();
            }
            else
            {
                bullet.x += bullet.dx;
                bullet.y += bullet.dy;
        
                // Wrap around
                wrapAround(bullet, BULLET_RADIUS * 2, BULLET_RADIUS * 2);
            }
        }

        // Update bullet collision
        for(let bullet of this.bullets)
        {
            for(let asteroid of this.asteroids)
            {
                if (withinRadius(bullet, asteroid, asteroid.size))
                {
                    this.flashScore = 1;
                    this.score++;
                    if (this.score > this.highScore)
                    {
                        this.flashHighScore = this.score - this.highScore;
                        this.highScore = this.score;
                        localStorage.setItem('highscore', this.highScore);
                    }
                    explode(this, asteroid.x, asteroid.y, 10, Random.choose.bind(null, ASTEROID_EXPLODE_PARTICLE_COLORS));
                    sounds.pop.play();
                    bullet.destroy();
                    asteroid.breakUp(bullet.dx * ASTEROID_BREAK_DAMP_FACTOR, bullet.dy * ASTEROID_BREAK_DAMP_FACTOR);
                    break;
                }
            }
        }

        // Update particle motion
        for(let particle of this.particles)
        {
            particle.age += dt;
            if (particle.age > MAX_PARTICLE_AGE)
            {
                particle.destroy();
            }
            else
            {
                particle.x += particle.dx;
                particle.y += particle.dy;
        
                // Wrap around
                wrapAround(particle, PARTICLE_RADIUS * 2, PARTICLE_RADIUS * 2);
            }
        }

        // Update asteroid motion
        for(let asteroid of this.asteroids)
        {
            asteroid.x += asteroid.dx;
            asteroid.y += asteroid.dy;

            // Wrap around
            wrapAround(asteroid, asteroid.size * 2, asteroid.size * 2);
        }

        // Update asteroid collision
        for(let asteroid of this.asteroids)
        {
            if (withinRadius(asteroid, this.player, asteroid.size + PLAYER_RADIUS))
            {
                explode(this, asteroid.x, asteroid.y, 10, Random.choose.bind(null, ASTEROID_EXPLODE_PARTICLE_COLORS));
                asteroid.destroy();
                killPlayer(this);
                break;
            }
        }

        // Update power-up motion
        for(let powerUp of this.powerUps)
        {
            powerUp.x += powerUp.dx;
            powerUp.y += powerUp.dy;

            // Wrap around
            wrapAround(powerUp, POWER_UP_RADIUS * 2, POWER_UP_RADIUS * 2);
        }

        // Update power-up collision
        for(let powerUp of this.powerUps)
        {
            if (withinRadius(powerUp, this.player, POWER_UP_RADIUS + PLAYER_RADIUS))
            {
                explode(this, powerUp.x, powerUp.y, 10, Random.choose.bind(null, POWER_UP_EXPLODE_PARTICLE_COLORS));
                powerUp.destroy();
                this.player.powerMode += POWER_UP_AMOUNT;
                break;
            }
        }

        // Update starfield
        updateStarfield(this.starfield);

        // Update spawner
        this.asteroidSpawner.update(dt);
        this.powerUpSpawner.update(dt);

        if (!this.gamePause && this.asteroids.length <= 0)
        {
            this.gamePause = true;
            this.showPlayer = true;
            sounds.start.play();
            setTimeout(() => this.gameWait = true, 1000);
        }
    }

    function render(ctx)
    {
        // Draw background
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw starfield
        renderStarfield(ctx, this.starfield);

        // Draw hint
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '16px sans-serif';
        ctx.fillText(this.hint, canvas.width / 2, canvas.height / 2 - 32);

        // Draw score
        if (this.flashScore > 0)
        {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.flashScore + 0.2})`;
            this.flashScore -= FLASH_TIME_STEP;
        }
        else
        {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        }
        ctx.font = '48px sans-serif';
        ctx.fillText('= ' + String(this.score).padStart(2, '0') + ' =', canvas.width / 2, canvas.height / 2);
        if (this.flashHighScore > 0)
        {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.flashHighScore + 0.2})`;
            this.flashHighScore -= FLASH_TIME_STEP;
        }
        else
        {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        }
        ctx.font = '16px sans-serif';
        ctx.fillText(String(this.highScore).padStart(2, '0'), canvas.width / 2, canvas.height / 2 + 32);

        // Draw timer
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(Math.ceil(this.asteroidSpawner.spawnTicks / 1000), canvas.width, canvas.height - 12);

        // Draw asteroid
        for(let asteroid of this.asteroids)
        {
            ctx.translate(asteroid.x, asteroid.y);
            ctx.rotate(asteroid.rotation);
            ctx.fillStyle = 'slategray';
            ctx.fillRect(-asteroid.size, -asteroid.size, asteroid.size * 2, asteroid.size * 2);
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            drawCollisionCircle(ctx, asteroid.x, asteroid.y, asteroid.size);
        }

        // Draw power-up
        for(let powerUp of this.powerUps)
        {
            ctx.translate(powerUp.x, powerUp.y);
            ctx.rotate(powerUp.rotation);
            ctx.beginPath();
            ctx.strokeStyle = 'violet';
            ctx.arc(0, 0, POWER_UP_RADIUS, 0, Math.PI * 2);
            ctx.moveTo(-POWER_UP_RADIUS / 2, 0);
            ctx.lineTo(POWER_UP_RADIUS / 2, 0);
            ctx.moveTo(0, -POWER_UP_RADIUS / 2);
            ctx.lineTo(0, POWER_UP_RADIUS / 2);
            ctx.stroke();
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            drawCollisionCircle(ctx, powerUp.x, powerUp.y, POWER_UP_RADIUS);
        }

        // Draw bullet
        for(let bullet of this.bullets)
        {
            ctx.translate(bullet.x, bullet.y);
            ctx.rotate(bullet.rotation);
            ctx.fillStyle = BULLET_COLOR;
            ctx.fillRect(-BULLET_RADIUS, -BULLET_RADIUS, BULLET_RADIUS * 4, BULLET_RADIUS * 2);
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            drawCollisionCircle(ctx, bullet.x, bullet.y, BULLET_RADIUS);
        }

        // Draw particle
        for(let particle of this.particles)
        {
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.fillStyle = particle.color;
            let size = PARTICLE_RADIUS * (1 - (particle.age / MAX_PARTICLE_AGE));
            ctx.fillRect(-size, -size, size * 2, size * 2);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        // Draw player
        if (this.showPlayer)
        {
            ctx.translate(this.player.x, this.player.y);
            ctx.rotate(this.player.rotation);
            ctx.fillStyle = 'white';
            let size = PLAYER_RADIUS;
            ctx.fillRect(-size, -size, size * 2, size * 2);
            let xOffset = -1;
            let yOffset = 0;
            let sizeOffset = 0;
            if (this.flashShootDelta > 0)
            {
                ctx.fillStyle = `rgb(${200 * this.flashShootDelta + 55 * Math.sin(performance.now() / (PLAYER_SHOOT_COOLDOWN * 2))}, 0, 0)`;
                this.flashShootDelta -= FLASH_TIME_STEP;
                sizeOffset = this.flashShootDelta * 2;
                xOffset = this.flashShootDelta;
            }
            else
            {
                ctx.fillStyle = 'black';
            }
            ctx.fillRect(-size - sizeOffset / 2 + xOffset, -(size / 4) - sizeOffset / 2 + yOffset, size + sizeOffset, size / 2 + sizeOffset);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        drawCollisionCircle(ctx, this.player.x, this.player.y, PLAYER_RADIUS);
    }

    function wrapAround(position, width, height)
    {
        if (position.x < -width) position.x = canvas.width;
        if (position.y < -height) position.y = canvas.height;
        if (position.x > canvas.width + width / 2) position.x = -width;
        if (position.y > canvas.height + height / 2) position.y = -height;
    }

    function withinRadius(from, to, radius)
    {
        const dx = from.x - to.x;
        const dy = from.y - to.y;
        return dx * dx + dy * dy <= radius * radius
    }

    function drawCollisionCircle(ctx, x, y, radius)
    {
        if (!SHOW_COLLISION) return;
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'lime';
        ctx.stroke();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function createPowerUp(scene, x, y, dx, dy)
    {
        return {
            scene,
            x, y,
            dx, dy,
            rotation: Math.atan2(dy, dx),
            destroy()
            {
                this.scene.powerUps.splice(this.scene.powerUps.indexOf(this), 1);
            }
        }
    }

    function createAsteroid(scene, x, y, dx, dy, size)
    {
        return {
            scene,
            x, y,
            dx, dy,
            size,
            rotation: Math.atan2(dy, dx),
            breakUp(dx = 0, dy = 0)
            {
                this.destroy();
                if (this.size > SMALL_ASTEROID_RADIUS)
                {
                    let children = [];
                    children.push(createAsteroid(
                        this.scene,
                        this.x + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                        this.y + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                        Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                        Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                        SMALL_ASTEROID_RADIUS)
                    );
                    children.push(createAsteroid(
                        this.scene,
                        this.x + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                        this.y + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                        Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                        Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                        SMALL_ASTEROID_RADIUS)
                    );
                    children.push(createAsteroid(
                        this.scene,
                        this.x + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                        this.y + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                        Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                        Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                        SMALL_ASTEROID_RADIUS)
                    );
                    children.push(createAsteroid(
                        this.scene,
                        this.x + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                        this.y + Random.range(-ASTEROID_RADIUS, ASTEROID_RADIUS),
                        Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dx,
                        Random.range(-ASTEROID_SPEED, ASTEROID_SPEED) + dy,
                        SMALL_ASTEROID_RADIUS)
                    );
                    this.scene.asteroids.push(...children);
                }
            },
            destroy()
            {
                this.scene.asteroids.splice(this.scene.asteroids.indexOf(this), 1);
            }
        };
    }

    function createBullet(scene, x, y, dx, dy)
    {
        return {
            scene,
            x, y,
            dx, dy,
            rotation: Math.atan2(dy, dx),
            age: 0,
            destroy()
            {
                this.scene.bullets.splice(this.scene.bullets.indexOf(this), 1);
            }
        };
    }

    function createParticle(scene, x, y, dx, dy, color)
    {
        if (typeof color === 'function') color = color.call(null);
        return {
            scene,
            x, y,
            dx, dy,
            rotation: Math.atan2(dy, dx),
            age: 0,
            color,
            destroy()
            {
                this.scene.particles.splice(this.scene.particles.indexOf(this), 1);
            }
        };
    }

    function nextLevel(scene)
    {
        scene.bullets.length = 0;
        scene.asteroids.length = 0;
        scene.particles.length = 0;
        scene.player.x = canvas.width / 2;
        scene.player.y = canvas.height / 2;
        scene.player.dx = 0;
        scene.player.dy = 0;
        scene.level++;
        scene.gamePause = false;
        scene.showPlayer = true;

        for(let i = 0; i < ASTEROID_SPAWN_INIT_COUNT * scene.level; ++i)
        {
            scene.asteroidSpawner.spawn();
        }

        if (Random.next() > POWER_UP_SPAWN_CHANCE)
        {
            scene.powerUpSpawner.spawn();
        }
        
        if (!sounds.music.playing) sounds.music.play();
    }

    function killPlayer(scene)
    {
        scene.gamePause = true;
        scene.showPlayer = false;
        explode(scene, scene.player.x, scene.player.y, 100, Random.choose.bind(null, PLAYER_EXPLODE_PARTICLE_COLORS));
        sounds.dead.play();
        sounds.boom.play();
        setTimeout(() => scene.gameStart = scene.gameWait = true, 1000);
    }

    function thrust(scene, x, y, dx, dy, color)
    {
        if (Random.next() > 0.3)
        {
            let particle = createParticle(
                scene,
                x + Random.range(...PLAYER_MOVE_PARTICLE_OFFSET_RANGE),
                y + Random.range(...PLAYER_MOVE_PARTICLE_OFFSET_RANGE),
                dx, dy,
                color
            );
            particle.age = Random.range(MAX_PARTICLE_AGE * MIN_PLAYER_MOVE_PARTICLE_LIFE_RATIO, MAX_PARTICLE_AGE * MAX_PLAYER_MOVE_PARTICLE_LIFE_RATIO);
            scene.particles.push(particle);
        }
    }

    function explode(scene, x, y, amount = 10, color)
    {
        for(let i = 0; i < amount; ++i)
        {
            scene.particles.push(
                createParticle(
                    scene,
                    x, y,
                    Random.range(-1, 1) * PARTICLE_SPEED,
                    Random.range(-1, 1) * PARTICLE_SPEED,
                    color
                )
            );
        }
    }

    function onKeyDown(key)
    {
        if (this.gameWait)
        {
            if (this.gameStart)
            {
                sounds.music.play();
                this.score = 0;
                this.flashScore = true;
                this.level = 0;
                this.gameStart = false;
                this.player.powerMode = 0;
                this.powerUps.length = 0;
                this.asteroidSpawner.reset();
                this.powerUpSpawner.reset();
            }
            this.gameWait = false;
            nextLevel(this);
        }

        switch(key)
        {
            case 'w':
            case 'ArrowUp':
                this.player.up = 1;
                break;
            case 's':
            case 'ArrowDown':
                this.player.down = 1;
                break;
            case 'a':
            case 'ArrowLeft':
                this.player.left = 1;
                break;
            case 'd':
            case 'ArrowRight':
                this.player.right = 1;
                break;
            case ' ':
                this.player.fire = 1;
                break;
            case '\\':
                break;
            default:
                console.log(key);
        }
    }

    function onKeyUp(key)
    {
        switch(key)
        {
            case 'w':
            case 'ArrowUp':
                this.player.up = 0;
                break;
            case 's':
            case 'ArrowDown':
                this.player.down = 0;
                break;
            case 'a':
            case 'ArrowLeft':
                this.player.left = 0;
                break;
            case 'd':
            case 'ArrowRight':
                this.player.right = 0;
                break;
            case ' ':
                this.player.fire = 0;
                break;
            case '\\':
                SHOW_COLLISION = !SHOW_COLLISION;
                break;
            default:
                console.log(key);
        }
    }

    function createSound(filepath, loop = false)
    {
        const result = {
            _playing: false,
            _data: null,
            _source: null,
            play()
            {
                if (!this._data) return;
                if (this._source) this.destroy();

                let source = audioContext.createBufferSource();
                source.loop = loop;
                source.buffer = this._data;
                source.addEventListener('ended', () => {
                    this._playing = false;
                });
                source.connect(audioContext.destination);
                source.start(0);

                this._source = source;
                this._playing = true;
            },
            pause()
            {
                this._source.stop();
                this._playing = false;
            },
            destroy()
            {
                if (this._source) this._source.disconnect();
                this._source = null;
            },
            isPaused()
            {
                return !this._playing;
            }
        };

        fetch(filepath)
            .then(response => response.arrayBuffer())
            .then(buffer => audioContext.decodeAudioData(buffer))
            .then(data => result._data = data);

        return result;
    }

    main();

}());
//# sourceMappingURL=index.js.map
