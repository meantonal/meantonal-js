import { LETTER_COORDS } from "../constants";
import { Pitch } from "../pitch";

export class Helmholtz {
    /**
     * Create a Pitch vector from a Helmholtz note name.
     */
    static toPitch(str: string) {
        const regex = /^([A-Ga-g])([#bxw]+)?((?:'|,)*)$/;
        const match = str.match(regex);
        if (!match) {
            throw new Error(`Invalid Helmholtz string: ${str}`);
        }

        const [, letter, accidentalStr = "", octaveStr] = match;

        let { w, h } = LETTER_COORDS["CDEFGAB".indexOf(letter.toUpperCase())];

        let accidental = 0;
        const accidentalArray = accidentalStr.split("");
        accidental += accidentalArray.filter((x) => x === "#").length;
        accidental += 2 * accidentalArray.filter((x) => x === "x").length;
        accidental -= accidentalArray.filter((x) => x === "b").length;
        accidental -= 2 * accidentalArray.filter((x) => x === "w").length;
        w += accidental;
        h -= accidental;

        let octave = 0;
        if (letter.match(/[A-G]/))
            octave = 3 - octaveStr.split("").filter((x) => x === ",").length;
        if (letter.match(/[a-g]/))
            octave = 4 + octaveStr.split("").filter((x) => x === "'").length;
        w += 5 * octave;
        h += 2 * octave;

        return new Pitch(w, h);
    }

    /**
     * The Helmholtz name of a Pitch.
     */
    static fromPitch(p: Pitch): string {
        let result;
        const accNumber = p.accidental;
        let accidental = "";
        if (accNumber == 2) accidental += "x";
        else if (accNumber > 0) accidental += "#".repeat(accNumber);
        if (accNumber < 0) accidental += "b".repeat(-accNumber);

        let octave = p.octave;
        if (octave > 2)
            result = p.letter.toLowerCase() + accidental + "'".repeat(octave - 3);
        else result = p.letter + accidental + ",".repeat(2 - octave);

        return result;
    }
}
