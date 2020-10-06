const { BoundingBox } = require("../dist/bounding-boxes");

const res = {
    sme0: [],
    sme1: [],
    sme2: [],
}
for (let index = 0; index < 1000; index++) {
    console.log('-----------  iter: ' + index.toString(10) + '  -----------')
    const bboxes = []
    for (let i = 0; i < 100000; i++) {
        bboxes.push(new BoundingBox(Math.random() * 100, Math.random() * 100, Math.random * 100, Math.random() * 100));
    }
    let funcs = ['sme0', 'sme1', 'sme2']
    funcs.forEach((fun) => {
        const time = Date.now()
        BoundingBox[fun](bboxes);
        const t = Date.now() - time;
        res[fun].push(t)
        console.log(fun + ': ' + t)
    });
}
console.log('final sme0: ' + (Math.max(...res.sme0) + Math.min(...res.sme0) / 2).toString(10))
console.log('final sme1: ' + (Math.max(...res.sme1) + Math.min(...res.sme1) / 2).toString(10))
console.log('final sme2: ' + (Math.max(...res.sme2) + Math.min(...res.sme2) / 2).toString(10))
