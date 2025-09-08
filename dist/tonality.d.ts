import { Pitch } from "./pitch";
export declare class TonalContext {
    tonic: {
        letter: string;
        accidental: number;
        chroma: number;
    };
    mode: number;
    private chromaOffset;
    constructor(chroma: number, mode: number);
    private static ACCIDENTAL_MAP;
    static fromStrings(tonic: string, mode: string): TonalContext;
    degreeNumber(p: Pitch): number;
    degreeAlteration(p: Pitch): number;
    degreeChroma(degree: number): number;
    snapDiatonic(p: Pitch): Pitch;
}
