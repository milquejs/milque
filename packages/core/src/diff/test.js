import * as Diff from './Diff.js';

function test(source, target)
{
    console.log(JSON.stringify(source));
    let diff = Diff.computeDiff(source, target);
    console.log(JSON.stringify(diff));
    let result = Diff.applyDiff(source, diff);
    console.log(JSON.stringify(result));
}

console.log("=-=-=-=-=-=-=-=");
{
    let source = { x: 0 };
    let target = { y: 0 };
    test(source, target);
}
console.log("=-=-=-=-=-=-=-=");
{
    let source = [0, 1, 2];
    let target = [0, 1, 2, 3];
    test(source, target);
}
console.log("=-=-=-=-=-=-=-=");
{
    let source = [0, 1, 2];
    let target = [0];
    test(source, target);
}
console.log("=-=-=-=-=-=-=-=");
{
    let source = [0, 1, 2];
    let target = [3, 4, 5, 6];
    test(source, target);
}
console.log("=-=-=-=-=-=-=-=");
{
    let source = { x: 0 };
    let target = { y: 0 };
    test(source, target);
}
console.log("=-=-=-=-=-=-=-=");
{
    let source = { x: 0, array: ['boo', 'hi'] };
    let target = { y: 0, array: ['hi'] };
    test(source, target);
}
console.log("=-=-=-=-=-=-=-=");
{
    let source = { x: 0, array: ['boo', { x: 0, z: 1 }] };
    let target = { y: 0, array: ['hi', { x: 1, y: 1 }] };
    test(source, target);
}
console.log("=-=-=-=-=-=-=-=");
{
    let a = new Set();
    a.add('woot');
    a.add('shoot');
    let b = new Set();
    b.add('shoot');
    b.add('boom');
    let source = { a };
    let target = { a: b };

    console.log(source);
    let diff = Diff.computeDiff(source, target);
    console.log(JSON.stringify(diff));
    let result = Diff.applyDiff(source, diff);
    console.log(result);
}
console.log("=-=-=-=-=-=-=-=");
