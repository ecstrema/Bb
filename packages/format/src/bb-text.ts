import { BoundingBox } from "bounding-boxes";
import { BbTextFragment } from "./bb-text-fragment";

/**
 * A Text is a laid out sequence of textFragments.
 */
export class BbText {
    /**
     * The text fragments that make up this text.
     */
    private _fragments: BbTextFragment[]
    /**
     * The text fragments that make up this text.
     */
    public get fragments(): BbTextFragment[] {
        return this._fragments;
    }
    public set fragments(v: BbTextFragment[]) {
        this._fragments = v;
        this.recomputeBbox();
    }

    /**
     * The overflow above the root note symbol.
     *
     * For example, the overflow above a "F-" would be of 0,
     * since will be painted higher than the "F".
     *
     * In an F7(b5#5b9#9#11b13) however, the overflow will be big,
     * since the stacked extensions will go way above the chords.
     */
    private _yOverflow: number;


    /**
     * Getter for [[_yOverflow]]
     *
     * @readonly
     */
    public get yOverflow() : number {
        return this._yOverflow;
    }


    /**
     * The text's bounding-box. Automatically updated when fragments are modified.
     * Do not use the set accessor except for modifying x and y properties.
     * @private
     */
    private _bbox: BoundingBox;
    /**
     * Getter for [[_bbox]]
     */
    public get bbox(): BoundingBox {
        return this._bbox;
    }

    /**
     * Translate the text by `dx` and `dy`
     */
    translate(dx: number, dy: number): void {
        this._bbox.x += dx;
        this._bbox.y += dy;
    }

    /**
     * Move the text to `x` and `y`;
     */
    move(x: number, y: number): void {
        this._bbox.x = x;
        this._bbox.y = y;
    }

    /**
     * Creates an instance of BbText.
     */
    constructor(fragments: BbTextFragment[] = []) {
        this._fragments = fragments;
        this._bbox = BoundingBox.smallestBoxEnclosing(
            fragments.map((fragment: BbTextFragment) => { return fragment.bbox })
        );

        this._yOverflow = -this.bbox.y1;
        this._bbox.move(0, 0);
    }

    /**
     * Compute the bounding-box by combining the text fragment.
     *
     * This function should be called whenever fragment bboxes are modified.
     */
    recomputeBbox(): void {
        const x = this.bbox.x;
        const y = this.bbox.y;
        this._bbox = BoundingBox.smallestBoxEnclosing(
            this._fragments.map((fragment: BbTextFragment) => { return fragment.bbox })
        );

        this._yOverflow = -this.bbox.y1;

        this.bbox.move(x, y)
    }
}
