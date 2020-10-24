import { BoundingBox } from "bounding-boxes";
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
        const promises: Promise<void>[] = [];
        this.children().forEach(child => {
            if (child.type === 'barline') {
                promises.push(child.layout(context))
            }
            else {
                console.log(`unsupported child of ${this.type}: ${child.type} during layout`);
            }
        });

        return Promise.all(promises).then(() => {
            this.placeElements();
            this.encloseChildren();
            this.bbox.x2 += this.rightFixedMargin // TODO: add spatium
        });
    }

    placeElements(): void {

    }
}


/**
 * Segment types
 *
 * @export
 * @enum {string}
 */
export enum BbSegmentType {
    barline     = 'barline',
    keySig      = 'key-sig',
    timeSig     = 'time-sig',
    chordSymbol = 'chord-symbol',
}
