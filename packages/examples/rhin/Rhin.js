/**
 * Inspired by Aveyond.
 * This uses the basic set of Milque tools. In theory, all future
 * versions should still be able to support this.
 */

Milque.Display.attach(document.getElementById('display1'));
const ctx = Milque.Display.VIEW.canvas.getContext('2d');

function Camera(x = 0, y = 0)
{
    return {
        x,
        y,
        target: null,
        interpolate: false,
        follow(target, interpolate = true)
        {
            this.target = target;
            this.interpolate = interpolate;
            return this;
        },
        update()
        {
            if (this.target)
            {
                if (this.interpolate)
                {
                    this.x = Milque.Math.lerp(this.x, this.target.x, 0.1);
                    this.y = Milque.Math.lerp(this.y, this.target.y, 0.1);
                }
                else
                {
                    this.x = this.target.x;
                    this.y = this.target.y;
                }
            }
        }
    };
}

function pSBC(p,c0,c1,l)
{
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this.pSBCr)this.pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=pSBCr(c0),P=p<0,t=c1&&c1!="c"?pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}

const TAG_BOX = 'box';
function Box(x, y, width = 12, height = width, color = 'red')
{
    const entity = Milque.Entity.spawn().tag(TAG_BOX);
    entity.x = x;
    entity.y = y;
    entity.width = width;
    entity.height = height;
    entity.color = color;
    return entity;
}

function attachUI(element, parent)
{
    element._x -= parent.x;
    element._y -= parent.y;
    element.parent = parent;
}

function detachUI(element)
{
    if (element.parent)
    {
        element._x += parent.x;
        element._y += parent.y;
        element.parent = null;
    }
}

function UICoord(x, y, depth, parent)
{
    return {
        _x: x,
        _y: y,
        _depth: depth,
        parent,
        get x()
        {
            if (this.parent)
            {
                return this.parent.x + this._x;
            }
            else
            {
                return this._x;
            }
        },
        get y()
        {
            if (this.parent)
            {
                return this.parent.y + this._y;
            }
            else
            {
                return this._y;
            }
        },
        get depth()
        {
            if (this.parent)
            {
                return this.parent.depth + this._depth;
            }
            else
            {
                return this._depth;
            }
        }
    };
}

const TAG_UI = 'ui';
function UIFrame(x, y, width, height = width)
{
    const entity = Milque.Entity.spawn().tag(TAG_UI)
        .component(UICoord, x, y, 1, null);
    entity.width = width;
    entity.height = height;
    return entity;
}

class Item
{
    constructor(id, color, maxAmount = 8)
    {
        this.id = id;
        this.color = color;
        this.maxAmount = maxAmount;
    }
}

class ItemRegistry
{
    constructor()
    {
        this.mapping = new Map();
    }

    register(item)
    {
        this.mapping.set(item.id, item);
    }

    unregister(item)
    {
        this.mapping.delete(item.id);
    }

    keys()
    {
        return this.mapping.keys();
    }

    values()
    {
        return this.mapping.values();
    }

    getItemByID(id)
    {
        return this.mapping.get(id);
    }
}

class ItemStack
{
    constructor(id, amount = 1)
    {
        this.id = id;
        this.amount = amount;
    }
}

/*
ItemStack
id
stackSize
enchantments
durability
sockets
metadata
*/


class Tile
{
    constructor(id, color)
    {
        this.id = id;
        this.color = color;
    }
}

class TileRegistry
{
    constructor()
    {
        this.mapping = new Map();
    }
    
    register(tile)
    {
        this.mapping.set(tile.id, tile);
    }

    unregister(tile)
    {
        return this.mapping.delete(tile.id);
    }

    keys()
    {
        return this.mapping.keys();
    }

    values()
    {
        return this.mapping.values();
    }

    getTileByID(id)
    {
        return this.mapping.get(id);
    }
}

const CHUNK_SIZE = 16;
const TILE_SIZE = 16;

class TileMap extends Uint8Array
{
    constructor(width = CHUNK_SIZE, height = width)
    {
        super(width * height);

        this.width = width;
        this.height = height;
    }

    get(tileCoordX, tileCoordY)
    {
        return this[tileCoordX + tileCoordY * this.width];
    }

    set(tileCoordX, tileCoordY, value)
    {
        this[tileCoordX + tileCoordY * this.width] = value;
    }
}

class Chunk
{
    constructor(chunkManager, chunkCoordX, chunkCoordY)
    {
        this.chunkManager = chunkManager;
        this.chunkCoordX = chunkCoordX;
        this.chunkCoordY = chunkCoordY;
        this.lastAccessedTime = chunkManager.currentChunkTime;
        this.tileMap = new TileMap();
    }

    markDirty()
    {
        this.lastAccessedTime = this.chunkManager.currentChunkTime;
    }
}

const MAX_CHUNK_CACHE_TIME = 100;

class ChunkManager
{
    constructor(chunkLoader)
    {
        this.chunks = new Map();
        this.chunkLoader = chunkLoader;
        this.currentChunkTime = 0;
    }

    update()
    {
        ++this.currentChunkTime;
        for(const chunk of this.chunks.values())
        {
            if (chunk.lastAccessedTime < this.currentChunkTime - MAX_CHUNK_CACHE_TIME)
            {
                // Unload the chunk.
                const chunkCoordX = chunk.chunkCoordX;
                const chunkCoordY = chunk.chunkCoordY;
                const chunkCoordHash = `${chunkCoordX},${chunkCoordY}`;
                this.chunks.delete(chunkCoordHash);
                this.chunkLoader.unload(this, chunk);
            }
        }
    }

    get(chunkCoordX, chunkCoordY)
    {
        const chunkCoordHash = `${chunkCoordX},${chunkCoordY}`;
        if (this.chunks.has(chunkCoordHash))
        {
            return this.chunks.get(chunkCoordHash);
        }
        else
        {
            // Load the chunk.
            const chunk = this.chunkLoader.load(this, chunkCoordX, chunkCoordY);
            this.chunks.set(chunkCoordHash, chunk);
            return chunk;
        }
    }

    values()
    {
        return this.chunks.values();
    }
}

class ChunkLoader
{
    constructor() {}

    load(chunkManager, chunkCoordX, chunkCoordY)
    {
        const chunk = new Chunk(chunkManager, chunkCoordX, chunkCoordY);
        const TILES = 5;
        for(let i = 0; i < chunk.tileMap.length; ++i)
        {
            const tileID = Math.floor(Math.random() * TILES);
            chunk.tileMap[i] = tileID;
        }
        return chunk;
    }

    unload(chunkManager, chunk)
    {
        chunk.tileMap.fill(0);
    }
}

class WorldMap
{
    constructor()
    {
        this.chunkManager = new ChunkManager(new ChunkLoader());
    }

    update()
    {
        this.chunkManager.update();
    }

    getChunk(posX, posY)
    {
        const chunkCoordX = Math.floor(posX / TILE_SIZE / CHUNK_SIZE);
        const chunkCoordY = Math.floor(posY / TILE_SIZE / CHUNK_SIZE);
        const chunk = this.chunkManager.get(chunkCoordX, chunkCoordY);
        chunk.markDirty();
        return chunk;
    }

    getTile(posX, posY)
    {
        const chunkCoordX = Math.floor(posX / TILE_SIZE / CHUNK_SIZE);
        const chunkCoordY = Math.floor(posY / TILE_SIZE / CHUNK_SIZE);
        let tileCoordX = Math.floor(posX / TILE_SIZE) % CHUNK_SIZE;
        if (tileCoordX < 0) tileCoordX += CHUNK_SIZE;
        let tileCoordY = Math.floor(posY / TILE_SIZE) % CHUNK_SIZE;
        if (tileCoordY < 0) tileCoordY += CHUNK_SIZE;
        const chunk = this.chunkManager.get(chunkCoordX, chunkCoordY);
        chunk.markDirty();
        return chunk.tileMap.get(tileCoordX, tileCoordY);
    }

    setTile(posX, posY, value)
    {
        const chunkCoordX = Math.floor(posX / TILE_SIZE / CHUNK_SIZE);
        const chunkCoordY = Math.floor(posY / TILE_SIZE / CHUNK_SIZE);
        let tileCoordX = Math.floor(posX / TILE_SIZE) % CHUNK_SIZE;
        if (tileCoordX < 0) tileCoordX += CHUNK_SIZE;
        let tileCoordY = Math.floor(posY / TILE_SIZE) % CHUNK_SIZE;
        if (tileCoordY < 0) tileCoordY += CHUNK_SIZE;
        const chunk = this.chunkManager.get(chunkCoordX, chunkCoordY);
        chunk.markDirty();
        chunk.tileMap.set(tileCoordX, tileCoordY, value);
    }
}

function MainScene()
{
    this.tileRegistry = new TileRegistry();
    this.tileRegistry.register(new Tile(1, '#935116'));
    this.tileRegistry.register(new Tile(2, '#808080'));
    this.tileRegistry.register(new Tile(3, '#52BE80'));
    this.tileRegistry.register(new Tile(4, '#34495E'));

    this.worldMap = new WorldMap();

    this.camera = Camera();
    this.mover = Milque.Controller.Mover();
    this.pointer = Milque.Controller.Pointer();
    this.player = Box(0, 0);

    this.camera.follow(this.player);

    this.menu = UIFrame(16, 16, 100, 100);
    this.menuButton = UIFrame(26, 26, 80, 20);

    Milque.Game.on('update', () => {
        // UPDATING
        let pointerX = this.pointer.x + camera.x - Milque.Display.width() / 2;
        let pointerY = this.pointer.y + camera.y - Milque.Display.height() / 2;
        if (this.pointer.down)
        {
            this.worldMap.setTile(pointerX, pointerY, 1);
        }

        const moveSpeed = 2;
        let dx = 0;
        let dy = 0;
        if (this.mover.up) dy -= moveSpeed;
        if (this.mover.down) dy += moveSpeed;
        if (this.mover.left) dx -= moveSpeed;
        if (this.mover.right) dx += moveSpeed;

        // X-Axis
        let tile;
        tile = this.worldMap.getTile(this.player.x + dx, this.player.y);
        if (tile <= 0)
        {
            dx = 0;
        }

        // Y-Axis
        tile = this.worldMap.getTile(this.player.x, this.player.y + dy);
        if (tile <= 0)
        {
            dy = 0;
        }

        // Actually move the player
        this.player.x += dx;
        this.player.y += dy;

        this.camera.update();
        this.worldMap.update();

        // RENDERING
        Milque.Display.clear();
        ctx.save();
        ctx.translate(-this.camera.x + Milque.Display.width() / 2, -this.camera.y + Milque.Display.height() / 2);

        // Draw background...
        for(const chunk of this.worldMap.chunkManager.values())
        {
            const offsetX = chunk.chunkCoordX * CHUNK_SIZE * TILE_SIZE;
            const offsetY = chunk.chunkCoordY * CHUNK_SIZE * TILE_SIZE;

            for(let y = 0; y < chunk.tileMap.height; ++y)
            {
                for(let x = 0; x < chunk.tileMap.width; ++x)
                {
                    const tilePosX = x * TILE_SIZE + chunk.chunkCoordX * CHUNK_SIZE * TILE_SIZE;
                    const tilePosY = y * TILE_SIZE + chunk.chunkCoordY * CHUNK_SIZE * TILE_SIZE;
                    const distX = this.player.x - tilePosX;
                    const distY = this.player.y - tilePosY;
                    const distance = Math.sqrt(distX * distX + distY * distY) / TILE_SIZE;
                    const tileID = chunk.tileMap.get(x, y);
                    if (tileID > 0)
                    {
                        const tile = this.tileRegistry.getTileByID(tileID);
                        ctx.fillStyle = pSBC(Math.min(Math.max(-1, -distance / 8), 1), tile.color);
                        ctx.fillRect(offsetX + x * TILE_SIZE, offsetY + y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    }
                }
            }
        }

        // Draw entities...
        for(const entity of Milque.Entity.entities(TAG_BOX))
        {
            ctx.fillStyle = entity.color;
            ctx.fillRect(entity.x - entity.width / 2, entity.y - entity.height / 2, entity.width, entity.height);
        }

        ctx.restore();

        // Draw UI...
        const uis = Array.from(Milque.Entity.entities(TAG_UI)).sort((a, b) => a.depth - b.depth);
        for(const ui of uis)
        {
            ctx.fillStyle = 'gray';
            ctx.fillRect(ui.x, ui.y, ui.width, ui.height);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(ui.x, ui.y, ui.width, ui.height);
        }

        // Draw pointer...
        const pointerSize = 4;
        ctx.fillStyle = 'white';
        ctx.fillRect(pointerX - pointerSize / 2 - this.camera.x + Milque.Display.width() / 2, pointerY - pointerSize / 2 - this.camera.y + Milque.Display.height() / 2, pointerSize, pointerSize);
    });
}

// TODO: This should be called automatically in the future...
MainScene();

Milque.play();