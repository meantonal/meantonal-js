import { Pitch, Axis, SPN, LilyPond, Helmholtz } from "../src";
import { Interval } from "../src";

test("Pitch.fronSPN creates correct Pitch vector", () => {
    let p = SPN.toPitch("C4");
    expect(p.w).toEqual(25);
    expect(p.h).toEqual(10);
    p = SPN.toPitch("C-1");
    expect(p.w).toEqual(0);
    expect(p.h).toEqual(0);
    p = SPN.toPitch("F##4");
    expect(p.w).toEqual(29);
    expect(p.h).toEqual(9);
    p = SPN.toPitch("Fx4");
    expect(p.w).toEqual(29);
    expect(p.h).toEqual(9);
    p = SPN.toPitch("Eb4");
    expect(p.w).toEqual(26);
    expect(p.h).toEqual(11);
    p = SPN.toPitch("Ew4");
    expect(p.w).toEqual(25);
    expect(p.h).toEqual(12);
});

test("Pitch.fronLily creates correct Pitch vector", () => {
    let p = LilyPond.toPitch("c'");
    expect(p.w).toEqual(25);
    expect(p.h).toEqual(10);
    p = LilyPond.toPitch("c,,,,");
    expect(p.w).toEqual(0);
    expect(p.h).toEqual(0);
    p = LilyPond.toPitch("fisis'");
    expect(p.w).toEqual(29);
    expect(p.h).toEqual(9);
    p = LilyPond.toPitch("ees'");
    expect(p.w).toEqual(26);
    expect(p.h).toEqual(11);
    p = LilyPond.toPitch("eeses'");
    expect(p.w).toEqual(25);
    expect(p.h).toEqual(12);
});

test("Helmholtz.toPitch produces correct result", () => {
    let p = Helmholtz.toPitch("c'");
    expect(p.w).toEqual(25);
    expect(p.h).toEqual(10);
    p = Helmholtz.toPitch("c");
    expect(p.w).toEqual(20);
    expect(p.h).toEqual(8);
    p = Helmholtz.toPitch("C");
    expect(p.w).toEqual(15);
    expect(p.h).toEqual(6);
    p = Helmholtz.toPitch("C,");
    expect(p.w).toEqual(10);
    expect(p.h).toEqual(4);
    p = Helmholtz.toPitch("f#''");
    expect(p.w).toEqual(33);
    expect(p.h).toEqual(12);
});

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

test("Pitch.SPN produces correct result", () => {
    let p = SPN.toPitch("C4");
    expect(SPN.fromPitch(p)).toEqual("C4");
    p = SPN.toPitch("Cx-1");
    expect(SPN.fromPitch(p)).toEqual("Cx-1");
    p = SPN.toPitch("Gbbbb7");
    expect(SPN.fromPitch(p)).toEqual("Gbbbb7");
});

test("Pitch.Lily produces correct result", () => {
    let lily = "c'";
    let p = LilyPond.toPitch(lily);
    expect(LilyPond.fromPitch(p)).toEqual(lily);
    lily = "aes";
    p = LilyPond.toPitch(lily);
    expect(LilyPond.fromPitch(p)).toEqual(lily);
    lily = "gisis'''";
    p = LilyPond.toPitch(lily);
    expect(LilyPond.fromPitch(p)).toEqual(lily);
    lily = "eeses,,,,";
    p = LilyPond.toPitch(lily);
    expect(LilyPond.fromPitch(p)).toEqual(lily);
});

test("Pitch.helmholtz produces correct result", () => {
    let helm = "c";
    let p = Helmholtz.toPitch(helm);
    expect(Helmholtz.fromPitch(p)).toEqual(helm);
    helm = "C#";
    p = Helmholtz.toPitch(helm);
    expect(Helmholtz.fromPitch(p)).toEqual(helm);
    helm = "Cb,,";
    p = Helmholtz.toPitch(helm);
    expect(Helmholtz.fromPitch(p)).toEqual(helm);
    helm = "fx'''";
    p = Helmholtz.toPitch(helm);
    expect(Helmholtz.fromPitch(p)).toEqual(helm);
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
