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

    /** The bounding box's width */
    public get width() : number {
        return this.x2 - this.x1;
    }
    public set width(v : number) {
        this.x2 = this.x1 + v;
        this.orderX();
    }

    /** The bounding box's first corner x's */
    private _x1 : number;
    /** The bounding box's first corner x's */
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
    intersection(other: BoundingBox): BoundingBox {
        return new BoundingBox(Math.min(this.x1, other.x1), Math.min(this.y1, other.y1),
                               Math.max(this.x2, other.x2), Math.max(this.y2, other.y2));
    }

    /**
     * Returns the biggest rectangle enclosed in this BoundingBox and `other`.
     * @param other The other BoundingBox
     */
    union(other: BoundingBox): BoundingBox {
        return new BoundingBox(Math.max(this.x1, other.x1), Math.max(this.y1, other.y1),
                               Math.min(this.x2, other.x2), Math.min(this.y2, other.y2));
    }

    /**
     * Move the box in such a way that the new x1 is the x provided
     * and the new y1 is the provided y.
     *
     * Height and width are kept intact
     * @param x the new x1
     * @param y the new y1
     *
     * @returns `this` for chaining.
     */
    move(x: number, y: number): BoundingBox {
        const h = this.height;
        const w = this.width;

        this._x1 = x;
        this._y1 = y;
        this._x2 = x + w;
        this._y2 = y + h;

        return this;
    }

    /**
     * Offset the the box by x and y.
     * @param x How much to offset the box over the x axis.
     * @param y How much to offset the box over the y axis.
     *
     * @returns `this` for chaining.
     */
    offset(x: number, y: number): BoundingBox {
        this._x1 += x;
        this._x2 += x;
        this._y1 += y;
        this._y2 += y;

        return this;
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
