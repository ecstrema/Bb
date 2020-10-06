import { BbElement } from "./element";

/**
 * Measure Element.
 * Contains Chord symbols and some other indications.
 */
export class BbMeasure extends BbElement {
    /**
     * @inheritdoc
     */
    type = 'measure';

    /**
     * Creates an instance of BbMeasure.
     * @param [parent=null]
     */
    constructor(parent: BbElement | null = null) {
        super(parent);
    }

    /**
     * Layout the Measure.
     *
     * @param context The rendering context.
     * @inheritdoc
     */
    async layout(context: CanvasRenderingContext2D): Promise<void> {
        this.bbox.height = 100;
        this.bbox.width = 150;
    }


}
