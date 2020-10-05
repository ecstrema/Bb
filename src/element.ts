import { BoundingBox } from "bounding-boxes";
import { BbTreeNode } from "./tree-node";

/**
 * Base element class
 *
 * @export
 * @class BbElement
 */
export class BbElement extends BbTreeNode {

    /**
     * The element's type. Very useful in switch case statements.
     *
     * @returns 'element'
     */
    type = 'element';

    /**
     * Creates an instance of BbElement.
     * @param [par=null]
     */
    constructor(par: BbElement | null = null) {
        super(par)
    }

    /**
     * Bounding box relative to the parent.
     */
    bbox: BoundingBox = new BoundingBox(0, 0, 0, 0);


    /**
     * Overridden to prevent having to cast the result of children() to `BbElement` every time.
     */
    children(): BbElement[] {
        return super.children() as BbElement[];
    }


    /**
     * Overridden to prevent having to cast the result of parent() to `BbElement` every time.
     */
    public parent() : BbElement {
        return super.parent() as BbElement;
    }
    public setParent(v : BbElement) {
        super.setParent(v);
    }


    /**
     * The sum of the parents' X offsets
     * Position of the element **relative to the canvas, not to its parent element**
     */
    x(): number {
        let x = 0;
        let el: BbElement = this;

        while (el) {
            x += el.bbox.x1;
            el = el.parent() as BbElement;
        }
        return x;
    }

    /**
     * The sum of the parents' Y offsets
     * Position of the element **relative to the canvas, not to its parent element**
     */
    y(): number {
        let y = 0;
        let el: BbElement = this;

        while (el) {
            y += el.bbox.y1;
            el = el.parent() as BbElement;
        }
        return y;
    }

    /**
     * The bounding box relative to the canvas.
     */
    absoluteBbox(): BoundingBox {
        const b = new BoundingBox(this.bbox.x1, this.bbox.y1, this.bbox.x2, this.bbox.y2);

        let el = this.parent() as BbElement;
        while (el) {
            b.x += el.bbox.x;
            b.y += el.bbox.y;
            el = el.parent() as BbElement;
        }
        return b;
    }

    /**
     * Layouts an element's children.
     * This functions should do two things:
     * - Loop through children to set their x and y offset properties.
     * - set this.bbox.height and this.bbox.width.
     */
    async layout(context: CanvasRenderingContext2D): Promise<void> {
        this.children().forEach((child) => {
            console.warn(`unhandled child of ${this.type} during layout: ${child.type}`);
        });
    }

    /**
     * @inheritdoc
     */
    public get toString(): string {
        return this.type;
    }
}
