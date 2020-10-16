import { BbRenderer } from "../../dist/bb-renderer";

const singleCanvas = document.getElementById("singleCanvas") as HTMLCanvasElement
const chordInput = document.getElementById('chordInput') as HTMLInputElement

let input = chordInput.value

chordInput.addEventListener('keyup', () => {
    input = chordInput.value;
    if (singleCanvas) {
        const singleCtx = singleCanvas.getContext('2d') as CanvasRenderingContext2D

        const formatter = new BbRenderer(singleCtx)
        formatter.fillChordSymbol(input, 10, 10)
    }
    else {
        throw new Error("Some ids weren't found.");
    }
})
