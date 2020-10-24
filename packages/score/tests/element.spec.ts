import { BoundingBox } from 'bounding-boxes';
import { BbElement } from '../src/element';

let a: BbElement;
let aa: BbElement;
let aaa: BbElement;
let aab: BbElement;
let ab: BbElement;
let aba: BbElement;
let ac: BbElement;
describe('element', () => {
    beforeEach(() => {
        a = new BbElement();
        aa = new BbElement(a);
        aaa = new BbElement(aa);
        aab = new BbElement(aa);
        ab = new BbElement(a);
        aba = new BbElement(ab);
        ac = new BbElement(a);
    });
    describe('positions', () => {
        beforeEach(() => {
            const els = [
             // depth, x1, y1,  x2,  y2
                [a , [0, 0, 100, 100]],
                [aa , [2, 2, 98, 30]],
                [aaa, [2, 2, 94, 13]],
                [aab, [15, 2, 94, 26]],
                [ab , [2, 32, 98, 70]],
                [aba, [2, 2, 94, 36]],
                [ac , [2, 72, 50, 98]],
            ];
            els.forEach((el) => {
                const co = el[1] as number[];
                (el[0] as BbElement).bbox = new BoundingBox(co[0], co[1], co[2], co[3]);
            });
        });

        test('x', () => {
            expect(a. x()).toBe(0);
            expect(aa. x()).toBe(2);
            expect(aaa.x()).toBe(4);
            expect(aab.x()).toBe(17);
            expect(ab. x()).toBe(2);
            expect(aba.x()).toBe(4);
            expect(ac. x()).toBe(2);
        });
        test('y', () => {
            expect(a. y()).toBe(0);
            expect(aa. y()).toBe(2);
            expect(aaa.y()).toBe(4);
            expect(aab.y()).toBe(4);
            expect(ab. y()).toBe(32);
            expect(aba.y()).toBe(34);
            expect(ac. y()).toBe(72);
        });
        test('absoluteBbox', () => {
            expect(a. absoluteBbox()).toStrictEqual(new BoundingBox(0, 0, 100, 100));
            expect(aa. absoluteBbox()).toStrictEqual(new BoundingBox(2, 2, 98, 30));
            expect(aaa.absoluteBbox()).toStrictEqual(new BoundingBox(4, 4, 96, 15));
            expect(aab.absoluteBbox()).toStrictEqual(new BoundingBox(17, 4, 96, 28));
            expect(ab. absoluteBbox()).toStrictEqual(new BoundingBox(2, 32, 98, 70));
            expect(aba.absoluteBbox()).toStrictEqual(new BoundingBox(4, 34, 96, 68));
            expect(ac. absoluteBbox()).toStrictEqual(new BoundingBox(2, 72, 50, 98));
        });

        // canvas testing requires additionnal info.
        // see https://www.npmjs.com/package/canvas
        // and https://github.com/jsdom/jsdom#canvas-support
        // test('layout', () => {
        // })
    });
});
