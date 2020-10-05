import { BbElement } from './element';

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
     * @param [par=null] the parent element
     */
    constructor(par: BbElement | null = null) {
        super(par)
    }

    /**
     * @inheritdoc
     */
    async layout(context: CanvasRenderingContext2D): Promise<void> {
        this.bbox.height = 100;
        this.bbox.width = 100;
    }
}
