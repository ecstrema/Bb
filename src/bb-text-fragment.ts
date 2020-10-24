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

    /**
     * The fragment's text
     */
    text: string;

    /**
     * The fragment's X scale factor
     */
    scaleX: number;
    /**
     * The fragment's Y scale factor
     */
    scaleY: number;

    /**
     * The rotation angle to apply to the segment.
     *
     * In radians.
     */
    angle: number;

    /**
     * The baseline height relative to the *top*.
     * As returned by `context.measureText(txt).actualBoundingBoxAscent`.
     *
     * Necessary for latter formatting.
     */
    baselineHeight: number;

    /**
     * In most case [[bbox]] and [[baselineHeight]] should do the job,
     * but if more sophisticated metrics are needed,
     * you can get them with this method.
     */
    metrics(ctx: CanvasRenderingContext2D): TextMetrics {
        return ctx.measureText(this.text);
    }

    /**
     * @param [scaleY=1] Y scale factor.
     */
    /**
     * Creates an instance of BbTextFragment.
     * @param [text=""] The string that will show at this position
     * @param [bbox=new BoundingBox(0, 0, 0, 0)] The bounding box. Don't forget to scale with the given scale factor.
     * @param [baselineHeight=0] The baseline height relative to the top. As returned by `context.measureText(txt).actualBoundingBoxAscent`.
     * @param [scaleX=1] X scale factor.
     * @param [scaleY=1] Y scale factor.
     * @param [angle=0]
     */
    constructor(
        text: string = "",
        bbox: BoundingBox = new BoundingBox(0, 0, 0, 0),
        baselineHeight: number = 0,
        scaleX: number = 1,
        scaleY: number = 1,
        angle: number = 0
        ) {
        this.text = text;
        this.bbox = bbox;
        this.baselineHeight = baselineHeight;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.angle = angle;
    }
}
