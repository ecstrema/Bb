import { BoundingBox } from 'bounding-boxes';
import { Chord, chordParserFactory, chordRendererFactory, ParserConfiguration, RendererConfiguration } from 'chord-symbol';
import { BbChordSymbolOptions } from './bb-chord-symbol-options';
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
    fillText(text: BbText, x: number, y: number): void {
        this.context.fillRect(x, y, 200, 1)
        this.context.save();
        // Ensure correct alignment
        const fragment = text.fragments[0];
        let trY = 0
        function warn() {
            console.warn("Note that bounding boxes will be offset if you use a special text baseline or text alignment.");
        }
        switch (this.context.textBaseline) {
            case 'top': trY += text.bbox.h / 2; warn(); break;
            case 'hanging': trY += text.fragments[0]?.bbox.h / 2; warn(); break;
            case 'ideographic': /**trY += 0*/; break;
            case 'alphabetic': trY -= text.fragments[0]?.bbox.h / 2; warn(); break;
            case 'bottom': trY -= text.bbox.h / 2; warn(); break;

            default:
                console.error('Unknown context textAlign.')
                break;
        }

        let trX = 0;
        switch (this.context.textAlign) {
            case 'start': /** trY += 0 */; break;
            case 'left': /** trY += 0 */; break;
            case 'center': trX += text.bbox.w / 2; warn(); break;
            case 'right': trX += text.bbox.w; warn(); break;
            case 'end': trX += text.bbox.w; warn(); break;

            default:
                console.error('Unknown context textAlign.')
                break;
        }

        // save context state
        this.context.textAlign = 'left'
        this.context.textBaseline = 'middle'
        text.fragments.forEach(fragment => {
            const actualX = fragment.bbox.x + x + trX;
            const actualY = fragment.bbox.y + y + trY;

            if (fragment.scaleX !== 1 || fragment.scaleY !== 1) {
                this.context.save()
                this.context.translate(actualX, actualY);
                this.context.scale(fragment.scaleX, fragment.scaleY);
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

        const fragments: BbTextFragment[] = [];
        let currentX = 0;
        const fontSize = this.getContextFontSize();

        const root = renderedChord.formatted.rootNote;
        if (root) {
            currentX = this.addRoot(root, currentX, fontSize, fragments);
        }

        const descriptor = renderedChord.formatted.descriptor;
        if (descriptor) {
            currentX = this.addDescriptor(descriptor, currentX, fontSize, fragments);
        }

        const extensions = renderedChord.formatted.chordChanges;
        if (extensions.length) {
            currentX = this.addExtensions( extensions, fontSize, currentX, fragments);
        }

        const bass = renderedChord.formatted.bassNote;
        if (bass) {
            currentX = this.addBass(bass, currentX, fontSize, fragments);
        }

        return new BbText(fragments);
    }

    private addRoot(rootNote: string, currentX: number, fontSize: number, fragments: BbTextFragment[]) {
        const metrics = this.context.measureText(rootNote);
        const root = new BbTextFragment(
            this.replaceSharpsFlats(rootNote),
            BoundingBox.fromHW(
                metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
                metrics.width,
                0,
                0
            )
        );
        fragments.push(root);

        currentX = metrics.width - fontSize * this.chordSymbolOptions.descriptorHorizontalInset;
        return currentX;
    }

    private addBass(bassNote: string, currentX: number, fontSize: number, fragments: BbTextFragment[]) {
        const sepYOffset = fontSize * this.chordSymbolOptions.separatorYOffset;
        currentX -= this.chordSymbolOptions.separatorLeftInset * fontSize;
        const sepText = '/';
        const sepMetrics = this.context.measureText(sepText);
        const sep = new BbTextFragment(
            sepText,
            BoundingBox.fromHW(
                sepMetrics.actualBoundingBoxAscent + sepMetrics.actualBoundingBoxDescent,
                sepMetrics.width,
                currentX,
                sepYOffset)
            );
        currentX += sepMetrics.width - this.chordSymbolOptions.separatorRightInset * fontSize;
        fragments.push(sep);

        const bassMetrics = this.context.measureText(bassNote);
        const bass = new BbTextFragment(
            this.replaceSharpsFlats(bassNote),
            BoundingBox.fromHW(
                bassMetrics.actualBoundingBoxAscent + bassMetrics.actualBoundingBoxDescent,
                bassMetrics.width,
                currentX,
                sepYOffset + this.chordSymbolOptions.bassYOffset * fontSize
                )
            );
        currentX = bassMetrics.width - fontSize * this.chordSymbolOptions.descriptorHorizontalInset;
        fragments.push(bass);

        return currentX;
    }

    private addDescriptor(descriptor: string, currentX: number, fontSize: number, fragments: BbTextFragment[]) {
        const metrics = this.context.measureText(descriptor);
        const inset = fontSize * this.chordSymbolOptions.descriptorHorizontalInset
        const d = new BbTextFragment(
            this.replaceSharpsFlats(descriptor),
            BoundingBox.fromHW(
                metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
                metrics.width,
                currentX - inset,
                -fontSize * this.chordSymbolOptions.descriptorVerticalOffset
                )
            );
        fragments.push(d);

        currentX += metrics.width - inset;
        return currentX;
    }

    private addExtensions(extensions: string[], fontSize: number, currentX: number, fragments: BbTextFragment[]): number {

        const boxes: BoundingBox[] = []
        let maxExtWidth = 0;
        extensions.forEach((ext: string) => {
            const metrics = this.context.measureText(ext);
            boxes.push(BoundingBox.fromHW(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent, metrics.width))
            maxExtWidth = Math.max(maxExtWidth, metrics.width);
        })

        const extMargin = fontSize * this.chordSymbolOptions.extensionsVerticalMargin;

        let height = extMargin * (boxes.length - 1)
        boxes.forEach((box: BoundingBox) => {
            height += box.h;
        });

        const qualityOffsetY = fontSize * this.chordSymbolOptions.descriptorVerticalOffset;

        let currentY = -qualityOffsetY + (boxes[0].h - height) * 0.5;
        if (this.chordSymbolOptions.showParentheses) {
            currentX = this.addParenthesis('(', fontSize, currentX, qualityOffsetY, height, fragments);
        }

        extensions.forEach((extension: string, index: number) => {
            const box = boxes[index]
            box.x = currentX + (maxExtWidth - boxes[index].w) * 0.5;
            box.y = currentY;
            const ext = new BbTextFragment(
                this.replaceSharpsFlats(extension),
                box
                )
            currentY += box.h + extMargin;

            fragments.push(ext);
        });
        currentX += maxExtWidth;
        if (this.chordSymbolOptions.showParentheses) {
            currentX = this.addParenthesis(')', fontSize, currentX, qualityOffsetY, height, fragments);
        }
        return currentX;
    }

    private addParenthesis(text: string, fontSize: number, currentX: number, qualityOffsetY: number, height: number, fragments: BbTextFragment[]) {
        const metrics = this.context.measureText(text);
        const parenHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const actualHeight = (height + this.chordSymbolOptions.parenthesesMargin * fontSize) / parenHeight;
        const parenthesis = new BbTextFragment(
            text,
            BoundingBox.fromHW(
                actualHeight,
                metrics.width,
                text === ')' ? currentX - fontSize * this.chordSymbolOptions.parenthesesInset : currentX,
                -qualityOffsetY + this.chordSymbolOptions.parenthesesYOffset * parenHeight
                ),
            1,
            actualHeight
            );
        fragments.push(parenthesis);
        if (text === '(') {
            currentX += metrics.width - fontSize * this.chordSymbolOptions.parenthesesInset;
        }
        else {
            currentX += metrics.width;
        }
        return currentX;
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
