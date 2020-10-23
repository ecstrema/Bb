import { BoundingBox } from 'bounding-boxes';
import { Chord, chordParserFactory, chordRendererFactory, ParserConfiguration, RendererConfiguration } from 'chord-symbol';
import { BbChordSymbolOptions } from './bb-chord-symbol-options';
import { BbParenthesisType, BbParenthesisUtil } from './bb-chord-symbol-parentheses-options';
import { BbText } from './bb-text';
import { BbTextFragment } from './bb-text-fragment';

export class BbRenderer {

    private parseChord: (chordSymbol: string) => Chord | null;
    private renderChord: (chord: Chord) => String | Chord | null;

    // private _parserOptions : any;
    // public get parserOptions(): any {
    //     return this._parserOptions;
    // }
    // public set parserOptions(v: any) {
    //     this._parserOptions = v;
    //     this.parseChord = chordParserFactory(v)
    // }


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
        this.parseChord  = chordParserFactory (parserOptions)
        rendererOptions.printer = 'raw'
        this._rendererOptions = rendererOptions;
        this.renderChord = chordRendererFactory (rendererOptions)
        this._context = context
    }

    fillChordSymbol(chordSymbol: string, x: number, y: number): void {
        const parsedChord = this.parseChord(chordSymbol)

        if (!parsedChord) {
            console.log('Invalid chord given: ' + chordSymbol)
            return;
        }
        const fragments = this.layoutChordSymbol(chordSymbol);
        if (!fragments) {
            console.log('Text could not be laid out: ' + chordSymbol)
            return;
        }
        this.fillText(fragments, x, y);
    }

    /**
     * Similar to the HTML5 canvas' `fillText` method,
     * this function draws laid out text on the canvas.
     *
     * A note on baselines:
     * - top here signifies the top of the chord symbol.
     * - hanging is for the top of the chord Root.
     * - ideographic is for center.
     * - alphabetic means the bottom of the Root symbol.
     * - bottom is the bottom of the whole chord: it might be lower if there is a bass note.
     *
     * @param text The Text object to paint.
     * @param x The x pos of drawing.
     * @param y The y pos of drawing.
     */
    fillText(text: BbText, x: number = text.bbox.x, y: number = text.bbox.y): void {
        this.context.save();
        // ensure right content state
        this.context.textAlign = 'left'
        // A comment is needed for that 'alphabetic' thing:
        // 'top' does not compute a reliable top,
        // so even though it is alphabetic,
        // it is later recomputed to mimic a 'real' 'top'
        this.context.textBaseline = 'alphabetic'
        text.fragments.forEach(fragment => {
            const actualX = fragment.bbox.x + x;
            const actualY = fragment.bbox.y + y + fragment.baselineHeight - text.bbox.y;

            if (fragment.scaleX !== 1 || fragment.scaleY !== 1 || fragment.angle !== 0) {
                this.context.save()
                this.context.translate(actualX, actualY);
                if (fragment.scaleX !== 1 || fragment.scaleY !== 1) {
                    this.context.scale(fragment.scaleX, fragment.scaleY);
                }
                if (fragment.angle) {
                    this.context.translate(0, fragment.bbox.h * -.5)
                    this.context.rotate(fragment.angle);
                    this.context.translate(0, fragment.bbox.h * .5)
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

        const fontSize = this.getContextFontSize();
        const f: BbTextFragment[] = [];
        let currentX = 0;

        const root = renderedChord.formatted.rootNote;
        if (root) {
            currentX = this.layoutRoot(
                this.replaceSharpsFlats(root),
                f,
                fontSize
                )
        }

        const descriptor = renderedChord.formatted.descriptor;
        let center = 0;
        if (descriptor) {
            const result = this.layoutDescriptor(this.replaceSharpsFlats(descriptor), currentX, f, fontSize);
            currentX = result.currentX;
            center = result.center;
        }


        const extensions = renderedChord.formatted.chordChanges;
        if (extensions.length) {
            currentX = this.layoutExtensions(extensions, currentX, f, fontSize, center);
        }

        const bass = renderedChord.formatted.bassNote;
        if (bass) {
            currentX = this.layoutBassChange(bass, currentX, f, fontSize);
        }

        return new BbText(f);
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
            this.replaceSharpsFlats(descriptor),
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
            const m = this.context.measureText(this.replaceSharpsFlats(ext));
            maxExtWidth = Math.max(maxExtWidth, m.width);
            totalHeight += m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
        });

        const extTop = center - totalHeight * .5;
        if (this.chordSymbolOptions.parentheses.show) {
            currentX = this.layoutParenthesis(
                BbParenthesisUtil.opening[this.chordSymbolOptions.parentheses.type],
                currentX,
                fragments,
                extTop,
                totalHeight
            );
        }

        let currentY = extTop;
        extensions.forEach((ext: string, index: number) => {
            currentY = this.addExtension(
                this.replaceSharpsFlats(ext),
                currentX,
                currentY,
                fragments,
                maxExtWidth
                );
            currentY += extMargin;
        })
        currentX += maxExtWidth;

        if (this.chordSymbolOptions.parentheses.show) {
            currentX = this.layoutParenthesis(
                BbParenthesisUtil.closing[this.chordSymbolOptions.parentheses.type],
                currentX,
                fragments,
                extTop,
                totalHeight
                );
        }

        return currentX;
    }

    private layoutParenthesis(text: string, currentX: number, fragments: BbTextFragment[], top: number, height: number): number {
        const delta = height * this.chordSymbolOptions.parentheses.scale - height;
        top = top - delta * .5;
        height += delta;

        const metrics = this.context.measureText(text);

        const normalParenHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const scaleY = height / normalParenHeight;
        const options = this.chordSymbolOptions.parentheses

        if (BbParenthesisUtil.isClosing(text)) {
            currentX -= metrics.width * this.chordSymbolOptions.parentheses.right.inset;
        }

        const p = new BbTextFragment(
            text,
            BoundingBox.fromHW(
                height,
                metrics.width,
                currentX,
                top + height * (BbParenthesisUtil.isClosing(text) ? options.right.yOffset : options.left.yOffset)
            ),
            metrics.actualBoundingBoxAscent * scaleY,
            1,
            scaleY
        )
        fragments.push(p);

        if (BbParenthesisUtil.isOpening(text)) {
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

        const sep = new BbTextFragment(
            text,
            BoundingBox.fromHW(
                (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) * options.scaleY,
                metrics.width * options.scaleX,
                currentX,
                yOffset
            ),
            metrics.actualBoundingBoxAscent * options.scaleY,
            options.scaleX,
            options.scaleY,
            -options.angle // TODO: width and height do not take this factor in account.
        )
        fragments.push(sep);

        return currentX + metrics.width - options.rightInset * metrics.width;
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

    private getContextFontSize(): number {
        const fontFragments = this.context.font.split(" ")
        for (const fragment of fontFragments) {
            const regExpResult = fragment.match(/([0-9]+)px/)
            if (regExpResult) {
                return parseInt(regExpResult[0], 10);
            }
        }
        return 12;
    }

    private replaceSharpsFlats(str: string) {
        return str.replace('b', '\u266D').replace('#', '\u266F')
    }

}
