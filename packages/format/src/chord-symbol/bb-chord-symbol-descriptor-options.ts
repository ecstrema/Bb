/**
 * The descriptor is everything except the root and bass notes.
 *
 * @class BbChordSymbolDescriptorOptions
 */
export class BbChordSymbolDescriptorOptions {
    /**
     * The horizontal inset to apply to the descriptor.
     *
     * @note this value is a multiplier of the font size.
     *
     * @default 0;
     */
    horizontalInset: number = 0;

    /**
     * The vertical offset to apply to the descriptor.
     *
     * @note this value is a multiplier of the font size.
     *
     * @default 0.35
     */
    verticalOffset: number = 0.35;

    /**
     * Descriptor scale factor.
     * You'll generally want to keep that in sync with [[extensionsScale]]
     *
     * @default 0.9
     */
    scale: number = 0.9;
}
