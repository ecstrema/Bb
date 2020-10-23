/**
 * Options that apply to all parentheses.
 *
 * @export
 * @class BbChordSymbolParenthesesOptions
 */
export class BbChordSymbolParenthesesOptions {
    /**
     * Whether or note parentheses should be shown.
     */
    show: boolean = true;

    /**
     * The parenthesis type to show.
     * It should be one of
     *  - `BbParenthesisType.Parenthesis`
     *  - `BbParenthesisType.Bracket`
     *  - `BbParenthesisType.Brace`
     *
     */
    type: BbParenthesisType = BbParenthesisType.Parenthesis;

    /**
     * How much the parentheses will be bigger than their content.
     *
     * By default, parentheses have a scale of 1.1 times their content.
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
     * How much the extensions will inset in the left parenthesis
     */
    inset: number = 0.2;

    /**
     * In some fonts, parentheses have a slight slant up or down.
     * You might want to still make things look good by adjusting this value.
     */
    yOffset: number = 0;
}

/**
 * Available Parenthesis types.
 *
 * @export
 * @enum {number}
 */
export enum BbParenthesisType {
    Parenthesis = 0,
    Bracket = 1,
    Brace = 2
}

/**
 * Where opening and closing parentheses are defined.
 *
 * This class also offers convenient functions for checking if the parenthesis is opening or closing.
 *
 * @export
 * @class BbParenthesisUtil
 */
export class BbParenthesisUtil {
    static opening: string[] = [
        '(',
        '[',
        '{'
    ]

    static closing: string[] = [
        ')',
        ']',
        '}'
    ]

    /**
     * True if the text provided is part of the 'opening' array.
     */
    static isOpening(text: string): boolean {
        return this.opening.includes(text);
    }

    /**
     * True if the text provided is part of the 'closing' array.
     */
    static isClosing(text: string): boolean {
        return this.closing.includes(text);
    }

}
