/**
 * Options that apply to all parentheses.
 *
 * @export
 * @class BbChordSymbolParenthesesOptions
 */
export class BbChordSymbolParenthesesOptions {
    /**
     * Whether or note parentheses should be shown.
     *
     * @default true;
     */
    show: boolean = true;

    /**
     * A **2** character an opening a closing character. An error will be thrown if
     * there is less than 2 characters. Subsequent characters will be ignored.
     *
     * Examples:
     * ```
     * '()' -> default
     * '[]'
     * '{}'
     * '⟨⟩'
     * '||'
     * ```
     *
     * @default '()'
     */
    type: string = '()';

    /**
     * How much the parentheses will be bigger than their content.
     *
     * By default, parentheses have a scale of 1.2 times their content.
     * @default 1.2
     */
    scale: number = 1.2;

    /**
     * Options that apply to the right (i.e. closing) parenthesis.
     */
    right: BbChordSymbolParenthesisOptions = new BbChordSymbolParenthesisOptions();

    /**
     * Options that apply to the left (i.e. opening) parenthesis.
     */
    left: BbChordSymbolParenthesisOptions = new BbChordSymbolParenthesisOptions();

}

/**
 * Options that apply to a single parenthesis.
 *
 * @export
 * @class BbChordSymbolParenthesisOptions
 */
export class BbChordSymbolParenthesisOptions {
    /**
     * How much the extensions will inset in the parenthesis.
     * @default 0.2
     */
    inset: number = 0.0;

    /**
     * In some fonts, parentheses have a slight slant up or down.
     * You might want to still make things look good by adjusting this value.
     * @default 0
     */
    yOffset: number = 0;
}
