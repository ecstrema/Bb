export class BbFormatUtil {
    static getContextFontSize(context: CanvasRenderingContext2D): number {
        const fontFragments = context.font.split(" ");
        for (const fragment of fontFragments) {
            const regExpResult = fragment.match(/([0-9]+)px/);
            if (regExpResult) {
                return parseInt(regExpResult[0], 10);
            }
        }
        return 12;
    }

    static replaceSharpsFlats(str: string) {
        return str.replace('b', '\u266D').replace('#', '\u266F');
    }
}
