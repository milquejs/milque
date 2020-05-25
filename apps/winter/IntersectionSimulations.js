import * as Intersection from './IntersectionHelper.js';
import * as Playground from './IntersectionPlayground.js';
import * as Test from './Test.js';

async function testSegment()
{
    let box = Playground.createRect(0, 0, 10, 10);
    let seg = Playground.createSegment(0, 10, 10, 0);

    let state = {
        end: 1000,
        dynamics: [ box, ],
        masks: [ seg, ],
        update(dt)
        {
            Test.assertNull(Intersection.intersectSegment({}, box, seg.x, seg.y, seg.dx, seg.dy, 0, 0));

            seg.y += 0.1;
        },
    };

    await simulate(document.querySelector('display-port'), state);

    console.log('Success!');
}

async function simulate(displayPort, state, clearScreen = false)
{
    return new Promise(resolve => {
        let runningTime = 0;
        let oldUpdate = state.update;
        state.update = dt => {
            runningTime += dt;
            if (typeof state.end === 'function'
                ? state.end.call(state)
                : runningTime > (state.end || 500))
            {
                Playground.stop(displayPort, state);

                // Wait for cleanup.
                setTimeout(resolve, 10);
                return;
            }
            else
            {
                oldUpdate.call(state, dt);
            }
        };
        Playground.run(displayPort, state);
    }).then(() => {
        if (clearScreen)
        {
            let ctx = displayPort.canvas.getContext('2d');
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    });
}

function main()
{
    testSegment();
}

window.addEventListener('DOMContentLoaded', () => {
    main();
});
