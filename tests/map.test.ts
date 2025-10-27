import { SPN, EDOMap } from "../src";

test("EDOMap produces correct number", () => {
    let p = SPN.toPitch("C4");
    let T = new EDOMap(12);
    expect(T.toNumber(p)).toEqual(60);
    T = new EDOMap(31);
    expect(T.toNumber(p)).toEqual(155);
});

test("EDOMap compares pitches correctly", () => {
    let p = SPN.toPitch("C#4");
    let q = SPN.toPitch("Db4");
    let T = new EDOMap(12);
    expect(T.compare(p, q)).toEqual(0);
    T = new EDOMap(31);
    expect(T.compare(p, q)).toBeLessThan(0);
    T = new EDOMap(53);
    expect(T.compare(p, q)).toBeGreaterThan(0);
})
