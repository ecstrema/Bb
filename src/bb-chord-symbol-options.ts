/**
 * The options that can be passed to a BbRenderer
 * to modify how it renders chord symbols.
 *
 * @note All numeric values are a multiplier of the font size.
 * @export
 * @class BbChordSymbolOptions
 */
export class BbChordSymbolOptions {
    /**
     * The horizontal inset to apply to the descriptor.
     * The descriptor is everything except the root and bass notes.
     *
     * @note this value is a multiplier of the font size.
     */
    descriptorHorizontalInset: number = 0.05;
    /**
     * The vertical offset to apply to the descriptor.
     * The descriptor is everything except the root and bass notes.
     *
     * @note this value is a multiplier of the font size.
     */
    descriptorVerticalOffset: number = 0.3;

    /**
     * The vertical margin between extensions.
     * @note this value is a multiplier of the font size.
     */
    extensionsVerticalMargin: number = 0.1;


    /**
     * Whether or note parentheses should be shown.
     */
    showParentheses: boolean = true;

    /**
     * How much the extensions will inset in the parentheses
     *
     */
    parenthesesInset: number = 0.1;

    /**
     * In most fonts, Parentheses aren't made to be scaled
     * and are not exactly centered vertically over the letters.
     *
     * To prevent this, you should override
     */
    parenthesesYOffset: number = -0.1;

    /**
     * The how much the parentheses will be bigger than their content
     */
    parenthesesMargin: number = 0.4;


    separatorLeftInset: number = 0.15;
    separatorRightInset: number = 0.05;
    separatorYOffset: number = 0.3;
    bassYOffset: number = 0.1;
}
