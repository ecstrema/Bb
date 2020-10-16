import { chordParserFactory, chordRendererFactory, Chord } from 'chord-symbol';

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

    public descriptorOffset = 4;

    constructor(context: CanvasRenderingContext2D, parserOptions?: any, rendererOptions?: any) {
        // this._parserOptions = parserOptions;
        this.parseChord  = chordParserFactory   ()
        // this.parseChord  = chordParserFactory   (parserOptions  )
        this._rendererOptions = rendererOptions;
        this.renderChord = chordRendererFactory (rendererOptions)
        this._context = context
    }

    fillChordSymbol(chordSymbol: string, x: number, y: number) {
        const parsedChord = this.parseChord(chordSymbol)

        if (!parsedChord) {
            console.log('Invalid chord given: ' + chordSymbol)
            return;
        }
        // const renderedChord = this.renderChord(parsedChord);

        const root = parsedChord.formatted.rootNote
        const bass = parsedChord.formatted.bassNote
        const descriptor = parsedChord.formatted.descriptor
        const extensions = parsedChord.formatted.chordChanges

        const rootMetrics = this.context.measureText(root)
        const bassMetrics = this.context.measureText(bass)
        const descriptorMetrics = this.context.measureText(descriptor)
        // const extensionsMetrics = this.context.measureText(extensions)

        this.context.fillText(root, x, y)
        this.context.fillText(descriptor, x + descriptorMetrics.width, y - this.descriptorOffset)

    }

}
