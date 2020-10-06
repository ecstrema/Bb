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
export class BoundingBox {
    /** The bounding box's height */
    public get height() : number {
        return this.y2 - this.y1;
    }
    public set height(v : number) {
        this.y2 = this.y1 + v;
        this.orderY();
    }
    /** The shorter way to the bbox's height */
    public get h(): number {
        return this.height;
    }
    public set h(v: number) {
        this.height = v;
    }

    /** The bounding box's width */
    public get width() : number {
        return this.x2 - this.x1;
    }
    public set width(v : number) {
        this.x2 = this.x1 + v;
        this.orderX();
    }
    /** The shorter way to the bbox's width */
    public get w(): number {
        return this.width;
    }
    public set w(v: number) {
        this.width = v;
    }

    /** The bounding box's first corner's x */
    private _x1 : number;
    /** The bounding box's first corner's x */
    public get x1() : number {
        return this._x1;
    }
    public set x1(v : number) {
        this._x1 = v;
        this.orderX();
    }

    /** The bounding box's first corner's y */
    private _y1 : number;
    /** The bounding box's first corner's y */
    public get y1() : number {
        return this._y1;
    }
    public set y1(v : number) {
        this._y1 = v;
        this.orderY();
    }

    /** The bounding box's second corner's x */
    private _x2 : number;
    /** The bounding box's second corner's x */
    public get x2() : number {
        return this._x2;
    }
    public set x2(v : number) {
        this._x2 = v;
        this.orderX();
    }

    /** The bounding box's second corner's y */
    private _y2: number;
    /** The bounding box's second corner's y */
    public get y2(): number {
        return this._y2;
    }
    public set y2(v: number) {
        this._y2 = v;
        this.orderY();
    }

    /** Constructs an instance from corners coordinates. */
    constructor(x1: number, y1: number, x2: number, y2: number) {
        this._x1 = x1;
        this._y1 = y1;
        this._x2 = x2;
        this._y2 = y2;
        this.order();
    }

    /** Constructs an instance from a corner's coordinates (`x1` and `y1`), a height and a width. */
    static fromHW(height: number, width: number, x1: number = 0, y1: number = 0): BoundingBox {
        return new BoundingBox(x1, y1, x1 + width, y1 + height);
    }

    /**
     * Returns true if the point is inside the box, false otherwise.
     * @param x The point's x
     * @param y The point's y
     */
    containsPoint(x: number, y: number): boolean {
        return BoundingBox.between(x, this.x1, this.x2) && BoundingBox.between(y, this.y1, this.y2);
    }

    /**
     * @ignore
     */
    private static between(x: number, x1: number, x2: number): boolean {
        return x >= x1 && x <= x2;
    }

    /**
     * Returns true if the other box touches this one.
     * @param other The other bounding box
     */
    intersects(other: BoundingBox): boolean {
        return !(this.x1 > other.x2 || this.x2 < other.x1 || this.y1 > other.y2 || this.y2 < other.y1);
    }

    /**
     * Returns the smallest rectangle enclosing this BoundingBox and `other`.
     * @param other The BoundingBox with which to intersect.
     */
    union(other: BoundingBox): BoundingBox {
        return new BoundingBox(Math.min(this.x1, other.x1), Math.min(this.y1, other.y1),
                               Math.max(this.x2, other.x2), Math.max(this.y2, other.y2));
    }

    /**
     * Returns the biggest rectangle enclosed in this BoundingBox and `other`.
     * @param other The other BoundingBox
     */
    intersection(other: BoundingBox): BoundingBox {
        return new BoundingBox(Math.max(this.x1, other.x1), Math.max(this.y1, other.y1),
                               Math.min(this.x2, other.x2), Math.min(this.y2, other.y2));
    }

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
    public get x(): number { return this._x1; }
    public set x(x: number) {
        const w = this.width;

        this._x1 = x;
        this._x2 = x + w;
    }

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
    public get y(): number { return this._y1; }
    public set y(y: number) {
        const h = this.height;

        this._y1 = y;
        this._y2 = y + h;
    }

    /**
     * Move the bbox to these coordinates.
     *
     * @param x The new x1
     * @param y The new y1
     */
    moveTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    /**
     * Move the bbox by these coordinates.
     *
     * @param x The x shift amount
     * @param y The y shift amount
     */
    move(x: number, y: number): void {
        this.x += x;
        this.y += y;
    }

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
    static smallestBoxEnclosing(bboxes: BoundingBox[]): BoundingBox {
        return this.sme(bboxes);
    }

    /**
     * Smallest Box Enclosing `bboxes`
     *
     * @see smallestBoxEnclosing
     *
     * @static
     * @param bboxes The culprits
     * @return {BoundingBox}
     */
    static sme(bboxes: BoundingBox[]): BoundingBox {
        let result = new BoundingBox(0, 0, 0, 0)
        bboxes.forEach((bbox) => {
            result = result.union(bbox)
        })
        return result;
    }


    /**
     * Return a copy of the bounding box
     */
    copy(): BoundingBox {
        return new BoundingBox(this.x1, this.y1, this.x2, this.y2);
    }

    /**
     * Add a margin around the box.
     *
     * ```
     *  new__________
     *    |  ______  |
     *    | | old  | |
     *    | |      | |
     *    | |______| |
     *    |__________| |=margin
     * ```
     *
     * @param margin The spacing between the old and new box
     */
    addMargin(margin: number): void {
        this._x1 -= margin;
        this._x2 += margin;
        this._y1 -= margin;
        this._y2 += margin;
        this.order()
    }

    /**
     * Adds margins around the box.
     * Note that this function uses screen coordinates: (0, 0) is the **top**-left corner
     *
     * @param left The margin to add after `x1`
     * @param top The margin to add before `y1`
     * @param right The margin to add before `x2`
     * @param bottom The margin to add after `y2`
     */
    addMargins(left: number, top: number, right: number, bottom: number): void {
        this._x1 -= left;
        this._x2 += right;
        this._y1 -= top;
        this._y2 += bottom;
        this.order()
    }

    /**
     * Ensure that x1 is smaller than x2, and swap if needed.
     * Do the same for y1 and y2.
     * @ignore
     */
    private order(): void {
        this.orderX();
        this.orderY();
    }

    /** @ignore */
    private orderX() {
        if (this.x1 > this.x2) {
            [this.x1, this.x2] = [this.x2, this.x1];
        }
    }

    /** @ignore */
    private orderY() {
        if (this.y1 > this.y2) {
            [this.y1, this.y2] = [this.y2, this.y1];
        }
    }

}
