import { BoundingBox } from "bounding-boxes";

/**
 * A text fragment is simply some text at a given position.
 *
 * @export
 * @class BbTextFragment
 */
export class BbTextFragment {
    /**
     * The fragment's bounding box
     */
    bbox: BoundingBox

    text: string = "";

    /**
     * The fragment's X scale factor
     */
    scaleX: number = 1;
    /**
     * The fragment's Y scale factor
     */
    scaleY: number = 1;

    /**
     * In most case [[bbox]] should do the job,
     * but if more sophisticated metrics are needed,
     * you can get them with this method.
     */
    metrics(ctx: CanvasRenderingContext2D): TextMetrics {
        return ctx.measureText(this.text);
    }

    /**
     * Creates an instance of BbTextFragment.
     */
    constructor(text: string = "", bbox: BoundingBox = new BoundingBox(0, 0, 0, 0), scaleX: number = 1, scaleY: number = 1) {
        this.bbox = bbox;
        this.text = text;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }
}
