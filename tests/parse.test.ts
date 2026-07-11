import { ABC, Helmholtz, LilyPond, SPN } from "../src";

test("SPN.toPitch creates correct Pitch vector", () => {
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

test("SPN.fromPitch produces correct result", () => {
    let p = SPN.toPitch("C4");
    expect(SPN.fromPitch(p)).toEqual("C4");
    p = SPN.toPitch("Cx-1");
    expect(SPN.fromPitch(p)).toEqual("Cx-1");
    p = SPN.toPitch("Gbbbb7");
    expect(SPN.fromPitch(p)).toEqual("Gbbbb7");
});

test("SPN.fromPitch throws for an accidental beyond ±8", () => {
    // Adding n to w and subtracting n from h raises the accidental by n
    // without changing the letter or octave.
    let p = SPN.toPitch("C4");
    p.w += 8;
    p.h -= 8;
    expect(SPN.fromPitch(p)).toEqual("C" + "#".repeat(8) + "4");
    p.w += 1;
    p.h -= 1;
    expect(() => SPN.fromPitch(p)).toThrow();
});

test("LilyPond.toPitch creates correct Pitch vector", () => {
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

test("LilyPong.fromPitch produces correct result", () => {
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

test("LilyPond.fromPitch throws for an accidental beyond ±2", () => {
    // Adding n to w and subtracting n from h raises the accidental by n
    // without changing the letter or octave.
    let p = LilyPond.toPitch("c");
    p.w += 2;
    p.h -= 2;
    expect(LilyPond.fromPitch(p)).toEqual("c" + "is".repeat(2));
    p.w += 1;
    p.h -= 1;
    expect(() => LilyPond.fromPitch(p)).toThrow();

    p = LilyPond.toPitch("c");
    p.w -= 2;
    p.h += 2;
    expect(LilyPond.fromPitch(p)).toEqual("c" + "es".repeat(2));
    p.w -= 1;
    p.h += 1;
    expect(() => LilyPond.fromPitch(p)).toThrow();
});

test("LilyPond.fromPitch throws for an octave outside -3 to 11", () => {
    // Adding (5, 2) transposes up an octave without changing the accidental.
    let p = LilyPond.toPitch("c");
    expect(p.octave).toEqual(3);
    p.w += 5 * 8;
    p.h += 2 * 8;
    expect(p.octave).toEqual(11);
    expect(LilyPond.fromPitch(p)).toEqual("c" + "'".repeat(8));
    p.w += 5;
    p.h += 2;
    expect(() => LilyPond.fromPitch(p)).toThrow();

    p = LilyPond.toPitch("c");
    p.w -= 5 * 6;
    p.h -= 2 * 6;
    expect(p.octave).toEqual(-3);
    expect(LilyPond.fromPitch(p)).toEqual("c" + ",".repeat(6));
    p.w -= 5;
    p.h -= 2;
    expect(() => LilyPond.fromPitch(p)).toThrow();
});

test("LilyPond.relative parser class creates correct Pitch vector", () => {
    let p = SPN.toPitch("C4");
    let parser = LilyPond.relative(p);
    p = parser.toPitch("g")
    expect(p.w).toEqual(23);
    expect(p.h).toEqual(9);
    p = parser.toPitch("fisis'");
    expect(p.w).toEqual(29);
    expect(p.h).toEqual(9);
    p = parser.toPitch("c");
    expect(p.w).toEqual(25);
    expect(p.h).toEqual(10);
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

test("Helmholtz.fromPitch produces correct result", () => {
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

test("Helmholtz.fromPitch throws for an accidental beyond ±8", () => {
    let p = Helmholtz.toPitch("c");
    p.w += 8;
    p.h -= 8;
    expect(Helmholtz.fromPitch(p)).toEqual("c" + "#".repeat(8));
    p.w += 1;
    p.h -= 1;
    expect(() => Helmholtz.fromPitch(p)).toThrow();
});

test("Helmholtz.fromPitch throws for an octave outside -3 to 11", () => {
    // Adding (5, 2) transposes up an octave without changing the accidental.
    let p = Helmholtz.toPitch("c'"); // octave 4
    expect(p.octave).toEqual(4);
    p.w += 5 * 7;
    p.h += 2 * 7;
    expect(p.octave).toEqual(11);
    expect(Helmholtz.fromPitch(p)).toEqual("c" + "'".repeat(8));
    p.w += 5;
    p.h += 2;
    expect(() => Helmholtz.fromPitch(p)).toThrow();

    p = Helmholtz.toPitch("C"); // octave 2
    expect(p.octave).toEqual(2);
    p.w -= 5 * 5;
    p.h -= 2 * 5;
    expect(p.octave).toEqual(-3);
    expect(Helmholtz.fromPitch(p)).toEqual("C" + ",".repeat(5));
    p.w -= 5;
    p.h -= 2;
    expect(() => Helmholtz.fromPitch(p)).toThrow();
});

test("ABC.toPitch produces correct result", () => {
    let p = ABC.toPitch("C");
    expect(p.w).toEqual(25);
    expect(p.h).toEqual(10);
    p = ABC.toPitch("c");
    expect(p.w).toEqual(30);
    expect(p.h).toEqual(12);
    p = ABC.toPitch("c'");
    expect(p.w).toEqual(35);
    expect(p.h).toEqual(14);
    p = ABC.toPitch("C,");
    expect(p.w).toEqual(20);
    expect(p.h).toEqual(8);
    p = ABC.toPitch("^f");
    expect(p.w).toEqual(33);
    expect(p.h).toEqual(12);
});

test("ABC.fromPitch produces correct result", () => {
    let abc = "c";
    let p = ABC.toPitch(abc);
    expect(ABC.fromPitch(p)).toEqual(abc);
    abc = "^C";
    p = ABC.toPitch(abc);
    expect(ABC.fromPitch(p)).toEqual(abc);
    abc = "_C,,";
    p = ABC.toPitch(abc);
    expect(ABC.fromPitch(p)).toEqual(abc);
    abc = "^^f'''";
    p = ABC.toPitch(abc);
    expect(ABC.fromPitch(p)).toEqual(abc);
});

test("ABC.fromPitch throws for an accidental beyond ±2", () => {
    // Adding n to w and subtracting n from h raises the accidental by n
    // without changing the letter or octave.
    let p = ABC.toPitch("c");
    p.w += 2;
    p.h -= 2;
    expect(ABC.fromPitch(p)).toEqual("^".repeat(2) + "c");
    p.w += 1;
    p.h -= 1;
    expect(() => ABC.fromPitch(p)).toThrow();

    p = ABC.toPitch("c");
    p.w -= 2;
    p.h += 2;
    expect(ABC.fromPitch(p)).toEqual("_".repeat(2) + "c");
    p.w -= 1;
    p.h += 1;
    expect(() => ABC.fromPitch(p)).toThrow();
});

test("ABC.fromPitch throws for an octave outside -3 to 11", () => {
    // Adding (5, 2) transposes up an octave without changing the accidental.
    let p = ABC.toPitch("c");
    expect(p.octave).toEqual(5);
    p.w += 5 * 6;
    p.h += 2 * 6;
    expect(p.octave).toEqual(11);
    expect(ABC.fromPitch(p)).toEqual("c" + "'".repeat(6));
    p.w += 5;
    p.h += 2;
    expect(() => ABC.fromPitch(p)).toThrow();

    p = ABC.toPitch("c");
    p.w -= 5 * 8;
    p.h -= 2 * 8;
    expect(p.octave).toEqual(-3);
    expect(ABC.fromPitch(p)).toEqual("C" + ",".repeat(7));
    p.w -= 5;
    p.h -= 2;
    expect(() => ABC.fromPitch(p)).toThrow();
});
