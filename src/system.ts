import { BoundingBox } from 'bounding-boxes';
import { BbElement } from './element';
import { BbMeasure } from './measure';

/**
 * System element.
 * Contains measures.
 *
 * @export
 * @extends {BbElement}
 */
export class BbSystem extends BbElement {
    /**
     * @inheritdoc
     * @returns 'system'
     */
    type = 'system';

    /**
     * Creates an instance of BbSystem.
     * @param [parent=null] the parent element
     */
    constructor(parent: BbElement | null = null) {
        super(parent);
    }

    /**
     * Layout the System.
     *
     * 1) Layout measures to minimum width
     * 2) Layout measures to fill
     *
     * @param context the rendering context
     * @inheritdoc
     */
    async layout(context: CanvasRenderingContext2D): Promise<void> {
        this.bbox.height = context.canvas.height;
        this.bbox.width = context.canvas.width;

        const promises: Promise<void>[] = [];
        this.children().forEach(child => {
            if (child instanceof BbMeasure)
                promises.push(child.layout(context));
        });
        return Promise.all(promises).then(() => {
            this.placeMeasures();
            this.bbox = BoundingBox.smallestBoxEnclosing(
                this.children().map((child) => { return child.bbox; } ));
        });
    }

    placeMeasures(): void {
        let w = 0;
        this.children().forEach((child) => {
            if (child instanceof BbMeasure) {
                child.bbox.x = w;
                w += child.bbox.w;
            }
        });
    }
}
