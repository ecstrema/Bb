import { BoundingBox } from '../src/bounding-boxes'
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
