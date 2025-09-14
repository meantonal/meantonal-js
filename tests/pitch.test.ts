import { Pitch, Axis, SPN, LilyPond, Helmholtz } from "../src";
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
    const axis = new Axis(SPN.toPitch("C4"), SPN.toPitch("G4"));
    expect(p.invert(axis).isEqual(q)).toBeTruthy();
    p = SPN.toPitch("D4");
    q = SPN.toPitch("F4");
    expect(p.invert(axis).isEqual(q)).toBeTruthy();
});
