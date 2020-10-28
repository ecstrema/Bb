import { BbChordSymbolParenthesesOptions } from "./bb-chord-symbol-parentheses-options";
import { BbSeparatorOptions } from "./bb-separator-options";
import { BbChordSymbolDescriptorOptions } from "./bb-chord-symbol-descriptor-options";

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
     * Options that apply to the descriptor.
     * The descriptor is everything except the root and bass notes.
     */
    descriptor = new BbChordSymbolDescriptorOptions();

    /**
     * The vertical margin between extensions.
     * @note this value is a multiplier of the font size.
     *
     * @default 0.05
     */
    extensionsVerticalMargin: number = 0.05;

    /**
     * Extensions are often a little smaller than the root and bass symbols
     *
     * @default 0.9
     */
    extensionsScale: number = 0.9;

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
     * @default 0.27
     */
    bassYOffset: number = 0.27;

    /**
     * Whether to use a '-' sign for minor chords instead of 'mi'
     * @default true
     */
    useMinusSignForMinorChords: boolean = true;
}
