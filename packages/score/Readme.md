# bounding-boxes

Keep track of your elements with bounding boxes.

## Install

``` shell
    npm install --save bounding-boxes
```

## Usage

### import

```typescript
import { BoundingBox } from 'bounding-boxes';
```

### Useful functions

```typescript
/**
 * The BoundingBox class contains the 2d coordinates of a point,
 * and has some useful functions such as
 *  - `containsPoint(x, y)`
 *  - `intersects(other)`
 *  - `intersection(other)`
 *  - `union(other)`
 *
 * If you wish to modify x1 and x2 simultaneously, use the x property.
 * Same applies for y.
 *
 * Note that the the points are always ordered: x1 is always smaller than x2,
 * and y1 is always smaller than y2.
 *
 * Because of this, height and width are always positive.
 */
export declare class BoundingBox {
    /** The bounding box's height */
    height: number;
    /** The bounding box's width */
    width: number;

    /** The bounding box's first corner's x */
    x1: number;
    /** The bounding box's first corner's y */
    y1: number;
    /** The bounding box's second corner's x */
    x2: number;
    /** The bounding box's second corner's y */
    y2: number;


    /** Constructs an instance from corners coordinates. */
    constructor(x1: number, y1: number, x2: number, y2: number);

    /** Constructs an instance from a corner's coordinates (`x1` and `y1`), a height and a width. */
    static fromHW(height: number, width: number, x1?: number, y1?: number): BoundingBox;

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

    /**
     * The box's global x (lowest corner)
     * Use this property to move the box around without changing its width.
     *
     * @example
     * ```
     * a = new BoundingBox(0, 0, 10, 10);
     * // a.x = 0, a.x1 = 0, a.x2 = 10
     *
     * a.x = 10
     * // a.x = 10, a.x1 = 10, a.x2 = 20
     * ```
     */
    get x(): number;
    set x(x: number);

    /**
     * The box's global y (lowest corner)
     * Use this property to move the box around without changing its height.
     *
     * @example
     * ```
     * a = new BoundingBox(0, 0, 10, 10);
     * // a.y = 0, a.y1 = 0, a.y2 = 10
     *
     * a.x = 10
     * // a.y = 10, a.y1 = 10, a.y2 = 20
     * ```
     */
    get y(): number;
    set y(y: number);
}


```

### Two equivalent boxes

```typescript
// From coordinates        (x1, y1, x2, y2)
let bbox1 = new BoundingBox(10, 10, 20, 20);
// From height and width      (h,  w,  x1, y1)
let bbox2 = BoundingBox.fromHW(10, 10, 10, 10)
```

### Example

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

## Wow, all I've been dreaming of!

*bb-score is licensed under the MIT License. That means you may do whatever you wish with it. However, developing such libraries takes considerable time and effort, so if you find it valuable, please consider supporting me with a donation [via paypal.](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=S2ZCFC2QSQVQ4&source=url)*

## License

MIT
