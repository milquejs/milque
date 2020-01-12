import { Utils, Random } from './milque.js';
import * as PlayerControls from './PlayerControls.js';

const PLAYER_RADIUS = 8;
const MAX_PLAYER_TRADE_COOLDOWN = 80;
const MIN_PLAYER_TRADE_COOLDOWN = 15;
const MAX_PLAYER_VELOCITY = 1;
const PLAYER_SPEED = 0.1;
const ORBIT_SPEED = 0.05;
const ORBIT_VELOCITY = MAX_PLAYER_VELOCITY / 2;

const ITEMS = ['fud', 'mat', 'wet', 'lux', 'gem'];

export function onStart()
{
    this.camera = {
        x: 0, y: 0,
        speed: 0.1,
        target: null
    };
    this.player = {
        x: 0, y: 0,
        dx: 0, dy: 0,
        money: 10,
        inventory: {}
    };

    this.planets = [];
    this.tradePosts = [];

    this.camera.target = this.player;

    spawnPlanet(this, 100, 100);

    spawnTradePost(this, 50, 50);
    spawnTradePost(this, 50, -50);
    spawnTradePost(this, -50, -50);
    spawnTradePost(this, -50, 50);
}

function spawnPlanet(world, x = 0, y = 0)
{
    let result = createPlanet(x, y);
    world.planets.push(result);
    return result;
}

function createPlanet(x, y)
{
    return {
        x, y,
        activeTradeTarget: null,
        activeTradeTime: 0,
        activeTradeFactor: 0,
    };
}

function spawnTradePost(world, x = 0, y = 0, parent = null)
{
    let result = createTradePost(x, y, parent);
    world.tradePosts.push(result);
    return result;
}

function createTradePost(x, y, parent)
{
    let radius = Random.randomRange(4, 10);
    return {
        parent,
        x, y,
        radius,
        trade: randomTrade(),
        tradeRadius: radius * 8,
        tradeMode: 0,
    };
}

function randomTrade()
{
    let sign = Random.randomSign();
    let cost = Math.floor(Random.randomRange(1, 100));
    let amt = Math.floor(Random.randomRange(1, 100));
    let item = Random.randomChoose(ITEMS);
    return createTrade(sign * cost, -sign * amt, item);
}

function createTrade(cost, amt, item)
{
    return [ cost, amt, item ];
}

export function onPreUpdate(dt) {}

export function onUpdate(dt)
{
    const xControl = PlayerControls.RIGHT.value - PlayerControls.LEFT.value;
    const yControl = PlayerControls.DOWN.value - PlayerControls.UP.value;
    const fireControl = PlayerControls.FIRE.value;
    const actionControl = PlayerControls.ACTION.value;

    this.player.dx += xControl * PLAYER_SPEED * dt;
    this.player.dy += yControl * PLAYER_SPEED * dt;

    if (this.player.activeTradeTarget)
    {
        let tradePost = this.player.activeTradeTarget;
        if (Utils.distance2D(this.player, tradePost) > tradePost.tradeRadius)
        {
            tradePost.tradeMode = 0;
            this.player.activeTradeTarget = null;
        }
        else
        {
            let dist = Utils.distance2D(this.player, tradePost);
            let dx = ((this.player.x - tradePost.x) / dist);
            let dy = ((this.player.y - tradePost.y) / dist);
            let radians = Math.atan2(dy, dx) + 1;
            let orbitRadius = tradePost.tradeRadius;
            let orbitX = tradePost.x + Math.cos(radians) * orbitRadius;
            let orbitY = tradePost.y + Math.sin(radians) * orbitRadius;
            dist = Utils.distance2D(this.player, { x: orbitX, y: orbitY });
            dx = (orbitX - this.player.x) / dist;
            dy = (orbitY - this.player.y) / dist;

            // Keep in orbit...
            this.player.dx = Utils.lerp(this.player.dx, dx * ORBIT_VELOCITY, dt * ORBIT_SPEED);
            this.player.dy = Utils.lerp(this.player.dy, dy * ORBIT_VELOCITY, dt * ORBIT_SPEED);

            // Perform trading...
            if (actionControl)
            {
                if (tradePost.tradeMode !== 2)
                {
                    tradePost.tradeMode = 2;
                    this.player.activeTradeTime = 0;
                    this.player.activeTradeFactor = 0;
                }
                this.player.activeTradeTime += dt;
                let tradeCooldown = ((MAX_PLAYER_TRADE_COOLDOWN - MIN_PLAYER_TRADE_COOLDOWN) * (1 - Utils.clampRange(this.player.activeTradeFactor / 5, 0, 1))) + MIN_PLAYER_TRADE_COOLDOWN;
                if (this.player.activeTradeTime > tradeCooldown)
                {
                    let inv = this.player.inventory;
                    let cost = tradePost.trade[0];
                    let amt = tradePost.trade[1];
                    let item = tradePost.trade[2];
                    if (this.player.money > -cost)
                    {
                        if (!(item in inv)) inv[item] = 0;
                        inv[item] += amt;
                        this.player.money += cost;

                        ++this.player.activeTradeFactor;
                    }

                    this.player.activeTradeTime = 0;
                }
            }
            else
            {
                tradePost.tradeMode = 1;
            }
        }
    }
    else
    {
        for(let tradePost of this.tradePosts)
        {
            if (Utils.distance2D(this.player, tradePost) <= tradePost.tradeRadius)
            {
                this.player.activeTradeTarget = tradePost;
                break;
            }
        }
    }

    this.player.dx = Utils.clampRange(this.player.dx, -MAX_PLAYER_VELOCITY, MAX_PLAYER_VELOCITY);
    this.player.dy = Utils.clampRange(this.player.dy, -MAX_PLAYER_VELOCITY, MAX_PLAYER_VELOCITY);

    this.player.x += this.player.dx;
    this.player.y += this.player.dy;
    
    if (this.camera.target)
    {
        this.camera.x = Utils.lerp(this.camera.x, this.camera.target.x, dt * this.camera.speed);
        this.camera.y = Utils.lerp(this.camera.y, this.camera.target.y, dt * this.camera.speed);
    }
}

export function onRender(view, world)
{
    let ctx = view.context;

    let cameraX = view.width / 2 - this.camera.x;
    let cameraY = view.height / 2 - this.camera.y;
    drawNavigationInfo(view, cameraX, cameraY);
    
    ctx.translate(cameraX, cameraY);
    {
        for(const tradePost of this.tradePosts)
        {
            Utils.drawCircle(ctx, tradePost.x, tradePost.y, tradePost.tradeRadius - PLAYER_RADIUS, 'lime', true);
            Utils.drawBox(ctx, tradePost.x, tradePost.y, 0, tradePost.radius * 2, tradePost.radius * 2, 'green');
            if (tradePost.tradeMode)
            {
                Utils.drawText(ctx,
                    (Math.sign(tradePost.trade[0]) > 0 ? '+' : '-') + '$' + Math.abs(tradePost.trade[0]) + ' => ' + tradePost.trade[1] + ' ' + tradePost.trade[2],
                    tradePost.x, tradePost.y - 16, 0, 10);
            }
        }
        
        for(const planet of this.planets)
        {
            Utils.drawCircle(ctx, planet.x, planet.y, 8, 'green');
        }

        Utils.drawBox(ctx, this.player.x, this.player.y, 0, PLAYER_RADIUS * 2, PLAYER_RADIUS * 2, 'green');
    }
    ctx.translate(-cameraX, -cameraY);

    let itemLine = 0;
    for(let itemName of Object.keys(this.player.inventory))
    {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${this.player.inventory[itemName]} x ${itemName}`, 8, view.height - 8 - 16 * itemLine++);
    }

    Utils.drawText(ctx, `\$${this.player.money}`, view.width - 16, view.height - 16);
}

function drawNavigationInfo(view, offsetX, offsetY)
{
    const cellWidth = 32;
    const cellHeight = 32;
    const chunkWidth = 256;
    const chunkHeight = 256;

    drawGrid(view, offsetX, offsetY, cellWidth, cellHeight, 1, false);
    drawGrid(view, offsetX, offsetY, chunkWidth, chunkHeight, 4, true);

    let ctx = view.context;
    let fontSize = 10;
    let worldX = -Math.floor(offsetX - view.width / 2);
    let worldY = -Math.floor(offsetY - view.height / 2);
    ctx.fillStyle = '#666666';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillText(`(${worldX},${worldY})`, cellWidth / 2, cellHeight / 2);

    drawTransformGizmo(ctx,
        cellWidth / 4,
        cellHeight / 4,
        cellWidth / 2,
        cellHeight / 2
    );
}

function drawGrid(view, offsetX, offsetY, cellWidth = 32, cellHeight = cellWidth, lineWidth = 1, showCoords = false)
{
    let ctx = view.context;

    ctx.beginPath();
    for(let y = offsetY % cellHeight; y < view.height; y += cellHeight)
    {
        ctx.moveTo(0, y);
        ctx.lineTo(view.width, y);
    }
    for(let x = offsetX % cellWidth; x < view.width; x += cellWidth)
    {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, view.height);
    }
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.lineWidth = 1;

    if (showCoords)
    {
        const fontSize = Math.min(cellWidth / 4, 16);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = '#333333';

        for(let y = offsetY % cellHeight; y < view.height; y += cellHeight)
        {
            for(let x = offsetX % cellWidth; x < view.width; x += cellWidth)
            {
                ctx.fillText(`(${Math.round((x - offsetX) / cellWidth)},${Math.round((y - offsetY) / cellHeight)})`, x + lineWidth * 2, y + lineWidth * 2);
            }
        }
    }
}

function drawTransformGizmo(ctx, x, y, width, height = width)
{
    const fontSize = width * 0.6;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${fontSize}px sans-serif`;

    ctx.translate(x, y);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.strokeStyle = '#FF0000';
    ctx.stroke();
    ctx.fillStyle = '#FF0000';
    ctx.fillText('x', width + fontSize, 0);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.strokeStyle = '#00FF00';
    ctx.stroke();
    ctx.fillStyle = '#00FF00';
    ctx.fillText('y', 0, height + fontSize);

    ctx.translate(-x, -y);
}

