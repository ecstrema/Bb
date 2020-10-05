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
     * Creates an instance of BbElement.
     * @param [parent=null]
     */
    constructor(parent: BbTreeNode | null = null) {
        super(parent)
    }

    /**
     * Bounding box relative to the parent.
     */
    bbox: BoundingBox = new BoundingBox(0, 0, 0, 0);

    /**
     * The sum of the parents' X offsets
     * Position of the element **relative to the canvas, not to its parent element**
     */
    x(): number {
        let x = 0;
        let el: BbElement = this;

        while (el) {
            x += el.bbox.x1;
            el = el.parent as BbElement;
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
            el = el.parent as BbElement;
        }
        return y;
    }

    /**
     * The bounding box relative to the canvas.
     */
    absoluteBbox(): BoundingBox {
        const b = new BoundingBox(this.bbox.x1, this.bbox.y1, this.bbox.x2, this.bbox.y2);

        let el = this.parent as BbElement;
        while (el) {
            b.x += el.bbox.x;
            b.y += el.bbox.y;
            el = el.parent as BbElement;
        }
        return b;
    }
}
