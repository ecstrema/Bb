import { BbElement } from "./element";

/**
 * The barline glyph.
 * Most important here is {@link barlineType}.
 *
 *
 * @export
 * @extends {BbGlyph}
 */
export class BbBarline extends BbElement {
    /**
     * @inheritdoc
     * @returns 'barline'
     */
    type = 'barline';

    /**
     * Creates an instance of BbBarline.
     * @param [parent=null]
     */
    constructor(parent: BbElement | null = null) {
        super(parent);
    }


    /**
     * The barline type one of {@link BbBarlineType}
     *
     * @default is `{@link BbBarlineType}.barlineSingle`
     */
    barlineType : BbBarlineType = BbBarlineType.barlineSingle;

    /**
     * Layout the Barline.
     *
     * Layout plan here is simply to get necessary height and width
     * depending on the barline type
     *
     * @param context the rendering context
     * @inheritdoc
     */
    async layout(context: CanvasRenderingContext2D): Promise<void> {
        this.bbox.height = 0
        this.bbox.width  = 0
    }

}

/**
 * Barline types
 *
 * @export
 * @enum {number}
 */
export enum BbBarlineType {
    repeatLeft = 'repeatLeft',
    repeatRight = 'repeatRight',
    repeatRightLeft = 'repeatRightLeft',
    barlineSingle = 'barlineSingle',
    barlineDouble = 'barlineDouble',
    barlineFinal = 'barlineFinal',

    // barlineDashed = 'barlineDashed',
    // barlineDotted = 'barlineDotted',
    // barlineHeavy = 'barlineHeavy',
    // barlineHeavyHeavy = 'barlineHeavyHeavy',
    // barlineReverseFinal = 'barlineReverseFinal',
    // barlineShort = 'barlineShort',
    // barlineTick = 'barlineTick',
}
