import { BbFormat } from "../../src/bb-format";
import { BbText } from "../../src/bb-text";
import { BbTextFragment } from "../../src/bb-text-fragment";

const singleCanvas = document.getElementById("singleCanvas") as HTMLCanvasElement;
const chordInput = document.getElementById('chordInput') as HTMLInputElement;
const showBboxes = document.getElementById('showbboxes') as HTMLInputElement;
const showSymbol = document.getElementById('showSymbol') as HTMLInputElement;

const chordSymbolFont = 'Petaluma Script';

const singleCtx = singleCanvas.getContext('2d') as CanvasRenderingContext2D;
const singleCtxFontSize = 80;
let singleCtxFont = singleCtxFontSize + "px " + chordSymbolFont;
singleCtx.font = singleCtxFont;

const formatter = new BbFormat(singleCtx);


const margin = 10;

function updateCanvas() {
    if (singleCanvas) {
        const laidOutChord: BbText | null = formatter.layoutChordSymbol(chordInput.value);
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
                laidOutChord,
                laidOutChord.bbox.x,
                laidOutChord.bbox.y + laidOutChord.yOverflow
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
            laidOutChord.fragments.forEach((f: BbTextFragment) => {
                singleCtx.strokeRect(
                    f.bbox.x,
                    f.bbox.y + laidOutChord.yOverflow,
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

const showcaseCtx = showcase.getContext('2d') as CanvasRenderingContext2D;
const showcaseFormatter = new BbFormat(showcaseCtx, {}, {  });
const showCaseFontSize = 30;
const showcaseFont = showCaseFontSize + 'px ' + chordSymbolFont;
showcaseCtx.font = showcaseFont;

const showcaseMargin = 30;
const showcaseSystemSpacing = 30;

const useTranslateRendering = false;

function drawShowCase() {
    showcaseCtx.clearRect(0, 0, showcase.width, showcase.height);
    const width = showcase.width - showcaseMargin * 2;

    const texts: BbText[][] = chords.map((line: string[]) => {
        return line.map((chord: string) => {
            return showcaseFormatter.layoutChordSymbol(chord) as BbText;
        })
    });
    let currentY = showcaseMargin;
    texts.forEach((line: BbText[], lineIndex: number) => {
        let currentX = showcaseMargin;
        let maxHeight = 0;
        let durationTotal = 0;
        addBarline();

        line.forEach((t: BbText, chordIndex: number) => {
            if (useTranslateRendering) {
                t.move(currentX, currentY);
                showcaseFormatter.fillText(t);
            }
            else {
                showcaseFormatter.fillText(t, currentX, currentY);
            }

            maxHeight = Math.max(maxHeight, t.bbox.h);
            const duration = durations[lineIndex][chordIndex];
            durationTotal += duration;
            currentX += width / 8 * duration;
            if (!(durationTotal % 2)) {
                addBarline(chordIndex === 5 && lineIndex === 3);
            }
        });

        function addBarline(last = false) {
            const dx = currentX - 5;
            const dy = currentY + showCaseFontSize;
            showcaseCtx.save()
            showcaseCtx.translate(dx, dy)
            showcaseCtx.scale(1.2, 1.5);
            showcaseCtx.translate(-dx, -dy)
            showcaseCtx.fillText(last ? "\uD834\uDD02" : "\uD834\uDD00", dx, dy);
            showcaseCtx.restore()
        }

        currentY += maxHeight + showcaseSystemSpacing;
    });
}



drawShowCase()
updateCanvas();
