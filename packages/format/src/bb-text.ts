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
     * The text's bounding-box. Automatically updated when fragments are modified.
     * @readonly
     * @private
     */
    private _bbox: BoundingBox;
    /**
     * The text's bounding-box. Automatically updated when fragments are modified.
     * @readonly
     */
    public get bbox() {
        return this._bbox;
    }

    /**
     * Creates an instance of BbText.
     */
    constructor(fragments: BbTextFragment[] = []) {
        this._fragments = fragments;
        this._bbox = BoundingBox.smallestBoxEnclosing(
            fragments.map((fragment: BbTextFragment) => { return fragment.bbox })
        );
    }

    /**
     * Compute the bounding-box by combining the text fragment.
     */
    recomputeBbox(): void {
        this._bbox = BoundingBox.smallestBoxEnclosing(
            this._fragments.map((fragment: BbTextFragment) => { return fragment.bbox })
        );
    }
}
