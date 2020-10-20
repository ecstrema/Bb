import { BbRenderer } from "../../dist/bb-renderer";
import { BbText } from "../../dist/bb-text";

const singleCanvas = document.getElementById("singleCanvas") as HTMLCanvasElement
const chordInput = document.getElementById('chordInput') as HTMLInputElement
const showBboxes = document.getElementById('showbboxes') as HTMLInputElement

const singleCtx = singleCanvas.getContext('2d') as CanvasRenderingContext2D
singleCtx.font = "40px Linux Libertine"
const formatter = new BbRenderer(singleCtx)

const margins = 10;

function updateCanvas() {
    if (singleCanvas) {
        const laidOutChord: BbText = formatter.layoutChordSymbol(chordInput.value);
        if (!laidOutChord)
            return

        // singleCanvas.width = laidOutChord.bbox.width + margins * 2;
        // singleCanvas.height = laidOutChord.bbox.height + margins;

        singleCtx.save()
        singleCtx.clearRect(0, 0, singleCanvas.width, singleCanvas.height);
        singleCtx.font = "40px Linux Libertine"

        const bbox = laidOutChord.bbox;
        singleCtx.translate(100, 100)
        formatter.fillText(
            laidOutChord,
            bbox.x,
            bbox.y + bbox.h / 2
            )
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
        singleCtx.restore()
        // formatter.fillText(
        //     laidOutChord,
        //     singleCanvas.width / 2 - laidOutChord.bbox.width / 2,
        //     singleCanvas.height / 2
        //     )
        // singleCtx.strokeRect(
        //     singleCanvas.width / 2 - laidOutChord.bbox.width / 2,
        //     singleCanvas.height / 2,
        //     laidOutChord.bbox.w,
        //     laidOutChord.bbox.h
        //     )
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

updateCanvas();
