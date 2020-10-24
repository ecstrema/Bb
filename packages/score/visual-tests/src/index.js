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
import { BbSegment } from "../../dist/segment"
import { BbTreeNode } from "../../dist/tree-node";
import { BbBarline } from "../../dist/barline";

let barline1 = new BbBarline()
let barline2 = new BbBarline()
let barline3 = new BbBarline()
let barline4 = new BbBarline()
let barline5 = new BbBarline()
let barline6 = new BbBarline()

let root =  new BbScore().appendChildren(
                new BbSystem().appendChildren(
                    new BbSegment().appendChildren(
                        barline1
                    ),
                    new BbSegment().appendChildren(
                        barline2
                    ),
                    new BbSegment().appendChildren(
                        barline3
                    ),
                ),
                new BbSystem().appendChildren(
                    new BbSegment().appendChildren(
                        barline4
                    ),
                ),
                new BbSystem().appendChildren(
                    new BbSegment().appendChildren(
                        barline5
                    ),
                    new BbSegment().appendChildren(
                        barline6
                    ),
                ),
            );
context.save();
context.strokeStyle = 'blue';
context.strokeRect(0, 0, context.canvas.width, context.canvas.height);
context.restore();
root.layout(context).then(() => {
    BbTreeNode.walk(root, (el) => {
        const elBbox = el.absoluteBbox().copy();
        context.strokeRect(elBbox.x, elBbox.y, elBbox.width, elBbox.height);
    })
})
console.log(BbTreeNode.treeToString(root))
