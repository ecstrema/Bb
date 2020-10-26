![Preview](https://github.com/Marr11317/Bb/raw/master/packages/format/img/preview.png)

# Bb-chord-symbol

Javascript chord symbol rendering library.

- [Bb-chord-symbol](#bb-chord-symbol)
  - [Very important part](#very-important-part)
  - [Install](#install)
  - [Usage](#usage)
    - [import](#import)
    - [Basic usage](#basic-usage)
    - [Advanced usage](#advanced-usage)
      - [1: tweaking the config](#1-tweaking-the-config)
      - [2: Post layout processing](#2-post-layout-processing)
  - [Well that's awesome!](#well-thats-awesome)
  - [License](#license)

## Very important part

The "bb" in bb-chord-symbol is pronounced "B flat"

## Install

```shell
npm i bb-format
```

## Usage

### import

```typescript
import { BbFormat } from 'bb-format';
```

### Basic usage

``` typescript
// Get a context to use for rendering
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// Create the renderer instance
const renderer = new BbFormat(ctx);

// Render your chord
formatter.fillChordSymbol('Bb7#9#5/D', 100, 100);
```

![A rendered chord](https://github.com/Marr11317/Bb/raw/master/packages/format/img/basicUsage.png)
*using font [Petaluma Script](https://github.com/steinbergmedia/petaluma)*

### Advanced usage

#### 1: tweaking the config

``` typescript
// Get a context to use for rendering
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// Create the renderer/formatter instance
const formatter = new BbFormat(singleCtx);

// Modify the formatter's config
const options = new BbChordSymbolOptions();
options.parentheses.type = '[]';
options.useMinusSignForMinorChords = false;
options.descriptorVerticalOffset = 0;
options.separator.angle = Math.PI * 20 / 360;

formatter.chordSymbolOptions = options;

// tweak the chord's pre-layout renderer's config
const renderConfig: RendererConfiguration = {
    useShortNamings: false,
    harmonizeAccidentals: true,
    transposeValue: 2, // transpose a whole tone above
}
formatter.rendererOptions = renderConfig;


// Render
formatter.fillChordSymbol('Ab7#9#5/D', 100, 100);
```

![A rendered chord](https://github.com/Marr11317/Bb/raw/master/packages/format/img/complexExample1.png)
*using font [Petaluma Script](https://github.com/steinbergmedia/petaluma)*

#### 2: Post layout processing

``` typescript
// Get a context to use for rendering
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// Create the renderer/formatter instance
const formatter = new BbFormat(singleCtx);

// Get a laid out chord
const laidOutChord: BbText = formatter.layoutChordSymbol('Gb7#5b9/E');
if (!laidOutChord) {
    // You should handle here what happens if the chord could not be parsed.
    // This happens when it is not valid.
    return; // Probably, if you are inside a function.
}

// rotate the all extensions
// all extensions start with either a sharp or a flat
laidOutChord.fragments.filter((v: BbTextFragment) => {
    return v.text.startsWith("\u266F") || v.text.startsWith("\u266D"); // Unicode flat and sharp
}).forEach((v: BbTextFragment) => {
    v.angle = -Math.PI * 40 / 360; // Rotate 40 degrees anti-clockwise
});

// render
formatter.fillText(laidOutChord, 100, 100);
```

![A rendered chord](https://github.com/Marr11317/Bb/raw/master/packages/format/img/complexExample2.png)
*using font [Petaluma Script](https://github.com/steinbergmedia/petaluma)*

## Well that's awesome!

*bb-chord-symbol is licensed under the MIT License. That means you may do whatever you wish with it. However, developing such libraries takes considerable time and effort, so if you find it valuable, please consider supporting me with a donation [via paypal.](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=S2ZCFC2QSQVQ4&source=url)*

## License

MIT

![Giant steps](https://github.com/Marr11317/Bb/raw/master/packages/format/img/GiantSteps.png)
