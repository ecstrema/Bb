import { BbScore } from "./score";
import { BbElement } from "./element";
import { BbSystem } from "./system";

let a: BbScore;
let aa: BbSystem;
let _aaa: BbElement;
let _aab: BbElement;
let ab: BbSystem;
let _aba: BbElement;
let ac: BbSystem;

describe('score', () => {
    beforeEach(() => {
        a = new BbScore();
        aa = new BbSystem(a);
        _aaa = new BbElement(aa);
        _aab = new BbElement(aa);
        ab = new BbSystem(a);
        _aba = new BbElement(ab);
        ac = new BbSystem(a);
    });
    test('type', () => {
        expect(a.type).toBe('score');
    });

    test('spaceSystems', () => {
        aa.bbox.height = 50;
        ab.bbox.height = 100;
        ac.bbox.height = 150;

        a.spaceSystems();
        expect(aa.bbox.y).toBe(0);
        expect(ab.bbox.y).toBe(50);
        expect(ac.bbox.y).toBe(150);
    });
});
