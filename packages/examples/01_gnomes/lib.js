const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.style = 'width: 100%; image-rendering: pixelated;';
document.body.appendChild(canvas);
const audioContext = new AudioContext();
let SHOW_COLLISION = false;

function drawBox(ctx, x, y, radians, w, h = w, color = 'white')
{
    ctx.translate(x, y);
    if (radians) ctx.rotate(radians);
    ctx.fillStyle = color;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function applyMotion(entity, inverseFriction = 1)
{
    if (inverseFriction !== 1)
    {
        entity.dx *= inverseFriction;
        entity.dy *= inverseFriction;
    }
    
    entity.x += entity.dx;
    entity.y += entity.dy;
}

function withinRadius(from, to, radius)
{
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    return dx * dx + dy * dy <= radius * radius
}

function wrapAround(position, width, height)
{
    if (position.x < -width) position.x = canvas.width;
    if (position.y < -height) position.y = canvas.height;
    if (position.x > canvas.width + width / 2) position.x = -width;
    if (position.y > canvas.height + height / 2) position.y = -height;
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
