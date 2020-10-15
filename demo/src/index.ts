import { BbRenderer } from "../../dist/bb-renderer";

const singleCanvas = document.getElementById("singleCanvas") as HTMLCanvasElement
const input = document.getElementById('input')
if (singleCanvas) {
    const singleCtx = singleCanvas.getContext('2d') as CanvasRenderingContext2D

    const formatter = new BbRenderer()
    formatter.fillChordSymbol(singleCtx, "F7(#5)")
}
else {
    throw new Error("Some element had un matching ids found.");
}
