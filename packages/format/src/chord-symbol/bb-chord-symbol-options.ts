import { BbChordSymbolParenthesesOptions } from "./bb-chord-symbol-parentheses-options";
import { BbSeparatorOptions } from "./bb-separator-options";

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
    descriptorHorizontalInset: number = 0;
    /**
     * The vertical offset to apply to the descriptor.
     * The descriptor is everything except the root and bass notes.
     *
     * @note this value is a multiplier of the font size.
     */
    descriptorVerticalOffset: number = 0.35;

    /**
     * The vertical margin between extensions.
     * @note this value is a multiplier of the font size.
     */
    extensionsVerticalMargin: number = 0.05;

    /**
     * Options applying to parentheses.
     */
    parentheses = new BbChordSymbolParenthesesOptions();

    /**
     * Options that apply to the separator.
     *
     * The separator is the slash between the quality and the bass note.
     */
    separator = new BbSeparatorOptions();

    /**
     * Apply a relative Y offset to the bass note.
     */
    bassYOffset: number = 0.27;

    /**
     * Wheter to use a '-' sign for minor chords instead of 'mi'
     *
     */
    useMinusSignForMinorChords: boolean = true;
}
