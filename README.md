# Table of Contents

- [Meantonal](#meantonal)
- [Installation](#installation)

<img align="left" src="/logo.svg" width="48">
  
# Meantonal

Meantonal is a specification for representing pitch information in Western music, and a suite of tools for operating on this information. It's a small, focused library that aims to empower developers to build musical apps more easily.

Meantonal is:

- **Flexible with I/O**: easily ingest and translate between Scientific Pitch Notation, Helmholtz notation, ABC and Lilypond. Extract MIDI values at any time.
- **Semantically nondestructive**: the distinction between enharmonic notes such as $\sf{C}\sharp$ and $\sf{D}\flat$ is maintained. Things that don't behave the same way musically are not encoded the same way in Meantonal.
- **Just vectors**: under the hood [pitches](https://meantonal.org/learn/pitch/) and [intervals](https://meantonal.org/learn/intervals/) are 2d vectors. Operations are simple to understand, surprisingly powerful, and fast to execute.
- **Tuning-agnostic**: Target any meantone tuning system, not just 12-tone equal temperament. You want 31 tones per octave? Done.

# Installation

Adding Meantonal to your project is as simple as running:

```bash
npm install meantonal
```
