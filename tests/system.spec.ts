import { BbScore } from "../src/score";
import { BbSystem } from "../src/system";
import { BbElement } from "../src/element";

let a: BbScore;
let aa: BbSystem;
let aaa: BbElement;
let aab: BbElement;
let ab: BbSystem;
let aba: BbElement;
let ac: BbSystem;

describe('system', () => {
    beforeEach(() => {
        a = new BbScore();
        aa = new BbSystem(a);
        aaa = new BbElement(aa);
        aab = new BbElement(aa);
        ab = new BbSystem(a);
        aba = new BbElement(ab);
        ac = new BbSystem(a);
    })
    test('type', () => {
        expect(aa.type).toBe('system')
        expect(ab.type).toBe('system')
        expect(ac.type).toBe('system')
    })
})
