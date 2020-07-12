document.addEventListener('DOMContentLoaded', main);

async function main()
{
    const display = document.querySelector('display-port');
    const input = document.querySelector('input-context');

    display.addEventListener('frame', e => {
        const dt = (e.detail.deltaTime / 1000) * 60;
        const ctx = e.detail.context;
        
        ctx.clearRect(0, 0, display.width, display.height);
    });
}
