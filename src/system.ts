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
     * @param [parent=null] the parent element
     */
    constructor(parent: BbElement | null = null) {
        super(parent)
    }

    /**
     * @inheritdoc
     */
    layout(context: CanvasRenderingContext2D): void {

    }

    /**
     * @inheritdoc
     */
    public get toString(): string {
        return this.type;
    }
}
