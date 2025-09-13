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
