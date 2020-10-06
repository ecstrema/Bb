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
     * The fixed margin is in spatium,
     * and does not the depend on the layout.
     * It depends solely on the spatium
     */
    rightFixedMargin: number = 0

    /**
     * The dynamic margin is a multiplier of how the remaining space
     * should be distributed among segments.
     */
    rightDynamicMargin: number = 0

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
