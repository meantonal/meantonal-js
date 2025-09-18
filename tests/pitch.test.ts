import { Pitch, MirrorAxis, SPN, LilyPond, Helmholtz, TonalContext } from "../src";
import { Interval } from "../src";

test("Pitch.fromChroma creates correct Pitch vector", () => {
    let p = Pitch.fromChroma(0, 4);
    expect(p.w).toEqual(25);
    expect(p.h).toEqual(10);
    p = Pitch.fromChroma(6, 4);
    expect(p.w).toEqual(28);
    expect(p.h).toEqual(10);
});

test("Pitch.midi produces correct result", () => {
    let p = SPN.toPitch("C-1");
    expect(p.midi).toEqual(0);
    p = SPN.toPitch("C4");
    expect(p.midi).toEqual(60);
    p = SPN.toPitch("A4");
    expect(p.midi).toEqual(69);
});

test("Pitch.chroma produces correct result", () => {
    let p = SPN.toPitch("C4");
    expect(p.chroma).toEqual(0);
    p = SPN.toPitch("Eb4");
    expect(p.chroma).toEqual(-3);
    p = SPN.toPitch("F#4");
    expect(p.chroma).toEqual(6);
});

test("Pitch.pc7 produces correct result", () => {
    let p = SPN.toPitch("G4");
    expect(p.pc7).toEqual(4);
});

test("Pitch.pc12 produces correct result", () => {
    let p = SPN.toPitch("G4");
    expect(p.pc12).toEqual(7);
});

test("Pitch.letter produces correct result", () => {
    let p = SPN.toPitch("C4");
    expect(p.letter).toEqual("C");
    p = SPN.toPitch("F#4");
    expect(p.letter).toEqual("F");
});

test("Pitch.accidental produces correct result", () => {
    let p = SPN.toPitch("C4");
    expect(p.accidental).toEqual(0);
    p = SPN.toPitch("F#4");
    expect(p.accidental).toEqual(1);
    p = SPN.toPitch("E#4");
    expect(p.accidental).toEqual(1);
    p = SPN.toPitch("F4");
    expect(p.accidental).toEqual(0);
    p = SPN.toPitch("B4");
    expect(p.accidental).toEqual(0);
    p = SPN.toPitch("Bb4");
    expect(p.accidental).toEqual(-1);
    p = SPN.toPitch("Fb4");
    expect(p.accidental).toEqual(-1);
    p = SPN.toPitch("Fx4");
    expect(p.accidental).toEqual(2);
});

test("Pitch.octave produces correct result", () => {
    let p = SPN.toPitch("C4");
    expect(p.octave).toEqual(4);
    p = SPN.toPitch("B4");
    expect(p.octave).toEqual(4);
    p = SPN.toPitch("C3");
    expect(p.octave).toEqual(3);
    p = SPN.toPitch("B3");
    expect(p.octave).toEqual(3);
    p = SPN.toPitch("C-1");
    expect(p.octave).toEqual(-1);
    p = SPN.toPitch("B-1");
    expect(p.octave).toEqual(-1);
});

test("Pitch.toSteps produces correct result", () => {
    let p = SPN.toPitch("C4");
    let q = SPN.toPitch("F#4");
    expect(p.stepsTo(q)).toEqual(3);
    q = SPN.toPitch("Ab3");
    expect(p.stepsTo(q)).toEqual(-2);
    q = SPN.toPitch("C#4");
    expect(p.stepsTo(q)).toEqual(0);
});

test("Pitch.equal produces correct result", () => {
    let p = SPN.toPitch("C#4");
    let q = SPN.toPitch("C#5");
    expect(p.isEqual(q)).toBeFalsy();
    q = SPN.toPitch("Db3");
    expect(p.isEqual(q)).toBeFalsy();
    q = SPN.toPitch("C#4");
    expect(p.isEqual(q)).toBeTruthy();
});

test("Pitch.enharmonic produces correct result", () => {
    let p = SPN.toPitch("C#4");
    let q = SPN.toPitch("C#5");
    expect(p.isEnharmonic(q)).toBeTruthy();
    q = SPN.toPitch("Db5");
    expect(p.isEnharmonic(q)).toBeTruthy();
    q = SPN.toPitch("Db5");
    expect(p.isEnharmonic(q, 31)).toBeFalsy();
    p = SPN.toPitch("Ex4");
    q = SPN.toPitch("Gbb5");
    expect(p.isEnharmonic(q, 31)).toBeTruthy();
    p = SPN.toPitch("Ex4");
    q = SPN.toPitch("Gbb5");
    expect(p.isEnharmonic(q)).toBeFalsy();
});

test("Pitch.transposeReal produces correct result", () => {
    let p = SPN.toPitch("C4");
    let q = SPN.toPitch("F#4");
    let m = Interval.fromName("A4");
    expect(p.transposeReal(m).isEqual(q)).toBeTruthy();
});

test("Pitch.invert produces correct result", () => {
    let p = SPN.toPitch("E4");
    let q = SPN.toPitch("Eb4");
    const axis = MirrorAxis.fromSPN("C4", "G4");
    expect(p.invert(axis).isEqual(q)).toBeTruthy();
    p = SPN.toPitch("D4");
    q = SPN.toPitch("F4");
    expect(p.invert(axis).isEqual(q)).toBeTruthy();
});

test("Pitch.range.diatonic produces correct range", () => {
    let from = SPN.toPitch("C4");
    let to = SPN.toPitch("C5");
    let context = TonalContext.fromStrings("C", "major");
    let range = Array.from(Pitch.range.diatonic(from, to, context)).map(p => SPN.fromPitch(p));
    expect(range).toContain("C4");
    expect(range).toContain("D4");
    expect(range).toContain("E4");
    expect(range).toContain("F4");
    expect(range).toContain("G4");
    expect(range).toContain("A4");
    expect(range).toContain("B4");
    expect(range).toContain("C5");
    expect(range).not.toContain("C#4");
    expect(range).not.toContain("B3");
    expect(range).not.toContain("C#5");
    expect(range).not.toContain("Db5");
});

test("Pitch.range.chromatic produces correct range", () => {
    let from = SPN.toPitch("C4");
    let to = SPN.toPitch("E5");
    let context = TonalContext.fromStrings("C", "major");
    let range = Array.from(Pitch.range.chromatic(from, to, context)).map(p => SPN.fromPitch(p));
    expect(range).toContain("C4");
    expect(range).toContain("C#4");
    expect(range).toContain("Db4");
    expect(range).toContain("D4");
    expect(range).toContain("D#4");
    expect(range).toContain("Eb4");
    expect(range).toContain("E4");
    expect(range).toContain("F4");
    expect(range).toContain("F#4");
    expect(range).toContain("Gb4");
    expect(range).toContain("G4");
    expect(range).toContain("G#4");
    expect(range).toContain("Ab4");
    expect(range).toContain("A4");
    expect(range).toContain("A#4");
    expect(range).toContain("Bb4");
    expect(range).toContain("B4");
    expect(range).toContain("C5");
    expect(range).toContain("C#5");
    expect(range).toContain("Db5");
    expect(range).toContain("D5");
    expect(range).toContain("D#5");
    expect(range).toContain("Eb5");
    expect(range).toContain("E5");
    expect(range).not.toContain("B3");
    expect(range).not.toContain("E#4");
    expect(range).not.toContain("Fb4");
    expect(range).not.toContain("F5");
});
