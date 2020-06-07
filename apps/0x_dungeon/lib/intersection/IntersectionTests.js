import { createRect, testAABB, intersectAABB, intersectPoint, intersectSegment, sweepInto, EPSILON} from './IntersectionHelper.js';
import { assertNotNull, assertNull, assertTrue, assertFalse, assertEquals, assertGreaterThan, assertEqualsWithError } from './IntersectionTestHelper.js';

function testIntersectPoint(a, x, y)
{
    return intersectPoint({}, a, x, y);
}

function testPoints(test = testIntersectPoint)
{
    let box = createRect(0, 0, 1, 1);

    // Surface contact DOES intersect.
    assertNotNull(test(box, 0, 0));
    assertNotNull(test(box, 1, 0));
    assertNotNull(test(box, 0, 1));
    assertNotNull(test(box, 1, 1));
    assertNotNull(test(box, 0, 0.5));
    assertNotNull(test(box, 0.5, 0));

    // Right below surface contact ALSO intersect.
    assertNotNull(test(box, EPSILON, EPSILON));
    assertNotNull(test(box, 1 - EPSILON, 1 - EPSILON));

    // Inside.
    assertNotNull(test(box, 0.5, 0.5));

    // Just outside.
    assertNull(test(box, -EPSILON, -EPSILON));
    assertNull(test(box, 0, -EPSILON));
    assertNull(test(box, -EPSILON, 0));
    assertNull(test(box, 1 + EPSILON, 1 + EPSILON));
    assertNull(test(box, 1 + EPSILON, 0));
    assertNull(test(box, 0, 1 + EPSILON));

    // Outside.
    assertNull(test(box, 0, 2));
    assertNull(test(box, 0, -1));
    assertNull(test(box, 0, -100));
    assertNull(test(box, 2, 2));
    assertNull(test(box, 100, 0));
}

function testIntersectSegment(a, x1, y1, x2, y2, px = 0, py = 0)
{
    return intersectSegment({}, a, x1, y1, x2 - x1, y2 - y1, px, py);
}

function testSegments(test = testIntersectSegment)
{
    let box = createRect(0, 0, 1, 1);

    // Surface contact DOES intersect.
    assertNotNull(test(box, 0, 0, 1, 0)); // Top.
    assertNotNull(test(box, 0, 0, 0, 1)); // Left.
    assertNotNull(test(box, 1, 0, 1, 1)); // Right.
    assertNotNull(test(box, 0, 1, 1, 1)); // Bottom.
    assertNotNull(test(box, 0, 0, 0, 0.5));
    assertNotNull(test(box, 0, 0, 0.5, 0));

    // Fully contained.
    assertNotNull(test(box, 0.1, 0.1, 0.9, 0.9));
    assertNotNull(test(box, 0.1, 0.1, 0.1, 0.2));
    assertNotNull(test(box, 0.5, 0.5, 0.5, 0.5));

    // Partially contained.
    assertNotNull(test(box, -0.5, 0.5, 0.5, 0.5));
    assertNotNull(test(box, 100, 0, 1, 0)); // Barely touching.
    assertNotNull(test(box, 0.5, -1, 0.5, 2)); // Pass through.
    assertNotNull(test(box, 1, 1, 2, -1)); // Touches corner only.
    assertNotNull(test(box, 0, 0, 0, 0)); // Touches corner only as point.

    // Outside.
    assertNull(test(box, -1, -1, 2, -1));
    assertNull(test(box, 100, 100, 2, 2));

    // Surface contact with padding DOES intersect.
    assertNotNull(test(box, 0, -1, 1, -1, 1, 1)); // Top.
    assertNotNull(test(box, -1, 0, -1, 1, 1, 1)); // Left.
    assertNotNull(test(box, 2, 0, 2, 1, 1, 1)); // Right.
    assertNotNull(test(box, 0, 2, 1, 2, 1, 1)); // Bottom.
    assertNotNull(test(box, 2, 2, 3, 3, 1, 1)); // Corner only, away.
    assertNotNull(test(box, 3, 3, 2, 2, 1, 1)); // Corner only, towards.
    assertNotNull(test(box, 0.5, 10, 0.5, 2, 1, 1)); // From below to bottom contact.
}

function testIntersectAABB(a, left, top, right, bottom)
{
    let b = createRect(left, top, right, bottom);

    let result = testAABB(a, b);
    let intersectResult = intersectAABB({}, a, b);

    // Make sure the results match.
    if (result)
    {
        assertNotNull(intersectResult);
    }
    else
    {
        assertNull(intersectResult);
    }

    return intersectResult;
}

function testAABBs(test = testIntersectAABB)
{
    let box = createRect(0, 0, 1, 1);

    // Surface contact DOES intersect.
    assertNotNull(test(box, 0, 1, 1, 2)); // Bottom.
    assertNotNull(test(box, 0, -1, 1, 0)); // Top.
    assertNotNull(test(box, -1, 0, 0, 1)); // Left.
    assertNotNull(test(box, 1, 0, 2, 1)); // Right.

    // Same box.
    assertNotNull(test(box, 0, 0, 1, 1));

    // Container box.
    assertNotNull(test(box, -1, -1, 2, 2));
    assertNotNull(test(box, 0, 0, 2, 2));
    assertNotNull(test(box, -100, -100, 100, 100)); // Big container.

    // Contained box.
    assertNotNull(test(box, 0.1, 0.1, 0.9, 0.9));
    assertNotNull(test(box, EPSILON, EPSILON, 1 - EPSILON, 1 - EPSILON)); // Just smaller.

    // Partially contained.
    assertNotNull(test(box, -1, 0, 1, 0.2));
    assertNotNull(test(box, 0, 0, 2, 0)); // Contact segment.
    assertNotNull(test(box, 0, 0, 0, 0)); // Corner only contact point.
    assertNotNull(test(box, 1, 1, 1, 1)); // Corner only contact point.
    assertNotNull(test(box, 0.5, 0.5, 100, 0.6));

    // Outside.
    assertNull(test(box, 1 + EPSILON, 0, 2, 1)); // Just right.
    assertNull(test(box, 0, 1 + EPSILON, 1, 2)); // Just bottom.
    assertNull(test(box, 0, -1, 1, -EPSILON)); // Just top.
    assertNull(test(box, -1, 0, -EPSILON, 1)); // Just left.
}

function testIntersectSweep(a, dx, dy, ...bs)
{
    return sweepInto({}, a, bs, dx, dy).hit;
}

function testIntersectAABBWithSweep(a, left, top, right, bottom)
{
    let b = createRect(left, top, right, bottom);
    let result = testAABB(a, b);
    let sweepResult = sweepInto({}, a, [b], 0, 0).hit;

    // Make sure the results match.
    if (result)
    {
        assertNotNull(sweepResult);
    }
    else
    {
        assertNull(sweepResult);
    }

    return sweepResult;
}

function testSweepInPlace()
{
    testAABBs(testIntersectAABBWithSweep);
}

function testSweepInBetween()
{
    // In-between top and bot but to the left.
    let box = createRect(-2, 1, -1, 2);

    let top = createRect(0, 0, 1, 1);
    let bot = createRect(0, 2, 1, 3);
    let others = [top, bot];

    // Nothing is touching at the moment.
    assertFalse(testAABB(box, top));
    assertFalse(testAABB(box, bot));

    // Surface contact DOES intersect.
    assertNotNull(testIntersectSweep(box, 3, 0, ...others)); // So it cannot pass through.

    // Let's change box to be a little smaller.
    box.ry -= EPSILON * 2; // NOTE: Not sure why it must be 2x, instead of just EPSILON.
    assertNull(testIntersectSweep(box, 3, 0, ...others)); // So it now CAN pass through.
}

function testSweepAlong()
{
    // On top of ground, to the left.
    let box = createRect(-2, 0, -1, 1);

    let ground = createRect(0, 1, 1, 2);
    let others = [ground];

    // Nothing is touching at the moment.
    assertFalse(testAABB(box, ground));

    // Surface contact DOES intersect.
    assertNotNull(testIntersectSweep(box, 3, 0, ...others)); // So it cannot slide along.

    // Let's change box to be a little smaller.
    box.ry -= EPSILON * 2; // NOTE: Not sure why it must be 2x, instead of just EPSILON.
    assertNull(testIntersectSweep(box, 3, 0, ...others)); // So it now CAN slide along.
}

function testSweepTopToBottom()
{
    // Above ground.
    let box = createRect(2, 0, 3, 1);
    testSweepSideToSideImpl(box, 0, 1);
}

function testSweepBottomToTop()
{
    // Below ground.
    let box = createRect(2, 4, 3, 5);
    testSweepSideToSideImpl(box, 0, -1);
}

function testSweepLeftToRight()
{
    // Left of ground.
    let box = createRect(0, 2, 1, 3);
    testSweepSideToSideImpl(box, 1, 0);
}

function testSweepRightToLeft()
{
    // Right of ground.
    let box = createRect(4, 2, 5, 3);
    testSweepSideToSideImpl(box, -1, 0);
}

function testSweepSideToSideImpl(box, dx, dy)
{
    let ground = createRect(2, 2, 3, 3);
    let others = [ground];

    // Nothing is touching at the moment.
    assertFalse(testAABB(box, ground));

    // Surface contact DOES intersect.
    assertNotNull(testIntersectSweep(box, dx, dy, ...others));
    assertNotNull(intersectSegment({}, ground, box.x, box.y, dx, dy, box.rx, box.ry));

    // Let's make the box touch.
    box.x += dx;
    box.y += dy;
    assertTrue(testAABB(box, ground));
    // ...and it should still intersect.
    assertNotNull(testIntersectSweep(box, dx, dy, ...others));
    assertNotNull(testIntersectSweep(box, 0, 0, ...others)); // Even if no move.
}

function testGravitySimulationImpl(
    box, others,
    gravityX = 0, gravityY = 0,
    initialDX = 0, initialDY = 0,
    steps = 100)
{
    let dx = initialDX;
    let dy = initialDY;

    for(let step = 0; step < steps; ++step)
    {
        // Do update.
        dx += gravityX;
        dy += gravityY;

        // Do physics.
        let time = 0;
        let tmp = {};
        let sweep;
        
        let iterations = 100;
        do
        {
            // Do detection.
            sweep = sweepInto(tmp, box, others, dx, dy);

            // Do resolution.
            box.x = sweep.x - (Math.sign(dx) * EPSILON);
            box.y = sweep.y - (Math.sign(dy) * EPSILON);
            time += sweep.time;
            if (sweep.hit)
            {
                dx += sweep.hit.nx * dx;
                dy += sweep.hit.ny * dy;

                if (Math.abs(dx) < EPSILON) dx = 0;
                if (Math.abs(dy) < EPSILON) dy = 0;
            }
        }
        while(time < 1 && --iterations >= 0);
    }

    return [dx, dy];
}

function testGravityXSimulation()
{
    let box = createRect(0, 0, 1, 1);
    let ground = createRect(10, 0, 11, 100);
    let others = [ground];

    // Nothing is touching at the moment.
    assertFalse(testAABB(box, ground));

    let [dx, dy] = testGravitySimulationImpl(box, others, 0.1, 0, 0, 0, 100);

    // Is it on the ground?
    assertEqualsWithError(box.x, 9.5, EPSILON);
    assertEquals(box.y, 0.5);
    assertEquals(dx, 0);
    assertEquals(dy, 0);
    assertFalse(testAABB(box, ground));
}

function testGravityYSimulation()
{
    let box = createRect(0, 0, 1, 1);
    let ground = createRect(0, 10, 100, 11);
    let others = [ground];

    // Nothing is touching at the moment.
    assertFalse(testAABB(box, ground));

    let [dx, dy] = testGravitySimulationImpl(box, others, 0, 0.1, 0, 0, 100);

    // Is it on the ground?
    assertEquals(box.x, 0.5);
    assertEqualsWithError(box.y, 9.5, EPSILON);
    assertEquals(dx, 0);
    assertEquals(dy, 0);
    assertFalse(testAABB(box, ground));
}

function testGravityAndMoveAlongSimulation()
{
    let box = createRect(0, 0, 1, 1);
    let ground = createRect(0, 10, 100, 11);
    let others = [ground];

    // Nothing is touching at the moment.
    assertFalse(testAABB(box, ground));

    let [dx, dy] = testGravitySimulationImpl(box, others, 0.1, 0.1, 0, 0, 20);

    // Is it on the ground?
    assertGreaterThan(box.x, 9.5);
    assertEqualsWithError(box.y, 9.5, EPSILON);
    assertGreaterThan(dx, 0.1);
    assertEquals(dy, 0);
    assertFalse(testAABB(box, ground));
}

function main()
{
    try
    {
        console.log('Begin intersection tests...');
    
        testPoints();
        testSegments();
        testAABBs();
        
        testSweepInPlace();
        testSweepInBetween();
        testSweepAlong();

        testSweepTopToBottom();
        testSweepBottomToTop();
        testSweepLeftToRight();
        testSweepRightToLeft();

        testGravityXSimulation();
        testGravityYSimulation();
        testGravityAndMoveAlongSimulation();

        console.log('...Success!');
    }
    catch(e)
    {
        console.error('...Failure!\n\n', e);
    }
}

main();
