const canvas = document.createElement('canvas');
// A4 in pixels (96 dpi)
canvas.width = 794;
canvas.height = 1123;

canvas.style.marginTop = '5px';
canvas.style.marginBottom = '5px';
const context = canvas.getContext('2d');

// const color = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary-contrast');
// this.context.fillStyle = color;
// this.context.strokeStyle = color;

document.getElementById('canvas').appendChild(canvas);


import { BbScore } from "../../dist/score"
import { BbSystem } from "../../dist/system"
import { BbTreeNode } from "../../dist/tree-node";
let root =  new BbScore().appendChildren(
                new BbSystem(),
                new BbSystem(),
                new BbSystem(),
            )
context.save();
context.strokeStyle = 'blue';
context.strokeRect(0, 0, context.canvas.width, context.canvas.height);
context.restore();
root.layout(context)

BbTreeNode.walk(root, (node) => {
    const el = node
    const elBbox = el.absoluteBbox()
    context.strokeRect(elBbox.x, elBbox.y, elBbox.width, elBbox.height)
})
