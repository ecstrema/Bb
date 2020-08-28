# bounding-boxes

Keep track of your elements with bounding boxes.

## Install

    npm install --save bounding-boxes

## Usage

### import
```typescript
import { BoundingBox } from 'bounding-boxes';
```

### Useful functions

```typescript
/**
 * The BoundingBox class contains the 2d coordinates of a point.
 *
 * Note that the the points are always ordered: x1 is always smaller than x2,
 * and y1 is always smaller than y2.
 *
 * Because of this, height and width are always positive.
 */
export class BoundingBox {
    height: number;
    width: number;

    /** The coordinates of the first corner. */
    x1: number;
    y1: number;

    /** The coordinates of the second corner. */
    x2: number
    y2: number;

    /** Constructs an instance of BoundingBox from corners coordinates. */
    constructor(x1: number, y1: number, x2: number, y2: number);

    /** Constructs an instance of BoundingBox from two corners' coordinates. */
    static fromHW(height: number, width: number, x1: number = 0, y1: number = 0): BoundingBox;

    /**
     * Returns true if the point is inside the box, false otherwise.
     * @param x The point's x
     * @param y The point's y
     */
    containsPoint(x: number, y: number): boolean;

    /**
     * Returns true if the other box touches this one.
     * @param other The other bounding box
     */
    intersects(other: BoundingBox): boolean;

    /**
     * Returns the smallest rectangle enclosing this BoundingBox and `other`.
     * @param other The BoundingBox with which to intersect.
     */
    intersection(other: BoundingBox): BoundingBox;

    /**
     * Returns the biggest rectangle enclosed in this BoundingBox and `other`.
     * @param other The other BoundingBox
     */
    union(other: BoundingBox): BoundingBox;
}

```

### Two equivalent boxes
```typescript
// From coordinates        (x1, y1, x2, y2)
let bbox1 = new BoundingBox(10, 10, 20, 20);
// From height and width      (h,  w,  x1, y1)
let bbox2 = BoundingBox.fromHW(10, 10, 10, 10)
```

### some usage...

```typescript
let bbox1 = new BoundingBox(10, 10, 30, 30);
let bbox2 = new BoundingBox(20, 20, 40, 40);

console.log(bbox1.intersects(bbox2));
// true

let union = bbox1.union(bbox2);
//                                   (x1, y1, x2, y2)
console.log(union === new BoundingBox(10, 10, 40, 40));
// true
```

# License

MIT
