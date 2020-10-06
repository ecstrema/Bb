import { BbElement } from "../src/element";

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
        super(parent)
    }

}
