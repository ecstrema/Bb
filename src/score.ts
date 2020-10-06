import { BbElement } from "./element";
import { BbSegment } from "./segment";
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
     * @param [parent=null] the parent element
     */
    constructor(parent: BbElement | null = null) {
        super(parent);
    }

    /**
     * @inheritdoc
     */
    async layout(context: CanvasRenderingContext2D): Promise<void> {
        this.bbox.height = context.canvas.height;
        this.bbox.width = context.canvas.width;

        const promises: Promise<void>[] = [];
        let lastSystem: BbSystem;
        this.children().forEach(child => {
            // Prevent the type checker from thinking that last system may not be a system
            // if (child.type = 'system') {
            if (child instanceof BbSystem) {
                promises.push(child.layout(context));
                lastSystem = child;
            }
            else if (child.type === 'segment') {
                if (!lastSystem) {
                    lastSystem = new BbSystem();
                    this.prependChild(lastSystem);
                }
                lastSystem.appendChild(child);
            }
            else {
                console.log(`unsupported child of ${this.type}: ${child.type} during layout`);
            }
        });
        return Promise.all(promises).then(() => {
            this.spaceSystems();
        });
    }

    /**
     * The function is called after each system has been layout on his own to space the systems.
     */
    spaceSystems() : void {
        let h = 0;
        this.children().forEach((child) => {
            if (child.type == 'system') {
                child.bbox.y = h;
                h += child.bbox.height;
            }
        });
    }

}
