import { Pitch, Axis } from "../src";
import { Interval } from "../src";

test("Pitch.fronSPN creates correct Pitch vector", () => {
    let p = Pitch.fromSPN("C4");
    expect(p.w).toEqual(25);
    expect(p.h).toEqual(10);
    p = Pitch.fromSPN("C-1");
    expect(p.w).toEqual(0);
    expect(p.h).toEqual(0);
    p = Pitch.fromSPN("F##4");
    expect(p.w).toEqual(29);
    expect(p.h).toEqual(9);
    p = Pitch.fromSPN("Fx4");
    expect(p.w).toEqual(29);
    expect(p.h).toEqual(9);
    p = Pitch.fromSPN("Eb4");
    expect(p.w).toEqual(26);
    expect(p.h).toEqual(11);
    p = Pitch.fromSPN("Ew4");
    expect(p.w).toEqual(25);
    expect(p.h).toEqual(12);
});

test("Pitch.fronLily creates correct Pitch vector", () => {
    let p = Pitch.fromLily("c'");
    expect(p.w).toEqual(25);
    expect(p.h).toEqual(10);
    p = Pitch.fromLily("c,,,,");
    expect(p.w).toEqual(0);
    expect(p.h).toEqual(0);
    p = Pitch.fromLily("fisis'");
    expect(p.w).toEqual(29);
    expect(p.h).toEqual(9);
    p = Pitch.fromLily("ees'");
    expect(p.w).toEqual(26);
    expect(p.h).toEqual(11);
    p = Pitch.fromLily("eeses'");
    expect(p.w).toEqual(25);
    expect(p.h).toEqual(12);
});

test("Pitch.fromHelmholtz produces correct result", () => {
    let p = Pitch.fromHelmholtz("c'");
    expect(p.w).toEqual(25);
    expect(p.h).toEqual(10);
    p = Pitch.fromHelmholtz("c");
    expect(p.w).toEqual(20);
    expect(p.h).toEqual(8);
    p = Pitch.fromHelmholtz("C");
    expect(p.w).toEqual(15);
    expect(p.h).toEqual(6);
    p = Pitch.fromHelmholtz("C,");
    expect(p.w).toEqual(10);
    expect(p.h).toEqual(4);
    p = Pitch.fromHelmholtz("f#''");
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
    let p = Pitch.fromSPN("C-1");
    expect(p.midi).toEqual(0);
    p = Pitch.fromSPN("C4");
    expect(p.midi).toEqual(60);
    p = Pitch.fromSPN("A4");
    expect(p.midi).toEqual(69);
});

test("Pitch.chroma produces correct result", () => {
    let p = Pitch.fromSPN("C4");
    expect(p.chroma).toEqual(0);
    p = Pitch.fromSPN("Eb4");
    expect(p.chroma).toEqual(-3);
    p = Pitch.fromSPN("F#4");
    expect(p.chroma).toEqual(6);
});

test("Pitch.pc7 produces correct result", () => {
    let p = Pitch.fromSPN("G4");
    expect(p.pc7).toEqual(4);
});

test("Pitch.pc12 produces correct result", () => {
    let p = Pitch.fromSPN("G4");
    expect(p.pc12).toEqual(7);
});

test("Pitch.letter produces correct result", () => {
    let p = Pitch.fromSPN("C4");
    expect(p.letter).toEqual("C");
    p = Pitch.fromSPN("F#4");
    expect(p.letter).toEqual("F");
});

test("Pitch.accidental produces correct result", () => {
    let p = Pitch.fromSPN("C4");
    expect(p.accidental).toEqual(0);
    p = Pitch.fromSPN("F#4");
    expect(p.accidental).toEqual(1);
    p = Pitch.fromSPN("E#4");
    expect(p.accidental).toEqual(1);
    p = Pitch.fromSPN("F4");
    expect(p.accidental).toEqual(0);
    p = Pitch.fromSPN("B4");
    expect(p.accidental).toEqual(0);
    p = Pitch.fromSPN("Bb4");
    expect(p.accidental).toEqual(-1);
    p = Pitch.fromSPN("Fb4");
    expect(p.accidental).toEqual(-1);
    p = Pitch.fromSPN("Fx4");
    expect(p.accidental).toEqual(2);
});

test("Pitch.octave produces correct result", () => {
    let p = Pitch.fromSPN("C4");
    expect(p.octave).toEqual(4);
    p = Pitch.fromSPN("B4");
    expect(p.octave).toEqual(4);
    p = Pitch.fromSPN("C3");
    expect(p.octave).toEqual(3);
    p = Pitch.fromSPN("B3");
    expect(p.octave).toEqual(3);
    p = Pitch.fromSPN("C-1");
    expect(p.octave).toEqual(-1);
    p = Pitch.fromSPN("B-1");
    expect(p.octave).toEqual(-1);
});

test("Pitch.SPN produces correct result", () => {
    let p = Pitch.fromSPN("C4");
    expect(p.SPN).toEqual("C4");
    p = Pitch.fromSPN("Cx-1");
    expect(p.SPN).toEqual("Cx-1");
    p = Pitch.fromSPN("Gbbbb7");
    expect(p.SPN).toEqual("Gbbbb7");
});

test("Pitch.Lily produces correct result", () => {
    let lily = "c'";
    let p = Pitch.fromLily(lily);
    expect(p.lily).toEqual(lily);
    lily = "aes";
    p = Pitch.fromLily(lily);
    expect(p.lily).toEqual(lily);
    lily = "gisis'''";
    p = Pitch.fromLily(lily);
    expect(p.lily).toEqual(lily);
    lily = "eeses,,,,";
    p = Pitch.fromLily(lily);
    expect(p.lily).toEqual(lily);
});

test("Pitch.helmholtz produces correct result", () => {
    let helm = "c";
    let p = Pitch.fromHelmholtz(helm);
    expect(p.helmholtz).toEqual(helm);
    helm = "C#";
    p = Pitch.fromHelmholtz(helm);
    expect(p.helmholtz).toEqual(helm);
    helm = "Cb,,";
    p = Pitch.fromHelmholtz(helm);
    expect(p.helmholtz).toEqual(helm);
    helm = "fx'''";
    p = Pitch.fromHelmholtz(helm);
    expect(p.helmholtz).toEqual(helm);
});

test("Pitch.equal produces correct result", () => {
    let p = Pitch.fromSPN("C#4");
    let q = Pitch.fromSPN("C#5");
    expect(p.isEqual(q)).toBeFalsy();
    q = Pitch.fromSPN("Db3");
    expect(p.isEqual(q)).toBeFalsy();
    q = Pitch.fromSPN("C#4");
    expect(p.isEqual(q)).toBeTruthy();
});

test("Pitch.enharmonic produces correct result", () => {
    let p = Pitch.fromSPN("C#4");
    let q = Pitch.fromSPN("C#5");
    expect(p.isEnharmonic(q)).toBeTruthy();
    q = Pitch.fromSPN("Db5");
    expect(p.isEnharmonic(q)).toBeTruthy();
    q = Pitch.fromSPN("Db5");
    expect(p.isEnharmonic(q, 31)).toBeFalsy();
    p = Pitch.fromSPN("Ex4");
    q = Pitch.fromSPN("Gbb5");
    expect(p.isEnharmonic(q, 31)).toBeTruthy();
    p = Pitch.fromSPN("Ex4");
    q = Pitch.fromSPN("Gbb5");
    expect(p.isEnharmonic(q)).toBeFalsy();
});

test("Pitch.transposeReal produces correct result", () => {
    let p = Pitch.fromSPN("C4");
    let q = Pitch.fromSPN("F#4");
    let m = Interval.fromName("A4");
    expect(p.transposeReal(m).isEqual(q)).toBeTruthy();
});

test("Pitch.invert produces correct result", () => {
    let p = Pitch.fromSPN("E4");
    let q = Pitch.fromSPN("Eb4");
    const axis = Axis.fromSPN("C4", "G4");
    expect(p.invert(axis).isEqual(q)).toBeTruthy();
    p = Pitch.fromSPN("D4");
    q = Pitch.fromSPN("F4");
    expect(p.invert(axis).isEqual(q)).toBeTruthy();
});
