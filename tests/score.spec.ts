import { BbScore } from "../src/score";
import { BbElement } from "../src/element";

let a: BbScore;
let aa: BbElement;
let aaa: BbElement;
let aab: BbElement;
let ab: BbElement;
let aba: BbElement;
let ac: BbElement;

describe('score', () => {
    beforeEach(() => {
        a = new BbScore();
        aa = new BbElement(a);
        aaa = new BbElement(aa);
        aab = new BbElement(aa);
        ab = new BbElement(a);
        aba = new BbElement(ab);
        ac = new BbElement(a);
    })
    test('type', () => {
        expect(a.type).toBe('score')
    })
})
