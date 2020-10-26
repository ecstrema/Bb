import { BoundingBox } from 'bounding-boxes';
import { Chord, chordParserFactory, chordRendererFactory, ParserConfiguration, RendererConfiguration } from 'chord-symbol';
import { BbChordSymbolOptions } from './chord-symbol/bb-chord-symbol-options';
import { BbText } from './bb-text';
import { BbTextFragment } from './bb-text-fragment';
import { BbFormatUtil } from './bb-format-util';

export class BbFormat {

    private parseChord: (chordSymbol: string) => Chord | null;
    private renderChord: (chord: Chord) => String | Chord | null;

    private _context: CanvasRenderingContext2D;
    public get context(): CanvasRenderingContext2D {
        return this._context;
    }
    public set context(v: CanvasRenderingContext2D) {
        this._context = v;
    }


    private _rendererOptions: RendererConfiguration;
    public get rendererOptions(): RendererConfiguration {
        return this._rendererOptions;
    }
    public set rendererOptions(v: RendererConfiguration) {
        v.printer = 'raw'
        this._rendererOptions = v;
        this.renderChord = chordRendererFactory(v)
    }
    private _parserOptions: ParserConfiguration;
    public get parserOptions(): ParserConfiguration {
        return this._parserOptions;
    }
    public set parserOptions(v: ParserConfiguration) {
        this._parserOptions = v;
        this.parseChord = chordParserFactory(v)
    }

    /**
     * The offset from the root note of the descriptors.
     *
     * This is a value in percentage of the font pixel size.
     */
    public chordSymbolOptions: BbChordSymbolOptions = new BbChordSymbolOptions();

    constructor(context: CanvasRenderingContext2D, parserOptions: ParserConfiguration = {}, rendererOptions: RendererConfiguration = {}) {
        this._parserOptions = parserOptions;
        this.parseChord  = chordParserFactory(parserOptions);
        rendererOptions.printer = 'raw';
        this._rendererOptions = rendererOptions;
        this.renderChord = chordRendererFactory(rendererOptions);
        this._context = context;
    }

    /**
     * A shorthand for
     * ```typescript
     * formatter.fillText(formatter.layoutChordSymbol(symbol), x, y)
     * ````
     *
     * @param chordSymbol The symbol string
     * @param x left x pos of the symbol
     * @param y top y pos of the symbol
     * @return {*}
     */
    fillChordSymbol(chordSymbol: string, x: number, y: number): void {
        const parsedChord = this.parseChord(chordSymbol);

        if (!parsedChord) {
            // console.log('Invalid chord given: ' + chordSymbol)
            return;
        }
        const text = this.layoutChordSymbol(chordSymbol);
        if (!text) {
            // console.log('Text could not be laid out: ' + chordSymbol)
            return;
        }
        this.fillText(text, x, y);
    }

    /**
     * Similar to the HTML5 canvas' `fillText` method,
     * this function draws laid out text on the canvas.
     *
     * @param text The Text object to paint.
     * @param x The x pos of drawing.
     * @param y The y pos of drawing.
     */
    fillText(text: BbText, x: number = text.bbox.x, y: number = text.bbox.y): void {
        this.context.save();

        // ensure right content horizontal alignment
        this.context.textAlign = 'left'
        // A comment is needed for that 'alphabetic' thing:
        // 'top' does not compute a reliable top,
        // so even though it is alphabetic,
        // it is later recomputed to mimic a 'real' 'top'
        this.context.textBaseline = 'alphabetic'
        text.fragments.forEach(fragment => {
            const actualX = fragment.bbox.x + x;
            const actualY = fragment.bbox.y + y + fragment.baselineHeight;

            if (fragment.scaleX !== 1 || fragment.scaleY !== 1 || fragment.angle !== 0) {
                this.context.save()
                this.context.translate(actualX, actualY);
                if (fragment.angle) {
                    this.context.translate(fragment.bbox.w * .5, fragment.bbox.h * -.5);
                    this.context.rotate(fragment.angle);
                    this.context.translate(fragment.bbox.w * -.5, fragment.bbox.h * .5);
                }
                if (fragment.scaleX !== 1 || fragment.scaleY !== 1) {
                    this.context.scale(fragment.scaleX, fragment.scaleY);
                }
                this.context.translate(-actualX, -actualY);
                this.context.fillText(fragment.text, actualX, actualY)
                this.context.restore();
            }
            else {
                this.context.fillText(fragment.text, actualX, actualY);
            }
        });
        this.context.restore();
    }

    /**
     * Layout the chord symbol into text fragments.
     * Use in conjunction with [[fillText]]
     * when you have multiple times the same chord symbol.
     *
     * @param chordSymbol
     * @return Returns the laid out text fragments that make up this chord symbol.
     *  If the given string is an invalid chord symbol, it returns null;
     */
    layoutChordSymbol(chordSymbol: string): BbText | null {
        const parsedChord = this.parseChord(chordSymbol);
        if (!parsedChord) {
            return null;
        }
        const renderedChord = this.renderChord(parsedChord) as Chord
        if (!renderedChord) {
            return null;
        }

        this.context.save();
        this.context.textBaseline = 'alphabetic';
        this.context.textAlign = 'left';

        const fontSize = BbFormatUtil.getContextFontSize(this.context);
        const fragments: BbTextFragment[] = [];
        let currentX = 0;

        let root = renderedChord.formatted.rootNote;
        let descriptor = renderedChord.formatted.descriptor;
        if (descriptor) {
            // Move to root to center
            if (this.chordSymbolOptions.useMinusSignForMinorChords) {
                if (descriptor === 'mi' || descriptor === '-' || descriptor === 'min') {
                    descriptor = '';
                    root += '-';
                }
                else if (descriptor.startsWith('mi')) {
                    descriptor = descriptor.replace('mi', '-');
                }
                else if (descriptor.startsWith('min')) {
                    descriptor = descriptor.replace('min', '-');
                }
            }
            if (descriptor === '+') {
                descriptor = '';
                root += '+';
            }
        }
        if (root) {
            currentX = this.layoutRoot(
                BbFormatUtil.replaceSharpsFlats(root),
                fragments,
                fontSize
                )
        }

        let center = 0;
        if (descriptor) {
            const result = this.layoutDescriptor(
                BbFormatUtil.replaceSharpsFlats(descriptor),
                currentX,
                fragments,
                fontSize);
            currentX = result.currentX;
            center = result.center;
        }


        const extensions = renderedChord.formatted.chordChanges;
        if (extensions.length) {
            currentX = this.layoutExtensions(extensions, currentX, fragments, fontSize, center);
        }

        const bass = renderedChord.formatted.bassNote;
        if (bass) {
            currentX = this.layoutBassChange(
                BbFormatUtil.replaceSharpsFlats(bass),
                currentX,
                fragments,
                fontSize
                );
        }

        this.context.restore();

        return new BbText(fragments);
    }

    private layoutRoot(root: string, fragments: BbTextFragment[], fontSize: number): number {
        const m = this.context.measureText(root)
        const r = new BbTextFragment(
            root,
            BoundingBox.fromHW(
                m.actualBoundingBoxAscent + m.actualBoundingBoxDescent,
                m.width
            ),
            m.actualBoundingBoxAscent
        )
        fragments.push(r)

        return r.bbox.width - fontSize * this.chordSymbolOptions.descriptorHorizontalInset;
    }

    private layoutDescriptor(descriptor: string, currentX: number, fragments: BbTextFragment[], fontSize: number): {currentX: number, center: number} {
        const m = this.context.measureText(descriptor);
        const inset = fontSize * this.chordSymbolOptions.descriptorHorizontalInset;

        const bbox = BoundingBox.fromHW(
            m.actualBoundingBoxAscent + m.actualBoundingBoxDescent,
            m.width,
            currentX - inset,
            -fontSize * this.chordSymbolOptions.descriptorVerticalOffset
        )
        const d = new BbTextFragment(
            BbFormatUtil.replaceSharpsFlats(descriptor),
            bbox,
            m.actualBoundingBoxAscent
            );
        fragments.push(d);

        return {currentX: currentX + m.width - inset, center: bbox.y + bbox.h * .5};
    }

    private layoutExtensions(extensions: string[], currentX: number, fragments: BbTextFragment[], fontSize: number, center: number): number {

        const extMargin = fontSize * this.chordSymbolOptions.extensionsVerticalMargin;

        let maxExtWidth = 0;
        let totalHeight = extMargin * (extensions.length - 1);

        extensions.forEach((ext: string) => {
            const m = this.context.measureText(BbFormatUtil.replaceSharpsFlats(ext));
            maxExtWidth = Math.max(maxExtWidth, m.width);
            totalHeight += m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
        });

        const isOnlyAlt = extensions.length === 1 && extensions[0] === 'alt';

        const extTop = center - totalHeight * .5;
        if (this.chordSymbolOptions.parentheses.show && !isOnlyAlt) {
            currentX = this.layoutParenthesis(
                this.chordSymbolOptions.parentheses.type[0],
                currentX,
                fragments,
                extTop,
                totalHeight,
                true
            );
        }

        let currentY = extTop;
        extensions.forEach((ext: string, index: number) => {
            currentY = this.addExtension(
                BbFormatUtil.replaceSharpsFlats(ext),
                currentX,
                currentY,
                fragments,
                maxExtWidth
                );
            currentY += extMargin;
        })
        currentX += maxExtWidth;

        if (this.chordSymbolOptions.parentheses.show && !isOnlyAlt) {
            currentX = this.layoutParenthesis(
                this.chordSymbolOptions.parentheses.type[1],
                currentX,
                fragments,
                extTop,
                totalHeight,
                false
                );
        }

        return currentX;
    }

    private layoutParenthesis(text: string, currentX: number, fragments: BbTextFragment[], top: number, height: number, opening: boolean): number {
        const delta = height * this.chordSymbolOptions.parentheses.scale - height;
        top = top - delta * .5;
        height += delta;

        const metrics = this.context.measureText(text);

        const normalParenHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const scaleY = height / normalParenHeight;
        const options = this.chordSymbolOptions.parentheses

        if (!opening) {
            currentX -= metrics.width * this.chordSymbolOptions.parentheses.right.inset;
        }

        const p = new BbTextFragment(
            text,
            BoundingBox.fromHW(
                height,
                metrics.width,
                currentX,
                top + height * (opening ? options.left.yOffset : options.right.yOffset)
            ),
            metrics.actualBoundingBoxAscent * scaleY,
            1,
            scaleY
        )
        fragments.push(p);

        if (opening) {
            currentX -= metrics.width * this.chordSymbolOptions.parentheses.left.inset;
        }

        return currentX + metrics.width;
    }

    private addExtension(extension: string, currentX: number, currentY: number, fragments: BbTextFragment[], maxExtWidth: number): number {
        const metrics = this.context.measureText(extension);
        const h = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        const e = new BbTextFragment (
            extension,
            BoundingBox.fromHW(
                h,
                metrics.width,
                currentX + (maxExtWidth - metrics.width) * .5,
                currentY
            ),
            metrics.actualBoundingBoxAscent
        );
        fragments.push(e);

        return currentY + h;
    }

    private layoutBassChange(bassNote: string, currentX: number, fragments: BbTextFragment[], fontSize: number) {
        const yOffset = fontSize * this.chordSymbolOptions.separator.yOffset;
        currentX = this.layoutSeparator('/', currentX, fragments, yOffset);
        currentX = this.layoutBass(bassNote, currentX, fragments, yOffset + this.chordSymbolOptions.bassYOffset * fontSize);

        return currentX;
    }

    private layoutSeparator(text: string, currentX: number, fragments: BbTextFragment[], yOffset: number): number {
        const metrics = this.context.measureText(text);

        const options = this.chordSymbolOptions.separator;
        currentX -= options.leftInset * metrics.width;

        const scaledW = metrics.width * options.scaleX;
        const scaledH = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) * options.scaleY;

        const sep = new BbTextFragment(
            text,
            BoundingBox.fromHW(
                scaledH,
                scaledW,
                currentX,
                yOffset
            ),
            metrics.actualBoundingBoxAscent * options.scaleY,
            options.scaleX,
            options.scaleY,
            -options.angle // TODO: bbox is broken with this angle
        )
        fragments.push(sep);

        return currentX + scaledW - options.rightInset * scaledW;
    }

    private layoutBass(bass: string, currentX: number, fragments: BbTextFragment[], yOffset: number): number {
        const metrics = this.context.measureText(bass);

        const sep = new BbTextFragment(
            bass,
            BoundingBox.fromHW(
                metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
                metrics.width,
                currentX,
                yOffset
            ),
            metrics.actualBoundingBoxAscent
        )
        fragments.push(sep);

        return currentX + metrics.width;
    }

}
