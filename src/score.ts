import { BbElement } from "./element";
import { BbSystem } from "./system";

/**
 * The score element.
 * After layout, it should contain only abstract systems.
 */
export class BbScore extends BbElement {
    /**
     * @inheritdoc
     * @returns 'score'
     */
    type = 'score';

    /**
     * Creates an instance of BbSystem.
     * @param [par=null] the parent element
     */
    constructor(par: BbElement | null = null) {
        super(par)
    }

    /**
     * @inheritdoc
     */
    async layout(context: CanvasRenderingContext2D): Promise<void> {
        this.bbox.height = context.canvas.height;
        this.bbox.width = context.canvas.width;

        const promises: Promise<void>[] = []
        this.children().forEach(child => {
            if (child instanceof BbSystem)
                promises.push(child.layout(context))
        });
        Promise.all(promises);
    }

}
