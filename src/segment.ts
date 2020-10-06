import { BbElement } from "./element";

/**
 * Measure Element.
 * Contains Chord symbols and some other indications.
 */
export class BbSegment extends BbElement {
    /**
     * @inheritdoc
     */
    type = 'segment';

    /**
     * Creates an instance of BbSegment.
     * @param [parent=null]
     */
    constructor(parent: BbElement | null = null) {
        super(parent);
    }

    /**
     * Layout the Segment.
     *
     * @param context The rendering context.
     * @inheritdoc
     */
    async layout(context: CanvasRenderingContext2D): Promise<void> {
        this.bbox.height = 100;
        this.bbox.width = 150;
    }


}
