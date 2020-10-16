import { chordParserFactory, chordRendererFactory, Chord } from 'chord-symbol';
import { BbChordSymbolOptions } from './bb-chord-symbol-options';
import { BbTextFragment } from './bb-text-fragment';

export class BbRenderer {

    private parseChord: (chordSymbol: string) => Chord | null;
    private renderChord: (chord: Chord) => String | null;

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


    private _rendererOptions : any;
    public get rendererOptions(): any {
        return this._rendererOptions;
    }
    public set rendererOptions(v: any) {
        this._rendererOptions = v;
        this.renderChord = chordRendererFactory(v)
    }

    /**
     * The offset from the root note of the descriptors.
     *
     * This is a value in percentage of the font pixel size.
     *
     */
    public chordSymbolOptions: BbChordSymbolOptions = new BbChordSymbolOptions();

    constructor(context: CanvasRenderingContext2D, parserOptions?: any, rendererOptions?: any) {
        // this._parserOptions = parserOptions;
        this.parseChord  = chordParserFactory   ()
        // this.parseChord  = chordParserFactory   (parserOptions  )
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
        this.fillTextFragments(fragments, x, y);
    }

    fillTextFragments(laidOutChord: BbTextFragment[], x: number, y: number): void {
        laidOutChord.forEach(fragment => {
            this.context.fillText(fragment.text, fragment.x + x, fragment.y + y);
        });
    }

    /**
     * Layout the chord symbol into text fragments.
     * Use in conjunction with [[fillTextFragments]]
     * when you have multiple times the same chord symbol.
     *
     * @param chordSymbol
     * @return {*} Returns the laid out text fragments that make up this chord symbol.
     *  If the given string is an invalid chord symbol, it returns null;
     */
    layoutChordSymbol(chordSymbol: string): BbTextFragment[] | null {
        const parsedChord = this.parseChord(chordSymbol);
        if (!parsedChord)
            return null;

        // const renderedChord = this.renderChord(parsedChord);

        const fragments: BbTextFragment[] = [];

        // Layout root
        // root is always at (relative) position 0.
        const root = new BbTextFragment(this.replaceSharpFlat(parsedChord.formatted.rootNote), 0, 0);
        fragments.push(root);

        // Layout descriptor
        const descriptor = new BbTextFragment(this.replaceSharpFlat(parsedChord.formatted.descriptor));
        const rootMetrics = this.context.measureText(root.text);

        const fontSize = this.getContextFontSize();
        console.log(fontSize)
        descriptor.x = rootMetrics.width + fontSize * this.chordSymbolOptions.descriptorOffsetX;
        descriptor.y = -fontSize * this.chordSymbolOptions.descriptorOffsetY;
        fragments.push(descriptor);

        // const openParenthesis = new BbTextFragment("(", )
        const descriptorMetrics = this.context.measureText(descriptor.text);
        const extensions = parsedChord.formatted.chordChanges;

        // get metrics
        const heights: number[] = extensions.map((element: string) => {
            const metrics = this.context.measureText(element);
            return metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        });

        // compute total height
        let height = 0;
        for (let i = 0; i < heights.length; i++) {
            height += heights[i];
        }

        // get top y of extensions
        let currentY = -height / 2 ;
        // All the extensions' x
        const extX = descriptor.x + descriptorMetrics.width

        let maxExtWidth = 0;
        extensions.forEach((extension: string, index: number) => {
            const ext = new BbTextFragment(this.replaceSharpFlat(extension));
            ext.x = extX;
            ext.y = currentY + heights[index];
            currentY += heights[index]
            
            console.log(ext.y);
            fragments.push(ext);

            maxExtWidth = Math.max(maxExtWidth, this.context.measureText(extension).width);
        });

        // const extensionsMetrics = this.context.measureText(extensions);

        // const bassNote = parsedChord.formatted.bassNote
        // let bass = null;
        // if (bassNote) {
        //     bass = new BbTextFragment(bassNote);
        //     const bassMetrics = this.context.measureText(bass.text);
        //     fragments.push(bass);
        // }

        return fragments;
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

    private replaceSharpFlat(str: string) {
        return str.replace('b', '\u266D').replace('#', '\u266F')
    }

}
