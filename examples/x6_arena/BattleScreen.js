import { SceneNode } from './SceneNode.js';

class Box
{
    constructor()
    {
        this.sceneNode = new SceneNode();
    }

    setParent(parent)
    {
        this.sceneNode.setParent(parent);
    }

    setPosition()
    {
        
    }
}

class Rect
{
    setParent() {}
    setPosition() {}
    setSize() {}

    getBoundingBox() {}
    getBoundingRadius() {}
}

class UIContainer extends Rect
{
    setContentStyle() {}
}

let parent = RectUI(0, view.height - 100, view.width, view.height, 0, view.height - 100)
    .setParent(View.getScreenView(), undefined, 0, 0, 0)
    .setContentStyle('flow', { direction: 'vertical', overflow: 'scroll' });

let attack = Button('Attack').setParent(parent);
let defend = Button('Defend').setParent(parent);
let flee = Button('Flee').setParent(parent);

button.getBoundingBox();
button.getBoundingRadius();


function Button(text)
{
    let button = BoxUI()
        .setSize(64, 12)
        .setParent(parent)
        .setContentStyle('contain');
    let buttonLabel = Text(text).setParent(button, 0, 0, 0, 0);
    return button;
}

function UIContainer(contentStyle, styleOpts = {})
{

}

// Centered at origin
function Box(x, y, width, height, offsetX = 0, offsetY = 0, radians = 0)
{
    let halfWidth = width / 2;
    let halfHeight = height / 2;
    let entity = Rect(x - halfWidth, y - halfHeight, x + halfWidth, y + halfHeight, x + offsetX, y + offsetY);
    entity.rotation = radians;
}
// Centered at top left
function Rect(left, top, right, bottom, centerX = left, centerY = top) {}
// No rotation
function Circle(x, y, r) {}






