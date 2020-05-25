import * as Intersection from './IntersectionHelper.js';
import { assertEquals, assertEqualsWithError, assertNotNull, assertNull, assertTrue } from './Test.js';

function testSegment()
{
    let box = Intersection.createRect(0, 0, 10, 10);
    assertNull(Intersection.intersectSegment({}, box, 0, 10, 10, 0, 0, 0));
    assertNull(Intersection.intersectSegment({}, box, 0, 100 + 10, 10, 0, 100, 100));
    assertNotNull(Intersection.intersectSegment({}, box, 0, 0, 1, 0, 0, 0));
}

function testContactSegment()
{
    let ground = Intersection.createAABB(5, 10.5, 10, 1);
    assertNull(Intersection.intersectSegment({}, ground, 5, 10, 1, 0, 5, 0));
}

function testInsideIntersect()
{
    let container = Intersection.createRect(0, 0, 10, 10);
    let inside = Intersection.createRect(4, 4, 5, 5);

    let result = Intersection.testAABB(container, inside);
    assertTrue(result);
}

function testContactIntersect()
{
    let ground = Intersection.createRect(0, 10, 10, 11);
    let top = Intersection.createRect(0, 9, 10, 10);

    assertTrue(Intersection.testAABB(top, ground));

    // Intersect
    let result = Intersection.intersectAABB({}, top, ground);
    assertNull(result);

    // In-place sweep
    let sweep = Intersection.sweepAABB({}, ground, top, 0, 0);
    assertNull(sweep.hit);

    // Move along sweep
    let sweep2 = Intersection.sweepAABB({}, ground, top, 1, 0);
    assertNull(sweep2.hit);

    // Move into sweep
    let sweep3 = Intersection.sweepAABB({}, ground, top, 0, 0.1);
    assertEquals(sweep3.hit.dx, 0);
    assertEqualsWithError(sweep3.hit.dy, -0.1, Intersection.EPSILON * 2);
    assertEquals(sweep3.hit.nx, 0);
    assertEquals(sweep3.hit.ny, -1);
    assertEquals(sweep3.hit.x, 5);
    assertEqualsWithError(sweep3.hit.y, 10, Intersection.EPSILON);
}

function testIntersectionSimulation()
{
    let ground = Intersection.createRect(0, 10, 10, 11);
    let box = Intersection.createRect(4, 0, 5, 1);

    let gravity = 0.1;
    let dx = 0;
    let dy = 0;
    for(let i = 0; i < 1000; ++i)
    {
        // Apply gravity
        dy += gravity;

        let sweep = Intersection.sweepInto({}, box, [ ground ], dx, dy);
        box.x = sweep.x;
        box.y = sweep.y;

        // Stop. It's on the ground.
        if (sweep.hit)
        {
            dy = 0;
        }
        else
        {
            assertEqualsWithError(box.x, 4.5, Intersection.EPSILON);
        }
    }

    // On ground.
    assertEqualsWithError(box.x, 4.5, Intersection.EPSILON);
    assertEqualsWithError(box.y, 9.5, Intersection.EPSILON);

    // Try moving along.
    let sweep = Intersection.sweepInto({}, box, [ ground ], 1, 0);
    assertNull(sweep.hit);

}

function testNotIntersect()
{
    let ground = Intersection.createRect(0, 0, 10, 10);
    let right = Intersection.createRect(11, 0, 21, 10);

    let result = Intersection.testAABB(ground, right);
    assertTrue(!result);
}

function testDeltaIntersect()
{
    let ground = Intersection.createRect(0, 0, 10, 5);
    let bottom = Intersection.createRect(0, 3, 10, 5);

    assertTrue(Intersection.testAABB(bottom, ground));

    // Intersect
    let result = Intersection.intersectAABB({}, bottom, ground);
    assertEquals(result.dx, 0);
    assertEquals(result.dy, -2);
    assertEquals(result.nx, 0);
    assertEquals(result.ny, -1);
    assertEquals(result.x, 5);
    assertEquals(result.y, 3);

    // In-place sweep
    let sweep = Intersection.sweepAABB({}, bottom, ground, 0, 0);
    assertEquals(sweep.hit.dx, 0);
    assertEquals(sweep.hit.dy, -2);
    assertEquals(sweep.hit.nx, 0);
    assertEquals(sweep.hit.ny, -1);
    assertEquals(sweep.hit.x, 5);
    assertEquals(sweep.hit.y, 3);
}

function main()
{
    console.log('Begin intersection tests...');

    try
    {
        testSegment();
        testContactSegment();
    
        testInsideIntersect();
        testContactIntersect();
        testNotIntersect();
        testDeltaIntersect();
    
        testIntersectionSimulation();

        console.log('Success!');
    }
    catch(e)
    {
        console.error('Failed!\n\n', e);
    }
}

main();
