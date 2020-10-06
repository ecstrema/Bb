# bounding-boxes

Keep track of your elements with bounding boxes.

## Install

    npm install --save bounding-boxes

## Usage

### import

``` typescript
import { BoundingBox } from 'bounding-boxes';
```

### Useful functions

API is also available here()

``` typescript
/**
 * The BoundingBox class contains the 2d coordinates of a point,
 * and has some useful functions such as
 *  - `containsPoint(x, y)`
 *  - `intersects(other)`
 *  - `intersection(other)`
 *  - `union(other)`
 *
 * Note that the the points are always ordered: x1 is always smaller than x2,
 * and y1 is always smaller than y2.
 *
 * Because of this, height and width are always positive.
 */
export declare class BoundingBox {
    /** Constructs an instance from corners coordinates. */
    constructor(x1: number, y1: number, x2: number, y2: number);
    /** Constructs an instance from a corner's coordinates (`x1` and `y1`), a height and a width. */
    static fromHW(height: number, width: number, x1?: number, y1?: number): BoundingBox;

    /**
     * As the name states this function gives the smallest box enclosing
     * a set of boxes (`bboxes`)
     *
     * @see sme
     *
     * @static
     * @param bboxes The culprits
     * @return {BoundingBox}
     */
    static smallestBoxEnclosing(bboxes: BoundingBox[]): BoundingBox;

    /**
     * Smallest Box Enclosing `bboxes`
     *
     * @see smallestBoxEnclosing
     *
     * @static
     * @param bboxes The culprits
     * @return {BoundingBox}
     */
    static sme(bboxes: BoundingBox[]): BoundingBox;

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
    union(other: BoundingBox): BoundingBox;

    /**
     * Returns the biggest rectangle enclosed in this BoundingBox and `other`.
     * @param other The other BoundingBox
     */
    intersection(other: BoundingBox): BoundingBox;

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
    /**
     * Move the bbox to these coordinates.
     *
     * @param x The new x1
     * @param y The new y1
     */
    moveTo(x: number, y: number): void;
    /**
     * Move the bbox by these coordinates.
     *
     * @param x The x shift amount
     * @param y The y shift amount
     */
    move(x: number, y: number): void;

    /** The bounding box's height */
    get height(): number;
    set height(v: number);
    /** The shorter way to the bbox's height */
    get h(): number;
    set h(v: number);
    /** The bounding box's width */
    get width(): number;
    set width(v: number);
    /** The shorter way to the bbox's width */
    get w(): number;
    set w(v: number);
    /** The bounding box's first corner's x */
    private _x1;
    /** The bounding box's first corner's x */
    get x1(): number;
    set x1(v: number);
    /** The bounding box's first corner's y */
    private _y1;
    /** The bounding box's first corner's y */
    get y1(): number;
    set y1(v: number);
    /** The bounding box's second corner's x */
    private _x2;
    /** The bounding box's second corner's x */
    get x2(): number;
    set x2(v: number);
    /** The bounding box's second corner's y */
    private _y2;
    /** The bounding box's second corner's y */
    get y2(): number;
    set y2(v: number);
}
```

## License

MIT
