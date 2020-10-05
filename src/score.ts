import { BbElement } from "./element";

/**
 * The score element.
 * After layout, it should contain only abstract systems.
 */
export class BbScore extends BbElement {
    /**
     * @inheritdoc
     * @returns 'score'
     */
    type = 'score';

    /**
     * Creates an instance of BbSystem.
     * @param [parent=null] the parent element
     */
    constructor(parent: BbElement | null = null) {
        super(parent)
    }

    /**
   * @inheritdoc
   */
    layoutChildren(context: CanvasRenderingContext2D): void {
        this.bbox.height = context.canvas.height;
        this.bbox.width = context.canvas.width;
    }

}
