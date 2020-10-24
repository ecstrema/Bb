import { BbFormat } from "../../src/bb-format";
import { BbText } from "../../src/bb-text";

const singleCanvas = document.getElementById("singleCanvas") as HTMLCanvasElement
const chordInput = document.getElementById('chordInput') as HTMLInputElement
const showBboxes = document.getElementById('showbboxes') as HTMLInputElement
const showSymbol = document.getElementById('showSymbol') as HTMLInputElement

const chordSymbolFont = 'Petaluma Script'

const singleCtx = singleCanvas.getContext('2d') as CanvasRenderingContext2D
const singleCtxFontSize = 80
var singleCtxFont = singleCtxFontSize + "px " + chordSymbolFont
singleCtx.font = singleCtxFont
const formatter = new BbFormat(singleCtx)

const margin = 10;

function updateCanvas() {
    if (singleCanvas) {
        const laidOutChord: BbText = formatter.layoutChordSymbol(chordInput.value);
        if (!laidOutChord)
            return
        singleCtx.canvas.width = laidOutChord.bbox.width + margin * 2;
        singleCtx.canvas.height = laidOutChord.bbox.height + margin * 2;

        singleCtx.clearRect(0, 0, singleCanvas.width, singleCanvas.height);
        // This has to be reset because the context is reset when the canvas get resized.
        singleCtx.font = singleCtxFont;

        const bbox = laidOutChord.bbox;
        singleCtx.translate(margin, margin - bbox.y);
        if (showSymbol.checked == true) {
            formatter.fillText(
                laidOutChord
                )
        }
        if (showBboxes.checked == true) {
            singleCtx.strokeRect(
                bbox.x,
                bbox.y,
                bbox.w,
                bbox.h
                )
            singleCtx.strokeStyle = 'red'
            laidOutChord.fragments.forEach(f => {
                singleCtx.strokeRect(
                    f.bbox.x,
                    f.bbox.y,
                    f.bbox.w,
                    f.bbox.h
                    )
            })
        }
    }
    else {
        throw new Error("Some ids weren't found.");
    }
}

chordInput.addEventListener('keyup', () => {
    updateCanvas()
})
showBboxes.addEventListener('click', () => {
    updateCanvas()
})
showSymbol.addEventListener('click', () => {
    updateCanvas()
})


var showcase = document.getElementById('showcaseCanvas') as HTMLCanvasElement;
var chords = [
    ['B',   'D7',   'G',    'Bb7',  'Eb',       'A-7',  'D7',   ],
    ['G',   'Bb7',  'Eb',   'F#7',  'B',        'F-7',  'Bb7',  ],
    ['Eb',          'A-7',  'D7',   'G',        'C#-7', 'F#7',  ],
    ['B',           'F-7',  'Bb7',  'Eb',       'C#-7', 'F#7',  ],
]
var durations = [
    [1, 1, 1, 1, 2,    1, 1, ],
    [1, 1, 1, 1, 2,    1, 1, ],
    [2,    1, 1, 2,    1, 1, ],
    [2,    1, 1, 2,    1, 1, ],
]

window.onresize = (ev: UIEvent )=> {
    updateCanvas();
    drawShowCase();
}

const showcaseCtx = showcase.getContext('2d');
const showcaseFormatter = new BbFormat(showcaseCtx, {}, {  });
const showCaseFontSize = 30;
const showcaseFont = showCaseFontSize + 'px ' + chordSymbolFont;
showcaseCtx.font = showcaseFont;

const showcaseMargin = 30;
const showcaseSystemSpacing = 30;
const barlineHeight = 35;

function drawShowCase() {
    showcaseCtx.clearRect(0, 0, showcase.width, showcase.height);
    const width = showcase.width - showcaseMargin * 2;

    const texts: BbText[][] = chords.map((line: string[]) => {
        return line.map((chord: string) => {
            return showcaseFormatter.layoutChordSymbol(chord);
        })
    });
    let currentY = showcaseMargin;
    texts.forEach((line: BbText[], lineIndex: number) => {
        let currentX = showcaseMargin;
        let maxHeight = 0;
        let durationTotal = 0;
        showcaseCtx.fillRect(currentX - 5, currentY - 10, 2, barlineHeight);

        line.forEach((t: BbText, chordIndex: number) => {
            showcaseFormatter.fillText(t, currentX, currentY + t.bbox.y);

            maxHeight = Math.max(maxHeight, t.bbox.h);
            const duration = durations[lineIndex][chordIndex];
            durationTotal += duration;
            currentX += width / 8 * duration;
            if (!(durationTotal % 2)) {
                showcaseCtx.fillRect(currentX - 5, currentY - 10, 2, barlineHeight);
            }
        });

        currentY += maxHeight + showcaseSystemSpacing;
    });
}



drawShowCase()
updateCanvas();
