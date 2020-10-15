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

    private _rendererOptions : any;
    public get rendererOptions(): any {
        return this._rendererOptions;
    }
    public set rendererOptions(v: any) {
        this._rendererOptions = v;
        this.renderChord = chordRendererFactory(v)
    }

    constructor(parserOptions?: any, rendererOptions?: any) {
        this.parseChord  = chordParserFactory   ()
        // this.parseChord  = chordParserFactory   (parserOptions  )
        this.renderChord = chordRendererFactory (rendererOptions)
    }

    fillChordSymbol(context: CanvasRenderingContext2D, chordSymbol: string) {
        const parsedChord = this.parseChord(chordSymbol)

        if (parsedChord)
            console.log(this.renderChord(parsedChord))
    }

}
