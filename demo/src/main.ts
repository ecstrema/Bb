import { BbRenderer } from "../../dist/bb-renderer";
import { BbText } from "../../dist/bb-text";

const singleCanvas = document.getElementById("singleCanvas") as HTMLCanvasElement
const chordInput = document.getElementById('chordInput') as HTMLInputElement
const showBboxes = document.getElementById('showbboxes') as HTMLInputElement
const showSymbol = document.getElementById('showSymbol') as HTMLInputElement

const singleCtx = singleCanvas.getContext('2d') as CanvasRenderingContext2D
var font = "80px Roboto"
singleCtx.font = font
const formatter = new BbRenderer(singleCtx)

const margins = 10;

function updateCanvas() {
    if (singleCanvas) {
        const laidOutChord: BbText = formatter.layoutChordSymbol(chordInput.value);
        if (!laidOutChord)
            return

        console.log(singleCanvas.height)
        console.log('bbox.w', laidOutChord.bbox.width)
        singleCtx.canvas.width = laidOutChord.bbox.width + margins * 2;
        singleCtx.canvas.height = laidOutChord.bbox.height + margins * 2;
        console.log(singleCanvas.height)

        singleCtx.clearRect(0, 0, singleCanvas.width, singleCanvas.height);
        singleCtx.font = font

        const bbox = laidOutChord.bbox;
        singleCtx.translate(margins, margins - bbox.y);
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

updateCanvas();
