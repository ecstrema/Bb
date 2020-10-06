const { BbScore } = require('../dist/score');

const a = new BbScore()
const inst = []
const type = []
const iterCount = 100000000
for (let index = 0; index < 50; index++) {
    console.log("------  iter: " + index + '  ------')
    let d = Date.now()
    for (let i = 0; i < iterCount; i++) {
        if (a instanceof BbScore)
            ;
    }
    let d2 = Date.now() - d;
    console.log('instanceof: ' + d2)
    inst.push(d2)

    d = Date.now()
    for (let i = 0; i < iterCount; i++) {
        if (a.type === 'score')
            ;
    }
    d2 = Date.now() - d;
    console.log('type: ' + d2)
    type.push(d2)
}
console.log('inst: ' + ((Math.max(...inst) + Math.min(...inst)) / 2))
console.log('type: ' + ((Math.max(...type) + Math.min(...type)) / 2))
