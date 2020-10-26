/**
 * Separator options.
 *
 * @export
 * @class BbSeparatorOptions
 */


export class BbSeparatorOptions {

    /**
     * Apply a relative Y offset to the separator before the bass note.
     */
    yOffset: number = 0.1;

    /**
     * Inset the separator left.
     */
    leftInset: number = 0.15;

    /**
     * Inset the separator right.
     */
    rightInset: number = 0.1;

    /**
     * This angle in radian will be applied to the separator.
     *
     * Useful if your font's separator is too or not enough slanted.
     *
     * @note that the separator's bounding box is not modified accordingly,
     * and is not giving true results anymore.
     */
    angle: number = 0;

    /**
     * X scale factor.
     */
    scaleX: number = 0.8;
    /**
     * Y scale factor.
     */
    scaleY: number = 1.3;
}
