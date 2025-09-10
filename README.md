## Table of Contents

- [Meantonal](#meantonal)
- [Installation](#installation)
- [Documentation](#documentation)

<img align="left" src="/logo.svg" width="48">
  
# Meantonal

Meantonal is a specification for representing pitch information in Western music, and a suite of tools for operating on this information. It's a small, focused library that aims to empower developers to build musical apps more easily.

Meantonal is:

- **Flexible with I/O**: easily ingest and translate between Scientific Pitch Notation, Helmholtz notation, ABC and Lilypond. Extract MIDI values at any time.
- **Semantically nondestructive**: the distinction between enharmonic notes such as $\sf{C}\sharp$ and $\sf{D}\flat$ is maintained. Things that don't behave the same way musically are not encoded the same way in Meantonal.
- **Just vectors**: under the hood [pitches](https://meantonal.org/learn/pitch/) and [intervals](https://meantonal.org/learn/intervals/) are 2d vectors. Operations are simple to understand, surprisingly powerful, and fast to execute.
- **Tuning-agnostic**: Target any meantone tuning system, not just 12-tone equal temperament. You want 31 tones per octave? Done.

For the C implementation of Meantonal [click here](https://github.com/meantonal/meantonal-c).

## Installation

Adding Meantonal to your project is as simple as running:

```bash
npm install meantonal
```

You're now ready to import and use Meantonal's classes.

```ts
import { Pitch, Interval, TonalContext, Axis } from "meantonal";

let p = Pitch.fromSPN("C4");
let q = Pitch.fromSPN("E4");

let m = p.intervalTo(q);
let n = Interval.fromName("M3");

m.isEqual(n); // true

let context = TonalContext.fromStrings("Eb", "major");

q = q.snapDiatonic(context); // q has now snapped to Eb4

let axis = Axis.fromSPN("D4", "A4");

q = q.invert(axis); // q is now G#4
```

## Documentation

A full reference of the TypeScript implementation of Meantonal can be found [here](https://meantonal.org/js)
