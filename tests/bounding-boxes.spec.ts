import { BoundingBox } from '../src/bounding-boxes'

describe('modify properties', () => {
    test('modify x1', () => {
        let b: BoundingBox = new BoundingBox(0, 0, 100, 100);
        b.x1 = 10
        expect(b.x1).toBe(10);
        b.x1 = 110;
        expect(b.x1).toBe(100);
    });
    test('modify x2', () => {
        let b: BoundingBox = new BoundingBox(0, 0, 100, 100);
        b.x2 = 10
        expect(b.x2).toBe(10);
        b.x2 = -10;
        expect(b.x2).toBe(0);
    })
    test('modify y1', () => {
        let b: BoundingBox = new BoundingBox(0, 0, 100, 100);
        b.y1 = 10
        expect(b.y1).toBe(10);
        b.y1 = 110;
        expect(b.y1).toBe(100);
    })
    test('modify y2', () => {
        let b: BoundingBox = new BoundingBox(0, 0, 100, 100);
        b.y2 = 10
        expect(b.y2).toBe(10);
        b.y2 = -10;
        expect(b.y2).toBe(0);
    })
    test('modify width', () => {
        let b: BoundingBox = new BoundingBox(0, 0, 100, 100);
        expect(b.width).toBe(100);
        b.width = 10;
        expect(b.width).toBe(10);
        expect(b.x1).toBe(0);
        expect(b.x2).toBe(10);
        b.width = -10;
        expect(b.width).toBe(10);
        expect(b.x1).toBe(-10);
        expect(b.x2).toBe(0);
    })
    test('modify w', () => {
        let b: BoundingBox = new BoundingBox(0, 0, 100, 100);
        expect(b.w).toBe(100);
        b.w = 10;
        expect(b.w).toBe(10);
        expect(b.x1).toBe(0);
        expect(b.x2).toBe(10);
        b.w = -10;
        expect(b.w).toBe(10);
        expect(b.x1).toBe(-10);
        expect(b.x2).toBe(0);
    })
    test('modify height', () => {
        let b: BoundingBox = new BoundingBox(0, 0, 100, 100);
        expect(b.height).toBe(100);
        b.height = 10;
        expect(b.height).toBe(10);
        expect(b.y1).toBe(0);
        expect(b.y2).toBe(10);
        b.height = -10;
        expect(b.height).toBe(10);
        expect(b.y1).toBe(-10);
        expect(b.y2).toBe(0);
    })
    test('modify h', () => {
        let b: BoundingBox = new BoundingBox(0, 0, 100, 100);
        expect(b.h).toBe(100);
        b.h = 10;
        expect(b.h).toBe(10);
        expect(b.y1).toBe(0);
        expect(b.y2).toBe(10);
        b.h = -10;
        expect(b.h).toBe(10);
        expect(b.y1).toBe(-10);
        expect(b.y2).toBe(0);
    })
})

describe('containsPoint', () => {
    describe.each([
        [0, 0, 100, 100, 10,    10,     true    ],
        [0, 0, 100, 100, 0,     10,     true    ],
        [0, 0, 100, 100, 0,     100,    true    ],
        [0, 0, 100, 100, 10,    0,      true    ],
        [0, 0, 100, 100, 100,   0,      true    ],
        [0, 0, 100, 100, -1,   10,      false   ],
        [0, 0, 100, 100, 10,   -1,      false   ],
        [0, 0, 100, 100, -1,   -1,      false   ],
    ])('%s', (x1, y1, x2, y2, pointX, pointY, isIn) => {
        test(`x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}, pointX: ${pointX}, pointY: ${pointY}`, () => {
            expect(new BoundingBox(x1, y1, x2, y2).containsPoint(pointX, pointY)).toBe(isIn);
        })
    })
})

describe('height and width', () => {
    describe.each([
        [0, 0, 100, 100, 100, 100],
        [0, 0, 50, 100, 50, 100],
        [-100, -100, 50, 100, 150, 200],
        [-100, -100, -50, -200, 50, 100],
        [0, 0, 0, 0, 0, 0],

    ])('%s', (x1, y1, x2, y2, width, height) => {
        test(`x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}`, () => {
            expect(new BoundingBox(x1, y1, x2, y2).height).toBe(height);
            expect(new BoundingBox(x1, y1, x2, y2).width).toBe(width);
        })
    })
})


describe('FromHW', () => {
    describe.each([
        [0, 0, 100, 100, 100, 100],
        [0, 0, 200, 50, 200, 50],
        [-100, -100, 50, 100, -50, 0],
        [-100, -100, -50, -200, -100, -100],
        [0, 0, 0, 0, 0, 0],

    ])('%s', (x1, y1, width, height, x2, y2) => {
        test(`x1: ${x1}, x2: ${x2}, width: ${width}, height: ${height}, x2: ${x2}, y2: ${y2}`, () => {
            const bbox = BoundingBox.fromHW(height, width, x1, y1);
            expect(bbox.x2).toBe(x2)
            expect(bbox.y2).toBe(y2)
        })
    })
})

describe('intersects', () => {
    describe.each([
        [0, 0, 100, 100,    100, 100, 200, 200, true],
        [0, 0, 100, 100,    150, 150, 200, 200, false],
        [0, 0, 100, 149,    150, 150, 200, 200, false],
        [0, 0, 100, 151,    150, 150, 200, 200, false],
        [0, 0, 151, 149,    150, 150, 200, 200, false],
        [0, 0, 149, 149,    150, 150, 200, 200, false],
        [0, 0, 149, 149,    -100, 150, 200, 200, false],
        [0, 0, 0, 0,        -100, 150, 200, 200, false],
        [0, 0, 0, 0,        100, 150, 200, 200, false],
        [0, 0, 0, 0,        100, 150, -200, 200, false],
        [0, 0, 0, 0,        100, -150, -200, 200, true],
        [0, 0, 0, 0,        -100, -150, -200, -200, false],
        [0, 0, 0, 0,        -100, 150, -200, 200, false],

    ])('%s', (x11, y11, x21, y21, x12, y12, x22, y22, isIntersecting) => {
        test(`x11: ${x11}, y11: ${y11}, x21: ${x21}, y21: ${y21}, x12: ${x12}, y12: ${y12}, x22: ${x22}, y22: ${y22}, isIntersecting: ${isIntersecting}`, () => {
            expect(new BoundingBox(x11, y11, x21, y21).intersects(new BoundingBox(x12, y12, x22, y22))).toBe(isIntersecting);
        })
    })
})

describe('union', () => {
    describe.each([
        [0, 0, 100, 100,        50, 50, 150, 150,       0, 0, 150, 150],
        [-100, 0, 100, 100,     50, 50, 100, 150,       -100, 0, 100, 150],
        [-100, 0, 100, -100,    0, 0, 0, 0,             -100, -100, 100, 0],

    ])('%s', (x11, y11, x21, y21, x12, y12, x22, y22, x13, y13, x23, y23) => {
        test(`x11: ${x11}, y11: ${y11}, x21: ${x21}, y21: ${y21}, x12: ${x12}, y12: ${y12}, x22: ${x22}, y22: ${y22}, x13: ${x13}, y13: ${y13}, x23: ${x23}, y23: ${y23}`, () => {
            expect(new BoundingBox(x11, y11, x21, y21).union(new BoundingBox(x12, y12, x22, y22))).toStrictEqual(new BoundingBox(x13, y13, x23, y23));
        })
    })
})

describe('intersection', () => {
    describe.each([
        [0, 0, 100, 100,        50, 50, 150, 150,       50, 50, 100, 100],
        [-100, 0, 100, 100,     50, 50, 100, 150,       50, 50, 100, 100],
        [-100, 0, 100, -100,    0, 0, 0, 0,             0, 0, 0, 0],

    ])('%s', (x11, y11, x21, y21, x12, y12, x22, y22, x13, y13, x23, y23) => {
        test(`x11: ${x11}, y11: ${y11}, x21: ${x21}, y21: ${y21}, x12: ${x12}, y12: ${y12}, x22: ${x22}, y22: ${y22}, x13: ${x13}, y13: ${y13}, x23: ${x23}, y23: ${y23}`, () => {
            expect(new BoundingBox(x11, y11, x21, y21).intersection(new BoundingBox(x12, y12, x22, y22))).toStrictEqual(new BoundingBox(x13, y13, x23, y23));
        })
    })
})

describe('offset', () => {
    describe.each([
        [0, 0, 100, 100,        50, 50,       50, 50, 150, 150],
        [-100, 0, 100, 100,     50, 100,      -50, 100, 150, 200],
        [-100, -100, 100, 0,    0, 0,         -100, -100, 100, 0],
        [-100, 0, 100, -100,    -5, -10,      -105, -110, 95, -10],

    ])('%s', (x1, y1, x2, y2, xOffset, yOffset, x1Final, y1Final, x2Final, y2Final) => {
        test(`x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${22}, xOffset: ${xOffset}, yOffset: ${yOffset},
          x1Final: ${x1Final}, y1Final: ${y1Final}, x2Final: ${x2Final}, y2Final: ${y2Final}`,
          () => {
            const b = new BoundingBox(x1, y1, x2, y2);
            b.x += xOffset;
            b.y += yOffset;
            expect(b).toStrictEqual(new BoundingBox(x1Final, y1Final, x2Final, y2Final));
        })
    })
})

describe('moveTo with properties', () => {
    describe.each([
        [0, 0, 100, 100,        50, 50,         50, 50, 150, 150],
        [-100, 0, 100, 100,     50, 50,         50, 50, 250, 150],
        [-100, 0, 100, -100,    0, 0,           0, 0, 200, 100],

    ])('%s', (x1, y1, x2, y2, newX, newY, x1Final, y1Final, x2Final, y2Final) => {
        test(`x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${22}, xOffset: ${newX}, yOffset: ${newY},
          x1Final: ${x1Final}, y1Final: ${y1Final}, x2Final: ${x2Final}, y2Final: ${y2Final}`,
          () => {
            const b = new BoundingBox(x1, y1, x2, y2);
            b.x = newX;
            b.y = newY;
            expect(b).toStrictEqual(new BoundingBox(x1Final, y1Final, x2Final, y2Final));
        })
    })
})
describe('moveTo with function', () => {
    describe.each([
        [0, 0, 100, 100,        50, 50,         50, 50, 150, 150],
        [-100, 0, 100, 100,     50, 50,         50, 50, 250, 150],
        [-100, 0, 100, -100,    0, 0,           0, 0, 200, 100],

    ])('%s', (x1, y1, x2, y2, newX, newY, x1Final, y1Final, x2Final, y2Final) => {
        test(`x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${22}, xOffset: ${newX}, yOffset: ${newY},
          x1Final: ${x1Final}, y1Final: ${y1Final}, x2Final: ${x2Final}, y2Final: ${y2Final}`,
          () => {
            const b = new BoundingBox(x1, y1, x2, y2);
            b.moveTo(newX, newY)
            expect(b).toStrictEqual(new BoundingBox(x1Final, y1Final, x2Final, y2Final));
        })
    })
})
describe('move', () => {
    describe.each([
        [0, 0, 100, 100,        50, 50,         50, 50, 150, 150],
        [-100, 0, 100, 100,     50, 50,         -50, 50, 150, 150],
        [-100, 0, 100, -100,    0, 0,           -100, 0, 100, -100],

    ])('%s', (x1, y1, x2, y2, deltaX, deltaY, x1Final, y1Final, x2Final, y2Final) => {
        test(`x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${22}, xOffset: ${deltaX}, yOffset: ${deltaY},
          x1Final: ${x1Final}, y1Final: ${y1Final}, x2Final: ${x2Final}, y2Final: ${y2Final}`,
          () => {
            const b = new BoundingBox(x1, y1, x2, y2);
            b.move(deltaX, deltaY)
            expect(b).toStrictEqual(new BoundingBox(x1Final, y1Final, x2Final, y2Final));
        })
    })
})
describe('smallest box enclosing a set of box', () => {
    describe.each([
        [[[0, 0, 100, 100],
          [50, 50, 200, 130],
          [-50, 10, 22, 29]],         -50, 0, 200, 130],
        [[[-100, 0, 100, 100, ],
          [50, -50, 200, 130],
          [-50, 10, 220, 290]],         -100, -50, 220, 290],
        [[[-100, 0, 100, -100,],
          [50, 50, 200, 130],
          [-50, 10, 22, 29]],         -100, -100, 200, 130],

    ])('%s', (bboxes, x1Final, y1Final, x2Final, y2Final) => {
        test(`sme2`, () => {
            const bb: BoundingBox[] = [];
            bboxes.forEach(bbox => {
                bb.push(new BoundingBox(bbox[0], bbox[1], bbox[2], bbox[3]))
            });
            const b = BoundingBox.sme2(bb)
            expect(b).toStrictEqual(new BoundingBox(x1Final, y1Final, x2Final, y2Final));
        })
    })
})
