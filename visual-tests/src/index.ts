const canvas = document.createElement('canvas') as HTMLCanvasElement;
// A4 in pixels (96 dpi)
canvas.width = 794;
canvas.height = 1123;

canvas.style.marginTop = '5px';
canvas.style.marginBottom = '5px';
const context = canvas.getContext('2d');

// const color = getComputedStyle(document.documentElement).getPropertyValue('--ion-color-primary-contrast');
// this.context.fillStyle = color;
// this.context.strokeStyle = color;

document.getElementById('canvas')?.appendChild(canvas);


import { BoundingBox } from "bounding-boxes";
import { BbElement } from "../../dist/element"
import { BbTreeNode } from "../../dist/tree-node";
let root =  new BbElement().appendChildren(
                new BbElement().appendChildren(
                    new BbElement(),
                    new BbElement()
                ),
                new BbElement(),
                new BbElement().appendChildren(
                    new BbElement()
                )
            ) as BbElement

root.bbox = new BoundingBox(0, 0, 100, 100)

BbTreeNode.walk(root, (node) => {
    const el = node as BbElement
    const elBbox = el.absoluteBbox()
    context?.strokeRect(elBbox.x, elBbox.y, elBbox.width, elBbox.height)
})
