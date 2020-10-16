import { BbRenderer } from "../../dist/bb-renderer";

const singleCanvas = document.getElementById("singleCanvas") as HTMLCanvasElement
const chordInput = document.getElementById('chordInput') as HTMLInputElement

const singleCtx = singleCanvas.getContext('2d') as CanvasRenderingContext2D
singleCtx.font = "50px Roboto"
const formatter = new BbRenderer(singleCtx)

function updateCanvas() {
    if (singleCanvas) {
        singleCtx.clearRect(0, 0, singleCanvas.width, singleCanvas.height)
        formatter.fillChordSymbol(chordInput.value, singleCanvas.width / 2 - 25, singleCanvas.height / 2 + 20)
    }
    else {
        throw new Error("Some ids weren't found.");
    }
}

chordInput.addEventListener('keyup', () => {
    updateCanvas()
})

updateCanvas();
